from __future__ import annotations

import asyncio
import logging
import math

from core.introduction import Introduction
from map.adapter.inbound.api.schemas.route_planner_schema import (
    RouteChatSchema,
    RouteOptimizeSchema,
    RoutePlannerSchema,
    RouteRecommendSchema,
)
from map.app.dtos.route_planner_dto import (
    AgentCoursePlan,
    ChatMessage,
    CourseBrief,
    CourseStopRef,
    LodgingDto,
    PlannedStop,
    RouteChatResponse,
    RoutePlanResponse,
    RouteStopDto,
    StopoverDto,
    TripPlanDto,
)
from map.app.ports.input.cohort_recommendation_use_case import CohortRecommendationUseCase
from map.app.ports.input.route_planner_use_case import RoutePlannerUseCase
from map.app.ports.output.restaurant_port import RestaurantPort
from map.app.ports.output.route_planner_port import (
    LodgingPort,
    RouteLegsPort,
    RoutePlannerAgentPort,
)
from map.domain.entities.pet_place_entity import PetFriendlyPlace
from map.domain.entities.restaurant_entity import Restaurant
from map.domain.entities.route_planner_entity import TripPlan
from map.domain.value_objects.cohort_recommendation_vo import Cohort
from map.domain.value_objects.pet_place_vo import Coordinate, PetSize
from map.domain.value_objects.route_planner_vo import (
    LodgingOption,
    PlannerStage,
    TimeSlot,
    TransportMode,
    departure_time_from_raw,
    meal_schedule,
)

logger = logging.getLogger(__name__)


