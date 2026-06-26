from __future__ import annotations

import asyncio
import csv
import json
import logging
import math
import re
from typing import Optional

from map.app.dtos.route_planner_dto import (
    AgentCoursePlan,
    ChatMessage,
    ChatTurn,
    CourseBrief,
    CourseStopRef,
    PlannedStop,
    TrailDto,
)
from map.app.ports.input.pet_place_use_case import PetPlaceUseCase
from map.app.ports.output.route_planner_port import (
    LodgingPort,
    RouteLegsPort,
    RoutePlannerAgentPort,
    TrailPort,
)
from map.domain.entities.pet_place_entity import PetFriendlyPlace
from map.domain.entities.route_planner_entity import RouteCourse, Trail
from map.domain.value_objects.pet_place_vo import Coordinate, PetSize
from map.domain.value_objects.route_planner_vo import TransportMode

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
    "반려견의 특징(활동성향·사회성·체질)이 주어지면 기억하고 추천에 반영하세요 "
    "(예: 추위 취약→실내·따뜻한 곳, 더위 취약→그늘·실내, 겁 많음→한적한 곳, 관절 주의→평지). "
    "사용자와 한국어로 자연스럽게 대화하세요. 지역·분위기가 불명확하면 한 가지씩 물어보세요. "
    "후보 시설 목록이 제공되면, 반려견의 휴식(과도한 이동 금지)과 동선 효율을 고려해 방문 순서를 정하고 "
    "그 코스를 사람에게 설명하듯 1~3문장으로 제안하세요. 후보로 받은 시설만 사용하고 지어내지 마세요. "
    "코스를 제안할 때는 답변 맨 끝에 JSON 한 줄을 덧붙이세요: "
    '{"ordered_place_ids": [정수 id...]}. '
    "아직 코스를 확정하지 않는 일반 대화에서는 JSON을 넣지 마세요."
)


_COURSE_ANALYSIS_INSTRUCTION = (
    "당신은 반려견과 함께하는 여행 동선을 다듬어주는 친근한 플래너입니다. "
    "사용자의 '현재 코스'와 후보 시설 목록, 그리고 사용자의 요청이 주어집니다. "
    "먼저 현재 코스의 성격을 한눈에 분석하세요 — 예: 박물관·전시가 많아 실내 위주로 빡빡한지, "
    "야외만 많아 더위에 지칠지, 비슷한 업종이 몰려 단조로운지. "
    "그 분석에 근거해 균형을 맞출 대안을 후보 목록에서 1~3곳 골라 추천하세요 "
    "(예: 박물관이 많으면 쉬어갈 카페나 탁 트인 공원, 실내가 없으면 더위 피할 실내). "
    "추천은 사람에게 말하듯 따뜻하게, 왜 그곳인지 이유를 곁들여 2~4문장으로 설명하세요. "
    "후보로 받은 시설만 사용하고 지어내지 마세요. 현재 코스에 이미 있는 곳은 추천하지 마세요. "
    "답변 맨 끝에 JSON 한 줄을 덧붙이세요: "
    '{"recommend_place_ids": [정수 id...]}. 추천할 곳이 없으면 빈 배열.'
)

# 추천 균형용 업종 힌트 — 카테고리 부분일치로 코스 분포를 읽는다(규칙기반 폴백에서 사용).
_CATEGORY_HINTS = {
    "카페": ("카페", "음식", "식당", "맛집"),
    "공원": ("공원", "여행", "관광", "명소", "호수", "정원", "수목", "둘레", "산책"),
    "박물관": ("박물관", "미술관", "전시", "문화", "문예", "유산"),
}


def _by_category_hint(places: list[PetFriendlyPlace], hints: tuple[str, ...]) -> list[PetFriendlyPlace]:
    """후보 중 업종 힌트(부분일치)에 해당하는 시설만 추린다."""
    return [p for p in places if any(h in (p.category or "") for h in hints)]


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
    "프롬프트에 주어진 후보 시설 목록에서만 골라, "
    "반려견의 휴식(과도한 이동 금지)과 동선 효율을 고려해 방문 순서를 정하세요. "
    "후보에 없는 시설을 임의로 지어내지 마세요. "
    '최종 답변은 오직 JSON 한 개로만 출력하세요: '
    '{"ordered_place_ids": [정수...], "narrative": "한국어 한두 문장 설명"}'
)


