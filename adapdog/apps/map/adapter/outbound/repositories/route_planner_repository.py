from __future__ import annotations

import asyncio
import csv
import json
import logging
import re
from typing import Optional

from map.app.dtos.route_planner_dto import AgentCoursePlan, CourseBrief, PlannedStop, TrailDto
from map.app.ports.input.pet_place_use_case import PetPlaceUseCase
from map.app.ports.output.route_planner_port import RoutePlannerAgentPort, TrailPort
from map.domain.entities.pet_place_entity import PetFriendlyPlace
from map.domain.entities.route_planner_entity import RouteCourse, Trail
from map.domain.value_objects.pet_place_vo import Coordinate

logger = logging.getLogger(__name__)

_TRAIL_CAP = 5  # 응답·LLM 맥락에 넘길 추천 둘레길 상한

_SYSTEM_INSTRUCTION = (
    "당신은 반려견과 함께하는 여행의 동선을 짜주는 전문가입니다. "
    "반드시 제공된 find_pet_friendly_places 도구를 호출해 후보 시설을 받아온 뒤, "
    "반려견의 휴식(과도한 이동 금지)과 동선 효율을 고려해 방문 순서를 정하세요. "
    "후보로 받은 시설만 사용하고 임의로 시설을 지어내지 마세요. "
    '최종 답변은 오직 JSON 한 개로만 출력하세요: '
    '{"ordered_place_ids": [정수...], "narrative": "한국어 한두 문장 설명"}'
)


_CANDIDATE_CAP = 40  # 에이전트에 넘길 후보 상한(중심점 인근)


def _max_stops(brief: CourseBrief) -> int:
    """여행 일수 기반 정류장 상한 (하루 ~4곳, 최소 3)."""
    return max(3, min(brief.days * 4, 12))


def _destinations(places: list[PetFriendlyPlace], brief: CourseBrief) -> list[PetFriendlyPlace]:
    """동선 후보 = 크기 동반 가능 + 동물병원 제외 → 중심점 인근 _CANDIDATE_CAP개로 큐레이션."""
    pool = [p for p in places if p.accommodates(brief.pet_size) and not p.is_animal_hospital()]
    if len(pool) <= _CANDIDATE_CAP:
        return pool
    lat = sum(p.coordinate.latitude for p in pool) / len(pool)
    lng = sum(p.coordinate.longitude for p in pool) / len(pool)
    center = Coordinate(lat, lng)
    return sorted(pool, key=lambda p: center.distance_km_to(p.coordinate))[:_CANDIDATE_CAP]


class RuleBasedRoutePlannerAgent(RoutePlannerAgentPort):
    """규칙기반 폴백 에이전트 (GEMINI_API_KEY 없을 때). 최근접 이웃 정렬."""

    def __init__(self, pet_place: PetPlaceUseCase, trail_port: TrailPort) -> None:
        self.pet_place = pet_place
        self.trail_port = trail_port

    async def plan(self, brief: CourseBrief) -> AgentCoursePlan:
        places = await self.pet_place.find_places(brief.region)
        candidates = _destinations(places, brief)
        course = _nearest_neighbor(candidates)
        stops = [_to_stop(p) for p in course.stops[:_max_stops(brief)]]
        trails = [_to_trail_dto(t) for t in (await self.trail_port.find_trails(brief.region))[:_TRAIL_CAP]]
        narrative = (
            f"{brief.region} {brief.days}일 일정으로 {brief.pet_size.value} 동반 가능한 "
            f"{len(stops)}곳을 가까운 순서로 묶었어요."
            if stops
            else f"{brief.region}에서 {brief.pet_size.value} 동반 가능한 시설을 찾지 못했어요."
        )
        logger.info("[RuleBasedRoutePlannerAgent] plan | region=%s stops=%d trails=%d",
                    brief.region, len(stops), len(trails))
        return AgentCoursePlan(stops=stops, narrative=narrative, trails=trails)