class RoutePlannerInteractor(RoutePlannerUseCase):
    """AI 펫 동선 플래너 인터랙터.

    동선 생성은 에이전트 포트에 위임(DIP)하고, 결과를 응답 DTO로 매핑한다.
    에이전트가 Gemini인지 규칙기반인지 알지 못한다.
    닮은친구%는 코호트 추천 use case를 재사용해 계산한다(entry_verdict가 pet_place를
    재사용하는 패턴과 동일 — 시설 인기도 집계는 코호트 슬라이스의 책임이다).
    """

    def __init__(
        self,
        agent: RoutePlannerAgentPort,
        cohort: CohortRecommendationUseCase,
        lodging: LodgingPort,
        legs: RouteLegsPort,
        restaurants: RestaurantPort,
    ) -> None:
        self.agent = agent
        self.cohort = cohort
        self.lodging = lodging
        self.legs = legs
        self.restaurants = restaurants

    async def plan_route(self, schema: RoutePlannerSchema) -> RoutePlanResponse:
        pet_size = PetSize.from_raw(schema.pet_size)
        brief = CourseBrief(
            region=schema.region,
            days=schema.days,
            pet_size=pet_size,
            pet_breed=schema.pet_breed,
        )
        logger.info("[RoutePlannerInteractor] plan_route | %s", brief)

        plan = await self.agent.plan(brief)
        return await self._assemble_course(schema.region, pet_size, plan)

    async def chat(self, schema: RouteChatSchema) -> RouteChatResponse:
        """대화 핑퐁 — 누적 TripPlan을 복원해 단계(목적지→이동수단→숙박→코스)를 진행한다.

        상태 전이는 규칙(도메인 TripPlan.next_stage)으로 결정론적이고, 슬롯이 다 차면
        에이전트로 코스를 생성한다. 데모 입력엔 일관된 결과가 나온다.
        """
        pet_size = PetSize.from_raw(schema.pet_size)
        plan = _restore_plan(schema.plan)
        latest = _latest_user_message(schema)
        logger.info("[RoutePlannerInteractor] chat | stage=%s msg=%r", plan.next_stage().value, latest)

        # 1) 최신 메시지로 채울 수 있는 슬롯을 모두 채운다(한 번에 여러 개 말해도 수용).
        plan = _apply_message(plan, latest)
        stage = plan.next_stage()

        # 2) 아직 물을 게 남았으면 질문 + 빠른 선택칩만 돌려준다(코스 미생성).
        if stage is not PlannerStage.READY:
            reply, suggestions = _ask(stage, plan)
            return RouteChatResponse(reply=reply, plan=_to_plan_dto(plan), suggestions=suggestions)

        # 3) 슬롯이 다 찼으면 코스를 생성한다(이동수단·숙박 분기 반영).
        course = await self._build_course(plan, pet_size, schema.pet_breed, schema.pet_traits)
        reply = _ready_reply(plan, course)
        return RouteChatResponse(reply=reply, plan=_to_plan_dto(plan), suggestions=[], course=course)

    async def recommend(self, schema: RouteRecommendSchema) -> RouteChatResponse:
        """현재 코스를 분석해 대화형 추천을 돌려준다 — 코스는 재생성하지 않고(course=None)
        추천 장소를 '○○ 추가' 칩으로만 제시한다(사용자가 탭하면 클라가 코스에 더한다)."""
        pet_size = PetSize.from_raw(schema.pet_size)
        plan = _restore_plan(schema.plan)
        region = plan.destination or "전주"
        messages = [ChatMessage(role=m.role, content=m.content) for m in schema.messages]
        current = [CourseStopRef(name=s.name, category=s.category) for s in schema.current_course]
        logger.info("[RoutePlannerInteractor] recommend | region=%s course=%d", region, len(current))

        reply, picks = await self.agent.recommend(
            region, messages, current, pet_size, schema.pet_breed, schema.pet_traits
        )
        suggestions = [f"{p.name} 추가" for p in picks]
        # course=None → 클라이언트가 기존 편집 코스를 유지(덮어쓰지 않음).
        return RouteChatResponse(reply=reply, plan=_to_plan_dto(plan), suggestions=suggestions)

    async def _build_course(
        self, plan: TripPlan, pet_size: PetSize, pet_breed, pet_traits
    ) -> RoutePlanResponse:
        """확정된 TripPlan으로 전주 코스 + (숙박 시)숙소 + (자차 시)경유지를 조립한다.

        코스(LLM)·숙소·경유지·코호트 인기도는 서로 독립이므로 동시에 조회한다(병렬화).
        """
        region = plan.destination or "전주"
        # 박 수 → 일수(N박이면 N+1일). 당일치기는 1일.
        days = plan.nights + 1 if plan.lodging is LodgingOption.OVERNIGHT else 1
        brief = CourseBrief(region=region, days=days, pet_size=pet_size, pet_breed=pet_breed, transport=plan.transport)

        async def _lodging_task() -> list[LodgingDto]:
            if plan.lodging is not LodgingOption.OVERNIGHT:
                return []
            return [_to_lodging_dto(p) for p in await self.lodging.find_lodging(region, pet_size)]

        async def _stopover_task() -> list[StopoverDto]:
            if plan.transport is not TransportMode.CAR:
                return []
            return [_to_stopover_dto(p) for p in await self.legs.stopovers(plan.origin, region, pet_size)]

        agent_plan, lodging, stopovers, recommendations = await asyncio.gather(
            self.agent.plan(brief),
            _lodging_task(),
            _stopover_task(),
            self.cohort.recommend(Cohort(size=pet_size), action_type="visit", limit=500),
        )

        # 이동수단별 도착 지점에서 동선을 시작 — KTX 전주역 / 버스 전주터미널 / 자차 한옥마을(주차).
        # "내려서 첫 코스"가 자연스럽도록 도착점 최근접 순으로 재정렬(에이전트 선택은 유지, 순서만 조정).
        start = _ARRIVAL_BY_TRANSPORT.get(plan.transport)
        if start is not None and len(agent_plan.stops) > 1:
            reordered = self._order_nearest(start, agent_plan.stops)
            agent_plan = AgentCoursePlan(stops=reordered, narrative=agent_plan.narrative, trails=agent_plan.trails)

        # 출발시각·이동수단으로 일자별 아침/점심/저녁 블록을 계산(점심·저녁에 식당 삽입).
        schedule = meal_schedule(plan.transport, plan.departure_time, days)
        return await self._assemble_course(
            region, pet_size, agent_plan, pet_traits, lodging, stopovers, recommendations,
            schedule=schedule, transport=plan.transport,
        )

    async def optimize(self, schema: RouteOptimizeSchema) -> RoutePlanResponse:
        """선택한 정류장들을 출발점(내 위치)에서 최근접 이웃 순으로 재배열해 최적 코스를 만든다."""
        pet_size = PetSize.from_raw(schema.pet_size)
        stops = [
            PlannedStop(i + 1, s.name, s.category, s.latitude, s.longitude)
            for i, s in enumerate(schema.stops)
        ]
        logger.info("[RoutePlannerInteractor] optimize | %d곳 → 최적순서", len(stops))
        start = (
            Coordinate(schema.start_lat, schema.start_lng)
            if schema.start_lat is not None and schema.start_lng is not None
            else None
        )
        ordered = self._order_nearest(start, stops)
        plan = AgentCoursePlan(
            stops=ordered,
            narrative=f"선택한 {len(ordered)}곳을 출발 지점에서 가까운 순으로 최적 동선을 짰어요.",
        )
        return await self._assemble_course(schema.region, pet_size, plan)

    @staticmethod
    def _order_nearest(start, stops: list[PlannedStop]) -> list[PlannedStop]:
        """출발점(없으면 첫 정류장)에서 최근접 이웃 그리디로 방문 순서를 정한다(TSP 휴리스틱)."""
        if not stops:
            return []
        remaining = list(stops)
        cur = start or Coordinate(stops[0].latitude, stops[0].longitude)
        ordered: list[PlannedStop] = []
        while remaining:
            nxt = min(remaining, key=lambda s: cur.distance_km_to(Coordinate(s.latitude, s.longitude)))
            remaining.remove(nxt)
            ordered.append(nxt)
            cur = Coordinate(nxt.latitude, nxt.longitude)
        return ordered

    async def _assemble_course(
        self,
        region: str,
        pet_size: PetSize,
        plan: AgentCoursePlan,
        pet_traits: str | None = None,
        lodging: list[LodgingDto] | None = None,
        stopovers: list[StopoverDto] | None = None,
        recommendations=None,
        schedule: list[list[tuple[TimeSlot, str, bool]]] | None = None,
        transport: TransportMode = TransportMode.UNSET,
    ) -> RoutePlanResponse:
        """에이전트 동선 계획 → 응답 DTO(이동거리·닮은친구%·추천이유·출처). plan_route·chat 공용.

        schedule(일자별 아침/점심/저녁 블록)가 있으면 관광 정류장을 블록에 배정하고 식사 블록에
        실제 전주 음식점을 삽입한다(없으면 단일 블록 — optimize 등).
        recommendations(코호트 인기도)를 미리 받으면 재조회하지 않는다(병렬 호출 최적화).
        """
        sights = plan.stops
        # 닮은친구% — 같은 크기 코호트의 실제 방문 기록이 있을 때만 산출(없으면 0, UI 미표기).
        if recommendations is None:
            recommendations = await self.cohort.recommend(Cohort(size=pet_size), action_type="visit", limit=500)
        score_by_facility = {r.facility_id: r.score for r in recommendations}
        max_score = max(score_by_facility.values(), default=1)

        if schedule is None:  # optimize 등 — 단일 블록(식사 미삽입)
            schedule = [[(TimeSlot.MORNING, "", False)]]
        days = len(schedule)
        per_day = max(1, math.ceil(len(sights) / days)) if sights else 1
        arrival = _ARRIVAL_BY_TRANSPORT.get(transport)

        dtos: list[RouteStopDto] = []
        used_meals: set[str] = set()
        prev: Coordinate | None = None

        def _emit(name, category, lat, lng, slot, clock, day, is_meal, reason, source,
                  similarity=0, image_url=None, phone=None, address=None) -> None:
            nonlocal prev
            cur = Coordinate(lat, lng)
            dist = round(prev.distance_km_to(cur), 2) if prev is not None else 0.0
            prev = cur
            dtos.append(RouteStopDto(
                len(dtos) + 1, name, category, lat, lng, dist, similarity,
                reason=reason, source=source, day=day, time_slot=slot.value, clock=clock,
                is_meal=is_meal, image_url=image_url, phone=phone, address=address,
            ))

        for di, day_blocks in enumerate(schedule, start=1):
            day_sights = sights[(di - 1) * per_day: di * per_day] if sights else []
            for (slot, clock, has_meal), chunk in zip(day_blocks, _split_even(day_sights, len(day_blocks))):
                for s in chunk:
                    score = score_by_facility.get(s.id, 0)
                    sim = min(98, round(62 + score / max_score * 36)) if score else 0
                    _emit(s.name, s.category, s.latitude, s.longitude, slot, clock, di, False,
                          _stop_reason(s.category, pet_traits, score), _SOURCE_TAG, similarity=sim)
                if has_meal:
                    center = _centroid(chunk) or prev or arrival
                    if center is not None:
                        picks = await self.restaurants.nearby_meal(center, frozenset(used_meals), 1)
                        if picks:
                            r = picks[0]
                            used_meals.add(r.name)
                            _emit(r.name, r.category, r.coordinate.latitude, r.coordinate.longitude,
                                  slot, clock, di, True, _meal_reason(r, slot), _SOURCE_TAG_RESTAURANT,
                                  image_url=r.image_url, phone=r.phone, address=r.address)

        total_km = round(sum(d.distance_from_prev_km for d in dtos), 2)
        return RoutePlanResponse(
            region=region,
            pet_size=pet_size.value,
            stop_count=len(dtos),
            total_distance_km=total_km,
            summary=plan.narrative,
            stops=dtos,
            recommended_trails=plan.trails,
            lodging=lodging or [],
            stopovers=stopovers or [],
        )

    async def introduce_myself(self) -> Introduction:
        intro = await self.agent.introduce_myself()
        intro.trail.append("interactor")
        return intro