_CANDIDATE_CAP = 40  # 에이전트에 넘길 후보 상한(중심점 인근)

# 코스 결과 캐시 — 동일 브리프(데모는 전주/대형견 고정)는 LLM 재호출 없이 즉시 반환.
# 프로세스 수명 동안 유지(데이터 시드가 바뀌지 않는 데모 전제). 키: (region, days, size, breed)
_PLAN_CACHE: dict[tuple, "AgentCoursePlan"] = {}
_PLAN_LOCKS: dict[tuple, asyncio.Lock] = {}

# 동선에 부적합한 노이즈 카테고리(미용·용품·마트·병원·약국 등).
_NOISE_KEYWORDS = ('미용', '용품', '마트', '병원', '약국', '펫샵', '쇼핑', '편의점', '주유')
# 숙박류 — 낮 동선(정류장)이 아니라 '어울리는 숙소' 섹션에 들어가야 하므로 코스 후보에서 제외.
_LODGING_KEYWORDS = ('숙박', '펜션', '펜스테이', '호텔', '게스트', '스테이', '모텔', '민박', '리조트')


def _is_visitable(category: str) -> bool:
    """낮 동선 정류장으로 적합한지 — 노이즈·숙박 업종 제외(관광지/음식점/카페/문화류만)."""
    c = category or ''
    return not any(k in c for k in _NOISE_KEYWORDS) and not any(k in c for k in _LODGING_KEYWORDS)


def _max_stops(brief: CourseBrief) -> int:
    """추천 정류장 상한 — 현실적 일정(하루 ~4곳). 당일 4곳·1박 8곳·2박+ 최대 12."""
    return max(4, min(brief.days * 4, 12))


# 이동수단별 후보 큐레이션 기준점 — 직행(KTX·버스)은 도착지(역·터미널) 인근 도심 클러스터를
# 우선하고, 자차는 풀 평균 중심(외곽 포함 더 넓게)으로 분산시켜 코스가 수단별로 달라지게 한다.
_CANDIDATE_CENTER = {
    TransportMode.KTX: Coordinate(35.8503, 127.1602),   # 전주역
    TransportMode.BUS: Coordinate(35.8345, 127.1292),   # 전주고속버스터미널
}

# 이동수단별 코스 성격 힌트 — LLM이 같은 후보라도 수단에 맞게 다르게 동선을 짜도록.
_TRANSPORT_HINT = {
    TransportMode.KTX: "이동수단: KTX(전주역 도착). 차가 없으니 역·한옥마을 도보권 도심 명소 중심으로, 정류장 간 이동이 짧게 묶어주세요.\n",
    TransportMode.BUS: "이동수단: 고속버스(전주고속버스터미널 도착). 차가 없으니 터미널·도심 도보권 명소 중심으로, 대중교통으로 다니기 쉽게 묶어주세요.\n",
    TransportMode.CAR: "이동수단: 자차. 외곽에 흩어진 명소도 포함해 폭넓게 묶어도 좋습니다. 이동 구간은 대형견 체리의 휴식·창밖 구경 시간으로 활용하세요.\n",
}


