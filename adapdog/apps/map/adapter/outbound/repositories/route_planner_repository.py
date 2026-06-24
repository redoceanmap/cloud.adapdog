from __future__ import annotations

import asyncio
import csv
import json
import logging
import re
from typing import Optional

from map.app.dtos.route_planner_dto import (
    AgentCoursePlan,
    ChatMessage,
    ChatTurn,
    CourseBrief,
    PlannedStop,
    TrailDto,
)
from map.app.ports.input.pet_place_use_case import PetPlaceUseCase
from map.app.ports.output.route_planner_port import RoutePlannerAgentPort, TrailPort
from map.domain.entities.pet_place_entity import PetFriendlyPlace
from map.domain.entities.route_planner_entity import RouteCourse, Trail
from map.domain.value_objects.pet_place_vo import Coordinate, PetSize

logger = logging.getLogger(__name__)

_TRAIL_CAP = 5  # 응답·LLM 맥락에 넘길 추천 둘레길 상한

# 대화에서 지역을 사전 조회(find_places)·폴백에 쓰기 위한 휴리스틱 후보.
# LLM이 대화를 끌어가되, 시설 조회는 async 계층에서 미리 해야 하므로(루프 안전) 토큰 매칭으로 지역만 뽑는다.
_REGION_HINTS = (
    "전주", "강릉", "서울", "부산", "대구", "인천", "광주", "대전", "울산", "세종",
    "수원", "속초", "경주", "여수", "통영", "춘천", "가평", "양평", "포항", "안동",
    "군산", "목포", "순천", "남원", "제주", "경기", "강원", "충북", "충남", "전북",
    "전남", "경북", "경남",
)

_CHAT_SYSTEM_INSTRUCTION = (
    "당신은 반려견과 함께하는 여행 동선을 짜주는 친근한 플래너입니다. "
    "사용자와 한국어로 자연스럽게 대화하세요. 지역·분위기가 불명확하면 한 가지씩 물어보세요. "
    "후보 시설 목록이 제공되면, 반려견의 휴식(과도한 이동 금지)과 동선 효율을 고려해 방문 순서를 정하고 "
    "그 코스를 사람에게 설명하듯 1~3문장으로 제안하세요. 후보로 받은 시설만 사용하고 지어내지 마세요. "
    "코스를 제안할 때는 답변 맨 끝에 JSON 한 줄을 덧붙이세요: "
    '{"ordered_place_ids": [정수 id...]}. '
    "아직 코스를 확정하지 않는 일반 대화에서는 JSON을 넣지 마세요."
)