# ── 대화 상태머신 헬퍼(순수 함수) ──────────────────────────────────────────────────
_SOURCE_TAG = "한국문화정보원 펫동반 문화시설"
_SOURCE_TAG_TRAVEL = "한국관광공사 반려동물 동반여행"
_SOURCE_TAG_RESTAURANT = "전주시 음식점 공공데이터"


def _split_even(items: list, n: int) -> list[list]:
    """리스트를 순서 유지하며 n개의 연속 청크로 최대한 고르게 나눈다(나머지는 앞쪽에)."""
    if n <= 0:
        return []
    base, rem = divmod(len(items), n)
    chunks, idx = [], 0
    for i in range(n):
        size = base + (1 if i < rem else 0)
        chunks.append(items[idx: idx + size])
        idx += size
    return chunks


def _centroid(stops: list[PlannedStop]) -> Coordinate | None:
    """정류장 묶음의 중심 좌표(식사 식당을 가까이 고를 기준점). 비어 있으면 None."""
    if not stops:
        return None
    return Coordinate(
        sum(s.latitude for s in stops) / len(stops),
        sum(s.longitude for s in stops) / len(stops),
    )


def _meal_reason(r: Restaurant, slot: TimeSlot) -> str:
    """식사 정류장 한 줄 — 시간대 + 업태 + 펫동반 여부."""
    base = f"{slot.label} 식사로 들르기 좋은 전주 {r.category}예요."
    if r.pet_friendly:
        return base + " 반려동물 동반 가능 매장으로 등록돼 체리와 함께 들어갈 수 있어요."
    return base + " 테라스·동반 가능 여부는 매장에 확인하세요."