def _destinations(places: list[PetFriendlyPlace], brief: CourseBrief) -> list[PetFriendlyPlace]:
    """동선 후보 = 크기 동반 가능 + 동물병원 제외 → 이동수단별 기준점 인근 _CANDIDATE_CAP개로 큐레이션."""
    pool = [
        p for p in places
        if p.accommodates(brief.pet_size) and not p.is_animal_hospital() and _is_visitable(p.category)
    ]
    if len(pool) <= _CANDIDATE_CAP:
        return pool
    center = _CANDIDATE_CENTER.get(brief.transport)
    if center is None:  # 자차·미정 = 풀 평균 중심(외곽 포함 더 넓게 분산)
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
        via = f"{brief.transport.label}로 " if brief.transport is not TransportMode.UNSET else ""
        narrative = (
            f"{via}{brief.region} {brief.days}일 일정으로 {brief.pet_size.value} 동반 가능한 "
            f"{len(stops)}곳을 가까운 순서로 묶었어요."
            if stops
            else f"{brief.region}에서 {brief.pet_size.value} 동반 가능한 시설을 찾지 못했어요."
        )
        logger.info("[RuleBasedRoutePlannerAgent] plan | region=%s stops=%d trails=%d",
                    brief.region, len(stops), len(trails))
        return AgentCoursePlan(stops=stops, narrative=narrative, trails=trails)

    async def chat(self, messages: list[ChatMessage], pet_size: PetSize, pet_breed: Optional[str], pet_traits: Optional[str] = None) -> ChatTurn:
        """LLM 없는 폴백 대화 — 지역을 추출해 인근순 코스를 제안하거나, 없으면 지역을 되묻는다. (특징은 규칙기반에선 미사용)"""
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

    async def recommend(
        self, region: str, messages: list[ChatMessage], current_course: list[CourseStopRef],
        pet_size: PetSize, pet_breed: Optional[str], pet_traits: Optional[str] = None,
    ) -> tuple[str, list[PlannedStop]]:
        """LLM 없는 폴백 추천 — 코스 카테고리 분포를 보고 빠진 쉼표(카페/공원)를 후보에서 고른다."""
        brief = CourseBrief(region=region, days=1, pet_size=pet_size, pet_breed=pet_breed)
        candidates = _destinations(await self.pet_place.find_places(region), brief)
        picks, reply = _rule_recommend(current_course, candidates)
        logger.info("[RuleBasedRoutePlannerAgent] recommend | region=%s picks=%d", region, len(picks))
        return reply, [_to_stop(p) for p in picks]


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
        key = (brief.region, brief.days, brief.pet_size.value, brief.pet_breed or "", brief.transport.value)
        cached = _PLAN_CACHE.get(key)
        if cached is not None:  # 동일 브리프(데모 전주/대형견 등)는 LLM 재호출 없이 즉시 반환
            logger.info("[GeminiRoutePlannerAgent] plan cache hit | %s", key)
            return cached

        lock = _PLAN_LOCKS.setdefault(key, asyncio.Lock())
        async with lock:  # 동일 키 동시 요청은 한 번만 계산(thundering herd 방지)
            cached = _PLAN_CACHE.get(key)
            if cached is not None:
                return cached
            result = await self._compute_plan(brief)
            _PLAN_CACHE[key] = result
            return result

    async def _compute_plan(self, brief: CourseBrief) -> AgentCoursePlan:
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
        chosen = [by_id[pid] for pid in ordered_ids if pid in by_id]
        if not chosen:  # 에이전트가 못 고르면 인근 순 시작점만 잡고 채운다
            chosen = candidates[:1]
        stops = [_to_stop(p) for p in _fill_route(chosen, candidates, cap)]
        logger.info("[GeminiRoutePlannerAgent] plan | region=%s stops=%d trails=%d",
                    brief.region, len(stops), len(trail_dtos))
        return AgentCoursePlan(stops=stops, narrative=narrative, trails=trail_dtos)

    def _run_gemini(self, brief: CourseBrief, candidates: list[PetFriendlyPlace], trails: list[Trail]) -> tuple[list[int], str]:
        # 후보는 이미 파이썬에서 조회됨 → 프롬프트에 인라인해 단일 왕복으로 순서만 받는다
        # (함수호출 자동 모드는 왕복 2회라 느림). chat() 경로와 동일한 효율 패턴.
        place_lines = "\n".join(f"- id={p.id} {p.name}({p.category})" for p in candidates)
        trail_block = ""
        if trails:
            lines = "\n".join(
                f"- {t.name}({t.length_km or '?'}km, {t.duration}): {t.intro}" for t in trails
            )
            trail_block = (
                f"\n참고용 인근 추천 둘레길(좌표 없음, 정류장 아님):\n{lines}\n"
                "동선과 어울리면 설명(narrative)에 둘레길 1곳을 자연스럽게 녹여도 좋습니다.\n"
            )
        model = self._genai.GenerativeModel(
            self.model_name, system_instruction=_SYSTEM_INSTRUCTION
        )
        transport_hint = _TRANSPORT_HINT.get(brief.transport, "")
        prompt = (
            f"지역: {brief.region}\n여행 일수: {brief.days}일\n"
            f"반려견 크기: {brief.pet_size.value}\n견종: {brief.pet_breed or '미지정'}\n"
            f"{transport_hint}"
            f"{trail_block}"
            f"\n[동반 가능 후보 시설]\n{place_lines}\n\n"
            "위 후보 중에서만 골라 동선 순서를 정하고 JSON으로만 답하세요."
        )
        resp = model.generate_content(prompt)
        return _parse_plan(resp.text, valid_ids={p.id for p in candidates})

    async def chat(self, messages: list[ChatMessage], pet_size: PetSize, pet_breed: Optional[str], pet_traits: Optional[str] = None) -> ChatTurn:
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
                self._run_chat, messages, pet_size, pet_breed, region, candidates, pet_traits
            )
        except Exception as e:  # noqa: BLE001 — Gemini 장애 시 규칙기반 폴백(서비스 유지)
            logger.warning("[GeminiRoutePlannerAgent] chat 실패 → 규칙기반 폴백 | %s", e)
            return await RuleBasedRoutePlannerAgent(self.pet_place, self.trail_port).chat(
                messages, pet_size, pet_breed
            )

        by_id = {p.id: p for p in candidates}
        max_stops = _max_stops(CourseBrief(region or "", 1, pet_size, pet_breed))
        # 코스를 제안한 턴만 후보로 채워 cap까지 늘리고, 일반 대화 턴은 빈 채로 둔다.
        chosen = [by_id[i] for i in ordered_ids if i in by_id]
        stops = [_to_stop(p) for p in _fill_route(chosen, candidates, max_stops)] if chosen else []
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
        pet_traits: Optional[str] = None,
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
        traits_line = f" · 특징: {pet_traits}" if pet_traits else ""
        prompt = f"반려견: {pet_breed or '미지정'} ({pet_size.value}){traits_line}{ctx}\n사용자: {latest}"
        resp = chat.send_message(prompt)
        return _parse_chat(resp.text, valid_ids=set(snapshot))

    async def recommend(
        self, region: str, messages: list[ChatMessage], current_course: list[CourseStopRef],
        pet_size: PetSize, pet_breed: Optional[str], pet_traits: Optional[str] = None,
    ) -> tuple[str, list[PlannedStop]]:
        """현재 코스를 분석해 대안을 추천 — 후보는 async 계층에서 미리 조회, Gemini는 분석+선택만.

        코스에 이미 있는 곳은 후보에서 빼서 중복 추천을 막는다.
        """
        brief = CourseBrief(region=region, days=1, pet_size=pet_size, pet_breed=pet_breed)
        pool = _destinations(await self.pet_place.find_places(region), brief)
        in_course = {s.name for s in current_course}
        candidates = [p for p in pool if p.name not in in_course]
        if not candidates:
            return "추천할 만한 다른 장소를 못 찾았어요. 다른 종류를 알려주시면 더 찾아볼게요!", []

        try:
            reply, ids = await asyncio.to_thread(
                self._run_recommend, messages, current_course, candidates, pet_size, pet_breed, pet_traits
            )
        except Exception as e:  # noqa: BLE001 — Gemini 장애 시 규칙기반 폴백(서비스 유지)
            logger.warning("[GeminiRoutePlannerAgent] recommend 실패 → 규칙기반 폴백 | %s", e)
            picks, reply = _rule_recommend(current_course, candidates)
            return reply, [_to_stop(p) for p in picks]

        by_id = {p.id: p for p in candidates}
        picks = [by_id[i] for i in ids if i in by_id][:3]
        logger.info("[GeminiRoutePlannerAgent] recommend | region=%s picks=%d", region, len(picks))
        return reply, [_to_stop(p) for p in picks]

    def _run_recommend(
        self, messages: list[ChatMessage], current_course: list[CourseStopRef],
        candidates: list[PetFriendlyPlace], pet_size: PetSize, pet_breed: Optional[str],
        pet_traits: Optional[str],
    ) -> tuple[str, list[int]]:
        latest = messages[-1].content if messages else ""
        course_lines = "\n".join(f"- {s.name}({s.category})" for s in current_course) or "(아직 코스가 비어 있음)"
        cand_lines = "\n".join(f"- id={p.id} {p.name}({p.category})" for p in candidates)
        model = self._genai.GenerativeModel(
            self.model_name, system_instruction=_COURSE_ANALYSIS_INSTRUCTION
        )
        traits_line = f" · 특징: {pet_traits}" if pet_traits else ""
        prompt = (
            f"반려견: {pet_breed or '미지정'} ({pet_size.value}){traits_line}\n\n"
            f"[현재 코스]\n{course_lines}\n\n"
            f"[추천 후보 시설]\n{cand_lines}\n\n"
            f"사용자 요청: {latest}\n\n"
            "현재 코스를 분석해 균형을 맞출 대안을 후보 중에서 추천하고, 끝에 JSON 한 줄을 붙이세요."
        )
        resp = model.generate_content(prompt)
        return _parse_recommend(resp.text, valid_ids={p.id for p in candidates})