def _guess_region(messages: list[ChatMessage]) -> Optional[str]:
    """대화에서 지역명을 추출(사전 조회·폴백용 휴리스틱). 최근 사용자 메시지 우선."""
    for m in reversed(messages):
        if m.role != "user":
            continue
        for hint in _REGION_HINTS:
            if hint in m.content:
                return hint
    return None

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

    async def chat(self, messages: list[ChatMessage], pet_size: PetSize, pet_breed: Optional[str]) -> ChatTurn:
        """LLM 없는 폴백 대화 — 지역을 추출해 인근순 코스를 제안하거나, 없으면 지역을 되묻는다."""
        region = _guess_region(messages)
        if not region:
            return ChatTurn(reply="어디로 떠나고 싶으세요? 지역이나 분위기를 한 줄로 알려주시면 코스를 짜볼게요.")

        brief = CourseBrief(region=region, days=1, pet_size=pet_size, pet_breed=pet_breed)
        places = await self.pet_place.find_places(region)
        candidates = _destinations(places, brief)
        if not candidates:
            return ChatTurn(
                reply=f"{region} 쪽 반려동물 동반 가능한 시설 데이터를 아직 못 찾았어요. 다른 지역도 알려주실래요?",
                region=region,
            )

        course = _nearest_neighbor(candidates)
        stops = [_to_stop(p) for p in course.stops[:_max_stops(brief)]]
        trails = [_to_trail_dto(t) for t in (await self.trail_port.find_trails(region))[:_TRAIL_CAP]]
        reply = (
            f"{region}에서 {pet_size.value} 동반 가능한 {len(stops)}곳을 가까운 순서로 묶어봤어요. "
            "마음에 들면 '동선·지도 보기'로 확인해보세요!"
        )
        logger.info("[RuleBasedRoutePlannerAgent] chat | region=%s stops=%d", region, len(stops))
        return ChatTurn(reply=reply, region=region, plan=AgentCoursePlan(stops=stops, narrative=reply, trails=trails))


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

    async def chat(self, messages: list[ChatMessage], pet_size: PetSize, pet_breed: Optional[str]) -> ChatTurn:
        """멀티턴 대화 동선 — 시설 조회는 async 계층에서 미리 하고(루프 안전), Gemini는 대화+순서 결정만.

        단발 plan()의 함수호출과 달리, 대화 중엔 지역이 점진적으로 드러나므로
        _guess_region으로 지역을 추정해 후보를 사전 조회하고 컨텍스트로 제공한다.
        """
        region = _guess_region(messages)
        candidates: list[PetFriendlyPlace] = []
        trails: list[Trail] = []
        if region:
            brief = CourseBrief(region=region, days=1, pet_size=pet_size, pet_breed=pet_breed)
            candidates = _destinations(await self.pet_place.find_places(region), brief)
            trails = (await self.trail_port.find_trails(region))[:_TRAIL_CAP]

        try:
            reply, ordered_ids = await asyncio.to_thread(
                self._run_chat, messages, pet_size, pet_breed, region, candidates
            )
        except Exception as e:  # noqa: BLE001 — Gemini 장애 시 규칙기반 폴백(서비스 유지)
            logger.warning("[GeminiRoutePlannerAgent] chat 실패 → 규칙기반 폴백 | %s", e)
            return await RuleBasedRoutePlannerAgent(self.pet_place, self.trail_port).chat(
                messages, pet_size, pet_breed
            )

        by_id = {p.id: p for p in candidates}
        max_stops = _max_stops(CourseBrief(region or "", 1, pet_size, pet_breed))
        stops = [_to_stop(by_id[i]) for i in ordered_ids if i in by_id][:max_stops]
        plan = (
            AgentCoursePlan(stops=stops, narrative=reply, trails=[_to_trail_dto(t) for t in trails])
            if stops
            else None
        )
        logger.info("[GeminiRoutePlannerAgent] chat | region=%s stops=%d", region, len(stops))
        return ChatTurn(reply=reply, region=region, plan=plan)

    def _run_chat(
        self,
        messages: list[ChatMessage],
        pet_size: PetSize,
        pet_breed: Optional[str],
        region: Optional[str],
        candidates: list[PetFriendlyPlace],
    ) -> tuple[str, list[int]]:
        snapshot = {
            p.id: {"id": p.id, "name": p.name, "category": p.category}
            for p in candidates
        }
        history = [
            {"role": "user" if m.role == "user" else "model", "parts": [m.content]}
            for m in messages[:-1]
        ]
        latest = messages[-1].content if messages else ""

        if candidates:
            lines = "\n".join(f'- id={v["id"]} {v["name"]}({v["category"]})' for v in snapshot.values())
            ctx = f"\n[{region} 반려동물 동반 가능 후보 시설]\n{lines}\n"
        elif region:
            ctx = f"\n({region} 후보 시설 데이터를 찾지 못함 — 다른 지역을 권해도 됩니다.)\n"
        else:
            ctx = "\n(아직 지역이 정해지지 않음 — 어디로 가고 싶은지 물어보세요.)\n"

        model = self._genai.GenerativeModel(
            self.model_name, system_instruction=_CHAT_SYSTEM_INSTRUCTION
        )
        chat = model.start_chat(history=history)
        prompt = f"반려견: {pet_breed or '미지정'} ({pet_size.value}){ctx}\n사용자: {latest}"
        resp = chat.send_message(prompt)
        return _parse_chat(resp.text, valid_ids=set(snapshot))


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


def _parse_chat(text: str, valid_ids: set[int]) -> tuple[str, list[int]]:
    """대화 응답에서 (사용자에게 보일 텍스트, 코스 id 목록)을 분리한다.

    Gemini가 코스를 제안할 때만 끝에 {"ordered_place_ids":[...]} JSON을 붙이도록 했다.
    JSON이 있으면 떼어내 파싱하고, 나머지 자연어를 답변으로 쓴다.
    """
    ordered: list[int] = []
    visible = text
    match = re.search(r"\{[^{}]*ordered_place_ids[^{}]*\}", text, re.DOTALL)
    if match:
        try:
            data = json.loads(match.group(0))
            ordered = [int(i) for i in data.get("ordered_place_ids", []) if int(i) in valid_ids]
        except (json.JSONDecodeError, ValueError, TypeError):
            ordered = []
        visible = text[: match.start()] + text[match.end():]
    visible = re.sub(r"```(json)?", "", visible).strip()
    return (visible or "이런 코스는 어떠세요?"), ordered


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