# 데모는 전주 중심. 대화에서 목적지를 뽑는 최소 힌트(서버 무상태 — 추측은 보수적으로).
_REGION_HINTS = ("전주", "강릉", "경주", "제주", "여수", "부산", "속초", "통영", "남원", "군산")

# 이동수단별 전주 도착 지점 — 여기서 가까운 순으로 코스를 시작한다(내려서 첫 코스).
_ARRIVAL_BY_TRANSPORT = {
    TransportMode.KTX: Coordinate(35.8503, 127.1602),   # 전주역
    TransportMode.BUS: Coordinate(35.8345, 127.1292),   # 전주고속버스터미널
    TransportMode.CAR: Coordinate(35.8150, 127.1530),   # 한옥마을(주차 후 시작)
}


def _extract_region(text: str) -> str | None:
    for h in _REGION_HINTS:
        if h in text:
            return h
    return None


def _latest_user_message(schema: RouteChatSchema) -> str:
    for m in reversed(schema.messages):
        if m.role == "user":
            return m.content
    return ""


def _safe_transport(value: str | None) -> TransportMode:
    try:
        return TransportMode(value) if value else TransportMode.UNSET
    except ValueError:
        return TransportMode.UNSET


def _safe_lodging(value: str | None) -> LodgingOption:
    try:
        return LodgingOption(value) if value else LodgingOption.UNSET
    except ValueError:
        return LodgingOption.UNSET