def _rule_recommend(
    current_course: list[CourseStopRef], candidates: list[PetFriendlyPlace]
) -> tuple[list[PetFriendlyPlace], str]:
    """규칙 기반 추천 — 코스 업종 분포를 보고 빠진 '쉼표'(카페·공원)를 후보에서 고른다."""
    in_course = {s.name for s in current_course}
    pool = [p for p in candidates if p.name not in in_course]
    cats = [s.category or "" for s in current_course]
    n = len(cats) or 1
    museum_heavy = sum(1 for c in cats if any(h in c for h in _CATEGORY_HINTS["박물관"])) / n >= 0.5

    picks: list[PetFriendlyPlace] = []
    cafe = _by_category_hint(pool, _CATEGORY_HINTS["카페"])
    park = _by_category_hint(pool, _CATEGORY_HINTS["공원"])
    if cafe:
        picks.append(cafe[0])
    if park:
        picks.append(park[0])
    picks = picks[:2]

    if not picks:
        return [], "지금 코스에 더할 만한 다른 종류를 못 찾았어요. 원하는 분위기를 알려주시면 더 찾아볼게요!"
    names = ", ".join(p.name for p in picks)
    if museum_heavy:
        reply = (
            f"지금 코스가 박물관·전시 위주라 체리가 실내만 다니다 지칠 수 있어요. "
            f"중간에 쉬어갈 {names} 같은 곳을 더하면 한결 여유로워져요. 추가해볼까요?"
        )
    else:
        reply = f"코스에 변화를 줄 만한 {names}을(를) 골라봤어요. 마음에 들면 추가해보세요!"
    return picks, reply