class GeminiRoutePlannerAgent(RoutePlannerAgentPort):
    """Gemini 함수호출 기반 동선 에이전트.

    Gemini가 find_pet_friendly_places 도구를 호출해 데이터(pet_place use case)를 직접 가져가고,
    반려견 제약을 반영해 방문 순서와 설명을 생성한다.
    """

    def __init__(self, pet_place: PetPlaceUseCase, trail_port: TrailPort, api_key: str, model_name: str) -> None:
        import google.generativeai as genai

        self.pet_place = pet_place
        self.trail_port = trail_port
        self.model_name = model_name
        self._genai = genai
        genai.configure(api_key=api_key)

    async def plan(self, brief: CourseBrief) -> AgentCoursePlan:
        places = await self.pet_place.find_places(brief.region)
        candidates = _destinations(places, brief)
        by_id = {p.id: p for p in candidates}
        trails = (await self.trail_port.find_trails(brief.region))[:_TRAIL_CAP]
        trail_dtos = [_to_trail_dto(t) for t in trails]
        if not candidates:
            return AgentCoursePlan(stops=[], narrative=f"{brief.region}에서 {brief.pet_size.value} 동반 가능한 시설을 찾지 못했어요.", trails=trail_dtos)

        try:
            ordered_ids, narrative = await asyncio.to_thread(self._run_gemini, brief, candidates, trails)
        except Exception as e:  # noqa: BLE001 — Gemini 장애 시 인근순 폴백(서비스 유지)
            logger.warning("[GeminiRoutePlannerAgent] Gemini 실패 → 인근순 폴백 | %s", e)
            ordered_ids, narrative = [], f"{brief.region} {brief.days}일 일정으로 가까운 순서로 동선을 묶었어요."

        cap = _max_stops(brief)
        stops = [_to_stop(by_id[pid]) for pid in ordered_ids if pid in by_id][:cap]
        if not stops:  # 에이전트가 못 고르면 인근 순으로 채움
            stops = [_to_stop(p) for p in candidates[:cap]]
        logger.info("[GeminiRoutePlannerAgent] plan | region=%s stops=%d trails=%d",
                    brief.region, len(stops), len(trail_dtos))
        return AgentCoursePlan(stops=stops, narrative=narrative, trails=trail_dtos)

    def _run_gemini(self, brief: CourseBrief, candidates: list[PetFriendlyPlace], trails: list[Trail]) -> tuple[list[int], str]:
        snapshot = {
            p.id: {"id": p.id, "name": p.name, "category": p.category,
                   "latitude": p.coordinate.latitude, "longitude": p.coordinate.longitude}
            for p in candidates
        }

        def find_pet_friendly_places(region: str) -> list[dict]:
            """지정한 지역의 반려동물 동반 가능 시설 목록을 반환한다.

            Args:
                region: 여행 지역명 (예: 강릉)
            """
            return list(snapshot.values())

        model = self._genai.GenerativeModel(
            self.model_name,
            tools=[find_pet_friendly_places],
            system_instruction=_SYSTEM_INSTRUCTION,
        )
        chat = model.start_chat(enable_automatic_function_calling=True)
        trail_block = ""
        if trails:
            lines = "\n".join(
                f"- {t.name}({t.length_km or '?'}km, {t.duration}): {t.intro}" for t in trails
            )
            trail_block = (
                f"\n참고용 인근 추천 둘레길(좌표 없음, 정류장 아님):\n{lines}\n"
                "동선과 어울리면 설명(narrative)에 둘레길 1곳을 자연스럽게 녹여도 좋습니다.\n"
            )
        prompt = (
            f"지역: {brief.region}\n여행 일수: {brief.days}일\n"
            f"반려견 크기: {brief.pet_size.value}\n견종: {brief.pet_breed or '미지정'}\n"
            f"{trail_block}"
            "find_pet_friendly_places 도구로 시설을 받아 동선을 짜고 JSON으로만 답하세요."
        )
        resp = chat.send_message(prompt)
        return _parse_plan(resp.text, valid_ids=set(snapshot))


def _to_stop(p: PetFriendlyPlace) -> PlannedStop:
    return PlannedStop(p.id, p.name, p.category, p.coordinate.latitude, p.coordinate.longitude)


def _nearest_neighbor(places: list[PetFriendlyPlace]) -> RouteCourse:
    if not places:
        return RouteCourse(stops=[])
    remaining = list(places)
    ordered = [remaining.pop(0)]
    while remaining:
        last = ordered[-1]
        nxt = min(remaining, key=lambda p: last.coordinate.distance_km_to(p.coordinate))
        remaining.remove(nxt)
        ordered.append(nxt)
    return RouteCourse(stops=ordered)


def _parse_plan(text: str, valid_ids: set[int]) -> tuple[list[int], str]:
    match = re.search(r"\{.*\}", text, re.DOTALL)
    if not match:
        return [], text.strip()[:200]
    try:
        data = json.loads(match.group(0))
    except json.JSONDecodeError:
        return [], text.strip()[:200]
    ordered = [int(i) for i in data.get("ordered_place_ids", []) if int(i) in valid_ids]
    return ordered, str(data.get("narrative", "")).strip()


# ── 관광 둘레길 (전국길관광정보 CSV) ──────────────────────────────────────────────
def _parse_length(raw: Optional[str]) -> Optional[float]:
    try:
        return float((raw or "").strip())
    except (TypeError, ValueError):
        return None


def _to_trail_dto(t: Trail) -> TrailDto:
    return TrailDto(name=t.name, intro=t.intro, length_km=t.length_km,
                    duration=t.duration, start_point=t.start_point, waypoints=t.waypoints)


class CsvTrailRepository(TrailPort):
    """전국길관광정보 CSV(cp949) 둘레길 조회. 시작지점 주소로 지역 필터. 1회 로드 후 캐시."""

    def __init__(self, csv_path: str) -> None:
        self.csv_path = csv_path
        self._cache: Optional[list[Trail]] = None

    def _load(self) -> list[Trail]:
        if self._cache is None:
            trails: list[Trail] = []
            with open(self.csv_path, encoding="cp949", newline="") as f:
                for r in csv.DictReader(f):
                    name = (r.get("길명") or "").strip()
                    if not name:
                        continue
                    start_addr = (r.get("시작지점도로명주소") or "").strip() or (r.get("시작지점소재지지번주소") or "").strip()
                    trails.append(Trail(
                        name=name,
                        intro=(r.get("길소개") or "").strip(),
                        length_km=_parse_length(r.get("총길이")),
                        duration=(r.get("총소요시간") or "").strip(),
                        start_point=(r.get("시작지점명") or "").strip(),
                        region=start_addr,
                        waypoints=(r.get("경로정보") or "").strip(),
                    ))
            self._cache = trails
            logger.info("[CsvTrailRepository] 로드 | trails=%d", len(trails))
        return self._cache

    async def find_trails(self, region: str) -> list[Trail]:
        region = region.strip()
        trails = await asyncio.to_thread(self._load)
        matched = [t for t in trails if region in t.region]
        logger.info("[CsvTrailRepository] find_trails | region=%s matched=%d", region, len(matched))
        return matched