def _restore_plan(sp) -> TripPlan:
    """요청에 동봉된 직전 상태(TripPlanSchema|None) → 도메인 TripPlan 복원."""
    if sp is None:
        return TripPlan()
    return TripPlan(
        origin=sp.origin or "서울",
        destination=sp.destination or None,
        transport=_safe_transport(sp.transport),
        departure_time=getattr(sp, "departure_time", None) or None,
        lodging=_safe_lodging(sp.lodging),
        nights=max(0, sp.nights or 0),
    )


def _apply_message(plan: TripPlan, latest: str) -> TripPlan:
    """최신 메시지로 아직 비어 있는 슬롯을 모두 채운다(한 턴에 여러 개 말해도 수용)."""
    destination = plan.destination or _extract_region(latest)
    transport = plan.transport
    if transport is TransportMode.UNSET:
        transport = TransportMode.from_raw(latest)
    departure_time = plan.departure_time or departure_time_from_raw(latest)
    lodging = plan.lodging
    nights = plan.nights
    if lodging is LodgingOption.UNSET:
        parsed = LodgingOption.nights_from_raw(latest)
        if parsed is not None:
            nights = parsed
            lodging = LodgingOption.DAYTRIP if parsed == 0 else LodgingOption.OVERNIGHT
    return TripPlan(
        origin=plan.origin, destination=destination, transport=transport,
        departure_time=departure_time, lodging=lodging, nights=nights,
    )


def _ask(stage: PlannerStage, plan: TripPlan) -> tuple[str, list[str]]:
    """단계별 질문 + 빠른 선택칩(결정론적 — 데모 안정)."""
    if stage is PlannerStage.ASK_DESTINATION:
        return ("어디로 떠나고 싶으세요? 가고 싶은 지역을 알려주세요.", ["전주"])
    if stage is PlannerStage.ASK_TRANSPORT:
        return (
            f"{plan.origin}에서 {plan.destination}까지 어떻게 갈까요?",
            ["KTX", "고속버스", "자차"],
        )
    if stage is PlannerStage.ASK_DEPARTURE_TIME:
        return (
            f"{plan.origin}에서 몇 시에 출발하세요? 도착시간에 맞춰 아침·점심·저녁 코스를 짜드릴게요.",
            ["오전 7시", "오전 9시", "오전 일찍"],
        )
    # ASK_LODGING — 몇 박 묵을지는 사용자가 직접 고른다(당일치기 포함).
    return (
        f"{plan.destination}에서 며칠 묵으실 건가요? 당일치기도 가능해요.",
        ["당일치기", "1박", "2박", "3박"],
    )