def _to_stop(p: PetFriendlyPlace) -> PlannedStop:
    return PlannedStop(p.id, p.name, p.category, p.coordinate.latitude, p.coordinate.longitude)


def _fill_route(
    chosen: list[PetFriendlyPlace], pool: list[PetFriendlyPlace], cap: int
) -> list[PetFriendlyPlace]:
    """에이전트가 고른 정류장 뒤에 남은 후보를 인근순으로 이어붙여 cap까지 늘린다(더보기 페이징용)."""
    used = {p.id for p in chosen}
    remaining = [p for p in pool if p.id not in used]
    ordered = list(chosen)
    while remaining and len(ordered) < cap:
        last = ordered[-1]
        nxt = min(remaining, key=lambda p: last.coordinate.distance_km_to(p.coordinate))
        remaining.remove(nxt)
        ordered.append(nxt)
    return ordered[:cap]


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


def _parse_recommend(text: str, valid_ids: set[int]) -> tuple[str, list[int]]:
    """추천 응답에서 (보일 텍스트, 추천 시설 id 목록)을 분리한다(_parse_chat와 동일 패턴)."""
    ids: list[int] = []
    visible = text
    match = re.search(r"\{[^{}]*recommend_place_ids[^{}]*\}", text, re.DOTALL)
    if match:
        try:
            data = json.loads(match.group(0))
            ids = [int(i) for i in data.get("recommend_place_ids", []) if int(i) in valid_ids]
        except (json.JSONDecodeError, ValueError, TypeError):
            ids = []
        visible = text[: match.start()] + text[match.end():]
    visible = re.sub(r"```(json)?", "", visible).strip()
    return (visible or "이런 곳은 어떠세요?"), ids


# ── 펫 동반 숙소 (LodgingPort) ─────────────────────────────────────────────────
def _is_lodging(category: str) -> bool:
    """숙박 업종 여부 — 코스 정류장이 아니라 '숙소' 섹션에 들어갈 시설."""
    return any(k in (category or "") for k in _LODGING_KEYWORDS)


_LODGING_RESULT_CAP = 6  # 추천 숙소 상한
_LODGING_CACHE: dict[tuple, list["PetFriendlyPlace"]] = {}  # (region, size) → 숙소(데모 데이터 안정)