def _ready_reply(plan: TripPlan, course: RoutePlanResponse) -> str:
    """코스 확정 시 사용자에게 보일 한 마디 — 이동수단·경유지·숙소 맥락 + 코스 요약."""
    stay = f"{plan.nights}박 {plan.nights + 1}일" if plan.lodging is LodgingOption.OVERNIGHT else "당일치기"
    bits = [f"{plan.transport.label}로 {plan.destination}까지 가는 {stay} 일정으로 코스를 짰어요."]
    if plan.transport is TransportMode.CAR and course.stopovers:
        names = ", ".join(s.name for s in course.stopovers[:2])
        bits.append(f"가는 길엔 {names} 같은 경유지를 넣었어요.")
    if plan.lodging is LodgingOption.OVERNIGHT and course.lodging:
        bits.append(f"체리와 묵을 수 있는 숙소 {len(course.lodging)}곳도 함께 추천했어요.")
    if course.summary:
        bits.append(course.summary)
    return " ".join(b for b in bits if b)


def _to_plan_dto(plan: TripPlan) -> TripPlanDto:
    return TripPlanDto(
        origin=plan.origin,
        destination=plan.destination,
        transport=plan.transport.value,
        departure_time=plan.departure_time,
        lodging=plan.lodging.value,
        nights=plan.nights,
        stage=plan.next_stage().value,
    )


def _to_lodging_dto(p: PetFriendlyPlace) -> LodgingDto:
    return LodgingDto(
        name=p.name, category=p.category,
        latitude=p.coordinate.latitude, longitude=p.coordinate.longitude,
        source=_SOURCE_TAG_TRAVEL,
    )


def _to_stopover_dto(p: PetFriendlyPlace) -> StopoverDto:
    return StopoverDto(
        name=p.name, category=p.category,
        latitude=p.coordinate.latitude, longitude=p.coordinate.longitude,
        reason="가는 길에 체리와 쉬어가기 좋아요", source=_SOURCE_TAG_TRAVEL,
    )


def _stop_reason(category: str, pet_traits: str | None, cohort_visits: int = 0) -> str:
    """왜 이 장소 — 업종 + 체리 특징(대형견·더위 취약)에 근거한 규칙 한 줄.

    근거: (1) 펫 동반 가능(공공데이터 등록) (2) 업종별 실내·야외 적합성 (3) 같은 크기
    코호트의 실제 방문 기록(있을 때만). 데이터 없는 근거를 지어내지 않는다.
    """
    traits = pet_traits or ""
    cat = category or ""
    heat = "더위" in traits
    big = "대형" in traits or "large" in traits.lower()

    if any(k in cat for k in ("박물관", "미술관", "전시", "유산원", "문화원", "과학관")):
        reason = (
            "실내 전시가 있어 더위에 약한 체리가 시원하게 쉬며 둘러보기 좋아요. 야외 마당·정원은 동반 가능, 실내 전시관은 목줄·제한을 확인하세요."
            if heat else
            "야외 마당·정원은 대형견 체리와 함께 둘러볼 수 있어요(실내 전시관은 제한)."
        )
    elif any(k in cat for k in ("공원", "호수", "정원", "수목", "산책", "둘레", "천", "강")):
        reason = "탁 트인 평지 야외라 대형견 체리가 목줄 산책하기 좋아요. 그늘·급수 포인트를 확인하세요."
    elif any(k in cat for k in ("문예회관", "공연", "극장", "전당", "회관")):
        reason = "야외 행사·마당은 동반 가능하고 실내 공연장은 제한돼요."
    elif any(k in cat for k in ("카페", "식당", "맛집", "음식")):
        reason = "동반석이 있어 체리와 함께 쉬어가기 좋아요(테라스·목줄 확인)."
    elif any(k in cat for k in ("여행지", "관광", "명소", "유적", "사적")):
        reason = "야외 명소라 대형견 체리와 목줄 산책으로 둘러보기 좋아요."
    else:
        reason = "반려동물 동반 가능으로 등록된 곳이라 체리와 함께 입장할 수 있어요."

    if heat and not any(k in cat for k in ("박물관", "미술관", "전시")):
        reason += " 한낮 더위엔 그늘과 수분을 자주 챙겨주세요."
    if cohort_visits:
        reason += f" 같은 대형견 친구들이 실제로 {cohort_visits}번 다녀간 곳이에요."
    return reason