def _seed_jeonju_lodging() -> list[PetFriendlyPlace]:
    """데모 시드 — 전주 펫 동반 숙소(실데이터에 숙박이 없을 때 폴백, Mock-first)."""
    seeds = [
        (90001, "전주 한옥마을 펫 게스트하우스", 35.8151, 127.1525, "숙박(게스트하우스)"),
        (90002, "전주 객리단길 펫 동반 호텔", 35.8186, 127.1480, "숙박(호텔)"),
        (90003, "전주 덕진 펫 동반 펜션", 35.8447, 127.1320, "숙박(펜션)"),
    ]
    return [
        PetFriendlyPlace(id=i, name=n, coordinate=Coordinate(lat, lng),
                         category=cat, allowed_sizes=PetSize.all_sizes())
        for i, n, lat, lng, cat in seeds
    ]


class LodgingRepository(LodgingPort):
    """펫 동반 숙소 조회 — 기존 pet_place 재사용(숙박류만 추출). 데이터에 없으면 전주 시드 폴백."""

    def __init__(self, pet_place: PetPlaceUseCase) -> None:
        self.pet_place = pet_place

    async def find_lodging(self, region: str, pet_size: PetSize) -> list[PetFriendlyPlace]:
        key = (region, pet_size.value)
        cached = _LODGING_CACHE.get(key)
        if cached is not None:  # 동일 지역·크기는 시설 재조회 없이 즉시 반환
            return cached
        places = await self.pet_place.find_places(region)
        pool = [p for p in places if p.accommodates(pet_size) and _is_lodging(p.category)]
        if not pool and "전주" in region:
            pool = _seed_jeonju_lodging()
        result = pool[:_LODGING_RESULT_CAP]
        _LODGING_CACHE[key] = result
        logger.info("[LodgingRepository] find_lodging | region=%s size=%s n=%d",
                    region, pet_size.value, len(result))
        return result


# ── 자차 경유지 (RouteLegsPort) ────────────────────────────────────────────────
# 서울→전주 경로 코리도어 위의 '실제' 펫 동반 문화시설을 CSV에서 좌표로 골라낸다.
# 경로에서 크게 벗어난 시설(예: 부산)은 진행도·수직이탈거리 필터로 원천 배제.
_SEOUL = Coordinate(37.5547, 126.9707)   # 서울역
_JEONJU = Coordinate(35.8242, 127.1480)  # 전주(도심)
_KM_PER_DEG = 111.0
# 채택할 펫동반 '문화/휴게/자연' 업종 힌트 / 제외할 업종(병원·약국·미용·숙박 등).
_CORRIDOR_HINTS = ("공원", "미술관", "박물관", "문화", "관광", "여행", "유적", "사찰",
                   "수목원", "정원", "호수", "명소", "휴게", "전시", "해변", "해수욕", "산림", "숲")
_CORRIDOR_BLOCK = ("병원", "약국", "미용", "호텔", "펜션", "숙박", "분양", "장묘", "유치원", "카페", "식당", "음식")


def _corridor_project(o: Coordinate, d: Coordinate, p: Coordinate) -> tuple[float, float]:
    """점 p를 o→d 직선에 투영 → (진행도 t[0=출발,1=도착], 경로 수직이탈거리 km)."""
    lat0 = math.radians((o.latitude + d.latitude) / 2)
    kx = _KM_PER_DEG * math.cos(lat0)
    ox, oy = o.longitude * kx, o.latitude * _KM_PER_DEG
    dx, dy = d.longitude * kx - ox, d.latitude * _KM_PER_DEG - oy
    px, py = p.longitude * kx - ox, p.latitude * _KM_PER_DEG - oy
    denom = dx * dx + dy * dy
    if denom == 0:
        return 0.0, 9e9
    t = (px * dx + py * dy) / denom
    perp = math.hypot(px - t * dx, py - t * dy)
    return t, perp


_CORRIDOR_CACHE: Optional[list[tuple[float, float, PetFriendlyPlace]]] = None


def _load_corridor_candidates() -> list[tuple[float, float, PetFriendlyPlace]]:
    """펫동반 문화시설 CSV → 서울→전주 코리도어 위 대형견 가능 시설 (t, 이탈km, place). 1회 캐시."""
    global _CORRIDOR_CACHE
    if _CORRIDOR_CACHE is not None:
        return _CORRIDOR_CACHE
    from core.config import PETPLACE_CSV_PATH
    out: list[tuple[float, float, PetFriendlyPlace]] = []
    try:
        with open(PETPLACE_CSV_PATH, encoding="utf-8-sig", newline="") as f:
            for i, r in enumerate(csv.DictReader(f), 1):
                name = (r.get("시설명") or "").strip()
                lat_s, lng_s = (r.get("위도") or "").strip(), (r.get("경도") or "").strip()
                if not (name and lat_s and lng_s):
                    continue
                try:
                    coord = Coordinate(float(lat_s), float(lng_s))
                except (ValueError, TypeError):
                    continue
                cat = (r.get("카테고리3") or r.get("카테고리2") or r.get("카테고리1") or "").strip()
                if any(b in cat or b in name for b in _CORRIDOR_BLOCK):
                    continue
                outdoor = (r.get("장소(실외)여부") or "").strip().upper() == "Y"
                cultural = any(h in cat or h in name for h in _CORRIDOR_HINTS)
                if not (cultural or outdoor):
                    continue
                sizes = PetSize.parse_allowed(r.get("입장 가능 동물 크기"))
                if PetSize.LARGE not in sizes:
                    continue
                t, perp = _corridor_project(_SEOUL, _JEONJU, coord)
                if not (0.12 <= t <= 0.9) or perp > 18.0:
                    continue
                out.append((t, perp, PetFriendlyPlace(
                    id=900000 + i, name=name, coordinate=coord,
                    category=cat or "문화시설", allowed_sizes=sizes,
                    restriction=(r.get("반려동물 제한사항") or "").strip(),
                )))
    except FileNotFoundError:
        logger.warning("[corridor] 펫동반 CSV 없음 → 시드 폴백 가능 | %s", PETPLACE_CSV_PATH)
        _CORRIDOR_CACHE = []
        return _CORRIDOR_CACHE
    out.sort(key=lambda x: x[0])
    _CORRIDOR_CACHE = out
    logger.info("[corridor] 서울→전주 경유 후보 로드 | n=%d", len(out))
    return out


def _pick_spread_stopovers(pet_size: PetSize, k: int = 3) -> list[PetFriendlyPlace]:
    """진행도 초/중/후반 구간별로 경로 이탈이 가장 적은 시설 하나씩 → 경로 따라 고르게 분포."""
    pool = [(t, perp, pl) for t, perp, pl in _load_corridor_candidates() if pl.accommodates(pet_size)]
    picked: list[PetFriendlyPlace] = []
    for lo, hi in ((0.12, 0.42), (0.42, 0.68), (0.68, 0.9)):
        seg = sorted([(perp, pl) for t, perp, pl in pool if lo <= t < hi], key=lambda x: x[0])
        if seg:
            picked.append(seg[0][1])  # 경로 이탈 최소 시설
    return picked[:k]


def _seed_seoul_jeonju_stopovers() -> list[PetFriendlyPlace]:
    """CSV 코리도어가 비었을 때만 쓰는 최소 폴백(실데이터 우선)."""
    seeds = [
        (91001, "수원 광교호수공원", 37.2856, 127.0648, "여행지(공원)"),
        (91003, "여산휴게소(호남고속도로)", 36.0625, 127.1167, "휴게소"),
    ]
    return [
        PetFriendlyPlace(id=i, name=n, coordinate=Coordinate(lat, lng),
                         category=cat, allowed_sizes=PetSize.all_sizes())
        for i, n, lat, lng, cat in seeds
    ]


class RouteLegsRepository(RouteLegsPort):
    """자차 경유지 — 서울→전주 경로 코리도어 위 실제 펫동반 문화시설(CSV). 시드는 폴백."""

    async def stopovers(self, origin: str, destination: str, pet_size: PetSize) -> list[PetFriendlyPlace]:
        if "서울" in origin and "전주" in destination:
            stops = await asyncio.to_thread(_pick_spread_stopovers, pet_size)
            if not stops:  # CSV 부재/0건 → 시드 폴백
                stops = [p for p in _seed_seoul_jeonju_stopovers() if p.accommodates(pet_size)]
        else:
            stops = []
        logger.info("[RouteLegsRepository] stopovers | %s→%s n=%d", origin, destination, len(stops))
        return stops


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
