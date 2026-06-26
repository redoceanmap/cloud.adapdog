from __future__ import annotations

import asyncio
import logging

from core.introduction import Introduction
from map.adapter.inbound.api.schemas.route_planner_schema import (
    RouteChatSchema,
    RouteOptimizeSchema,
    RoutePlannerSchema,
    RouteRecommendSchema,
    SwapStopSchema,
)
from map.app.dtos.route_planner_dto import (
    AgentCoursePlan,
    AlternativeDto,
    ChatMessage,
    ConversationTurn,
    CourseBrief,
    CourseBuckets,
    CourseStopRef,
    LodgingDto,
    PlannedStop,
    RouteChatResponse,
    RoutePlanResponse,
    RouteStopDto,
    StopoverDto,
    SwapAlternativesResponse,
    TripPlanDto,
)
from map.app.ports.input.cohort_recommendation_use_case import CohortRecommendationUseCase
from map.app.ports.input.pet_place_use_case import PetPlaceUseCase
from map.app.ports.input.route_planner_use_case import RoutePlannerUseCase
from map.app.ports.output.city_park_port import CityParkPort
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
    SlotKind,
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
        parks: CityParkPort,
        pet_place: PetPlaceUseCase,
    ) -> None:
        self.agent = agent
        self.cohort = cohort
        self.lodging = lodging
        self.legs = legs
        self.restaurants = restaurants
        self.parks = parks
        self.pet_place = pet_place

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
        """대화 핑퐁 — LLM이 자연스럽게 묻고 슬롯을 추출하며, 필수 슬롯이 차면 코스를 생성한다.

        LLM 주도 대화(converse)로 답변·슬롯을 받고, 결정형 게이트(TripPlan.next_stage)로
        코스 생성 시점을 안정적으로 통제한다. LLM이 비거나 실패하면 결정형 질문으로 폴백한다.
        """
        pet_size = PetSize.from_raw(schema.pet_size)
        plan = _restore_plan(schema.plan)
        latest = _latest_user_message(schema)
        logger.info("[RoutePlannerInteractor] chat | stage=%s msg=%r", plan.next_stage().value, latest)

        # 1) 정규식 기준선으로 슬롯을 먼저 채우고(폴백 안전망), LLM으로 자연 답변+슬롯을 받아 머지.
        #    LLM이 지어낸 목적지(few-shot 복붙 등)는 사용자가 실제로 말한 경우에만 수용(그라운딩).
        plan = _apply_message(plan, latest)
        turn = await self._converse(schema, plan, pet_size)
        slots = _ground_slots(turn.slots, schema)
        plan = _merge_slots(plan, slots)
        stage = plan.next_stage()

        # 2) 아직 필수 슬롯이 비면 LLM 답변(없으면 결정형 질문) + 빠른 선택칩만 돌려준다(코스 미생성).
        if stage is not PlannerStage.READY:
            if turn.reply:
                reply, suggestions = turn.reply, turn.suggestions
            else:
                reply, suggestions = _ask(stage, plan)
            return RouteChatResponse(reply=reply, plan=_to_plan_dto(plan), suggestions=suggestions)

        # 3) 필수 슬롯이 찼으면 코스를 생성한다(이동수단·숙박·숙소·이동성향 반영).
        course = await self._build_course(plan, pet_size, schema.pet_breed, schema.pet_traits)
        reply = _ready_reply(plan, course)
        return RouteChatResponse(reply=reply, plan=_to_plan_dto(plan), suggestions=[], course=course)

    async def _converse(self, schema: RouteChatSchema, plan: TripPlan, pet_size: PetSize) -> ConversationTurn:
        """LLM 주도 대화 호출 — 실패하면 빈 턴(결정형 폴백)을 돌려준다."""
        pet_profile = {"breed": schema.pet_breed, "size": pet_size.value, "traits": schema.pet_traits}
        known = {
            "origin": plan.origin, "destination": plan.destination,
            "transport": plan.transport.value if plan.transport is not TransportMode.UNSET else None,
            "departure_time": plan.departure_time,
            "lodging": plan.lodging.value if plan.lodging is not LodgingOption.UNSET else None,
            "nights": plan.nights or None,
            "lodging_pref": plan.lodging_pref, "interests": plan.interests, "pet_mobility": plan.pet_mobility,
        }
        messages = [ChatMessage(role=m.role, content=m.content) for m in schema.messages]
        try:
            return await self.agent.converse(messages, pet_profile, known)
        except Exception as e:  # noqa: BLE001 — 대화 실패 시 결정형 폴백(서비스 유지)
            logger.warning("[RoutePlannerInteractor] converse 실패 → 결정형 폴백 | %s", e)
            return ConversationTurn()

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
        """확정된 TripPlan으로 코스를 조립한다 — 숙소를 동선 중심에 두고 여행 리듬으로 채운다.

        코스 후보(LLM)·버킷·숙소·경유지·코호트 인기도는 서로 독립이므로 동시에 조회(병렬화).
        숙소가 정해지면 그 좌표를 앵커로 삼아 하루 동선을 숙소 주변으로 모은다(가이드: 숙소 기준 거리).
        """
        region = plan.destination or "전주"
        # 박 수 → 일수(N박이면 N+1일). 당일치기는 1일.
        days = plan.nights + 1 if plan.lodging is LodgingOption.OVERNIGHT else 1
        brief = CourseBrief(region=region, days=days, pet_size=pet_size, pet_breed=pet_breed, transport=plan.transport)
        # 더위 취약견이거나 도보 위주 성향이면 하루를 더 여유롭게(활동 수 축소).
        relaxed = _is_heat_sensitive(pet_traits) or _prefers_walking(plan.pet_mobility)

        async def _lodging_task() -> list[PetFriendlyPlace]:
            if plan.lodging is not LodgingOption.OVERNIGHT:
                return []
            return await self.lodging.find_lodging(region, pet_size)

        async def _stopover_task() -> list[StopoverDto]:
            if plan.transport is not TransportMode.CAR:
                return []
            return [_to_stopover_dto(p) for p in await self.legs.stopovers(plan.origin, region, pet_size)]

        agent_plan, lodging_places, stopovers, recommendations, buckets = await asyncio.gather(
            self.agent.plan(brief),
            _lodging_task(),
            _stopover_task(),
            self.cohort.recommend(Cohort(size=pet_size), action_type="visit", limit=500),
            self.agent.find_buckets(region, pet_size, plan.transport),
        )

        # 대표 숙소 선택(취향·위치 키워드 매칭, 없으면 첫 번째) → 동선 앵커. 숙소 없으면 도착점.
        primary = _pick_primary_lodging(lodging_places, plan.lodging_pref)
        anchor = primary.coordinate if primary else _ARRIVAL_BY_TRANSPORT.get(plan.transport)
        lodging = _order_lodging(lodging_places, primary, days)

        # 출발시각(미지정이면 오전 9시 가정)·이동수단으로 일자별 리듬 블록을 계산.
        schedule = meal_schedule(plan.transport, plan.departure_time or "09:00", days, heat_sensitive=relaxed)
        return await self._assemble_course(
            region, pet_size, agent_plan, pet_traits, lodging, stopovers, recommendations,
            schedule=schedule, transport=plan.transport, buckets=buckets, anchor=anchor,
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

    async def swap(self, schema: SwapStopSchema) -> SwapAlternativesResponse:
        """대상 정류장 자리에 갈 같은 종류의 다른 펫동반 후보를 거리순으로 추천한다('더 멀리'=offset 증가)."""
        pet_size = PetSize.from_raw(schema.pet_size)
        kind = schema.kind or _stop_kind(schema.stop_category)
        near = Coordinate(schema.stop_lat, schema.stop_lng)
        exclude = set(schema.exclude_names) | {schema.stop_name}
        limit = 4
        # 숙소 스왑은 펫 동반 숙소 풀(LodgingPort)에서, 그 외(카페/문화/야외)는 시설 풀에서 고른다.
        # 둘 다 펫 동반 데이터만 쓰므로 동반 불가한 곳은 후보에 오르지 않는다. 한 곳 더 받아 has_more 판정.
        if kind == "lodging":
            picks = await self._lodging_alternatives(
                schema.region, pet_size, near, exclude, schema.offset, limit + 1,
            )
        else:
            picks = await self.agent.find_alternatives(
                schema.region, pet_size, kind, near, exclude, schema.offset, limit + 1,
            )
        has_more = len(picks) > limit
        picks = picks[:limit]
        is_lodging = kind == "lodging"
        alts = [
            AlternativeDto(
                name=p.name,
                category=p.category,
                latitude=p.latitude,
                longitude=p.longitude,
                reason=_lodging_reason() if is_lodging else _stop_reason(p.category, schema.pet_traits),
                distance_km=round(near.distance_km_to(Coordinate(p.latitude, p.longitude)), 1),
            )
            for p in picks
        ]
        label = _KIND_LABEL.get(kind, "곳")
        verb = "묵을" if is_lodging else "갈"
        if alts:
            more = " 마음에 안 들면 조금 더 멀리도 찾아볼게요." if has_more else ""
            reply = f"'{schema.stop_name}' 대신 {verb} 만한 {label} {len(alts)}곳이에요.{more}"
        else:
            reply = f"'{schema.stop_name}' 근처에서 바꿀 만한 {label}를 더 찾지 못했어요."
        logger.info(
            "[RoutePlannerInteractor] swap | target=%s kind=%s offset=%d → %d곳(more=%s)",
            schema.stop_name, kind, schema.offset, len(alts), has_more,
        )
        return SwapAlternativesResponse(
            reply=reply,
            target_name=schema.stop_name,
            alternatives=alts,
            next_offset=schema.offset + limit,
            has_more=has_more,
        )

    async def _lodging_alternatives(
        self, region: str, pet_size: PetSize, near: Coordinate,
        exclude: set[str], offset: int, limit: int,
    ) -> list[PlannedStop]:
        """펫 동반 숙소 풀에서 near 기준 거리순으로 골라 offset 페이지를 반환(숙소 스왑용)."""
        pool = await self.lodging.find_lodging(region, pet_size)
        ranked = sorted(
            (p for p in pool if p.name not in exclude),
            key=lambda p: near.distance_km_to(p.coordinate),
        )
        return [
            PlannedStop(p.id, p.name, p.category, p.coordinate.latitude, p.coordinate.longitude)
            for p in ranked[offset: offset + limit]
        ]

    async def _assemble_course(
        self,
        region: str,
        pet_size: PetSize,
        plan: AgentCoursePlan,
        pet_traits: str | None = None,
        lodging: list[LodgingDto] | None = None,
        stopovers: list[StopoverDto] | None = None,
        recommendations=None,
        schedule: list[list[tuple[TimeSlot, str, SlotKind]]] | None = None,
        transport: TransportMode = TransportMode.UNSET,
        buckets: CourseBuckets | None = None,
        anchor: Coordinate | None = None,
    ) -> RoutePlanResponse:
        """에이전트 동선 계획 → 응답 DTO(이동거리·닮은친구%·추천이유·출처). plan_route·chat 공용.

        schedule(일자별 여행 리듬)가 있으면 슬롯 성격(식당/카페/명소/문화)대로 후보를 채워
        "탐방 일색" 대신 식당→카페→명소 리듬을 만든다. 매일 숙소(anchor)에서 가까운 순으로 모은다.
        schedule이 없으면(optimize 등) 단일 블록으로 정류장만 나열한다(기존 동작 유지).
        """
        if recommendations is None:
            recommendations = await self.cohort.recommend(Cohort(size=pet_size), action_type="visit", limit=500)
        score_by_facility = {r.facility_id: r.score for r in recommendations}
        max_score = max(score_by_facility.values(), default=1)

        dtos: list[RouteStopDto] = []
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

        def _sim(facility_id: int) -> int:
            score = score_by_facility.get(facility_id, 0)
            return min(98, round(62 + score / max_score * 36)) if score else 0

        def _emit_sight(s: PlannedStop, slot: TimeSlot, clock: str, day: int) -> None:
            source = _SOURCE_TAG_PARK if s.id >= _PARK_ID_BASE else _SOURCE_TAG
            _emit(s.name, s.category, s.latitude, s.longitude, slot, clock, day, False,
                  _stop_reason(s.category, pet_traits, score_by_facility.get(s.id, 0)),
                  source, similarity=_sim(s.id))

        # ── 단일 블록(optimize/plan_route) — 기존 동작: 정류장만 순서대로 나열 ──
        if schedule is None:
            for s in plan.stops:
                _emit_sight(s, TimeSlot.MORNING, "", 1)
            return _finalize(region, pet_size, plan, dtos, lodging, stopovers)

        # ── 여행 리듬 — 슬롯 성격대로 후보를 채운다 ──
        buckets = buckets or CourseBuckets()
        arrival = _ARRIVAL_BY_TRANSPORT.get(transport)
        # 도시공원(산책)으로 야외 후보 보강 — 숙소(anchor)/도착점 인근에서 가까운 순.
        park_center = anchor or arrival
        park_stops: list[PlannedStop] = []
        if park_center is not None:
            parks = await self.parks.nearby(park_center, limit=8)
            park_stops = [
                PlannedStop(_PARK_ID_BASE + p.id, p.name, p.park_type,
                            p.coordinate.latitude, p.coordinate.longitude)
                for p in parks
            ]
        # 후보 풀: LLM이 고른 명소를 앞세우고 버킷·공원으로 보강(LLM이 안 고른 카페·공원도 확보).
        outdoor_pool = _dedup_stops(
            [s for s in plan.stops if _stop_kind(s.category) == "outdoor"] + buckets.outdoor + park_stops
        )
        culture_pool = _dedup_stops([s for s in plan.stops if _stop_kind(s.category) == "culture"] + buckets.culture)
        cafe_pool = list(buckets.cafe)
        used_ids: set[int] = set()
        used_meals: set[str] = set()

        # 식사 후보는 입장 판정(entry-verdict)과 같은 pet_place 풀로 교차검증 — 우리 아이를 못 받는
        # 식당(동반 불가/크기 미허용)은 코스에 넣지 않는다. entry-verdict의 '첫 이름매칭' 규칙을 그대로 따른다.
        place_pool = await self.pet_place.find_places(region)

        def _meal_ok(name: str) -> bool:
            p = next((p for p in place_pool if name in p.name), None)
            return p is not None and p.accommodates(pet_size)

        for di, day_blocks in enumerate(schedule, start=1):
            prev = arrival if di == 1 else (anchor or arrival)  # Day1은 도착점, 이후는 숙소에서 출발
            culture_today = 0
            for slot, clock, kind in day_blocks:
                ref = prev or anchor or arrival
                if kind is SlotKind.MEAL:
                    if ref is not None:
                        # 인근 펫동반 식당 여러 곳 중 입장 판정상 우리 아이를 받는 가장 가까운 곳을 고른다.
                        cands = await self.restaurants.nearby_meal(ref, frozenset(used_meals), 15, pet_size)
                        r = next((c for c in cands if _meal_ok(c.name)), None)
                        if r is not None:
                            used_meals.add(r.name)
                            _emit(r.name, r.category, r.coordinate.latitude, r.coordinate.longitude,
                                  slot, clock, di, True, _meal_reason(r, slot), _SOURCE_TAG_RESTAURANT,
                                  image_url=r.image_url, phone=r.phone, address=r.address)
                    continue
                if kind is SlotKind.CAFE:
                    pick = _take_nearest(cafe_pool, used_ids, ref)
                elif kind is SlotKind.CULTURE:
                    # 박물관 하루 1개 상한 — 넘으면 야외 명소로 대체해 실내 일색을 막는다.
                    if culture_today >= 1:
                        pick = _take_nearest(outdoor_pool, used_ids, ref)
                    else:
                        pick = _take_nearest(culture_pool, used_ids, ref) or _take_nearest(outdoor_pool, used_ids, ref)
                        if pick and _stop_kind(pick.category) == "culture":
                            culture_today += 1
                else:  # OUTDOOR
                    pick = _take_nearest(outdoor_pool, used_ids, ref) or _take_nearest(culture_pool, used_ids, ref)
                if pick is not None:
                    used_ids.add(pick.id)
                    _emit_sight(pick, slot, clock, di)

        return _finalize(region, pet_size, plan, dtos, lodging, stopovers)

    async def introduce_myself(self) -> Introduction:
        intro = await self.agent.introduce_myself()
        intro.trail.append("interactor")
        return intro


# ── 대화 상태머신 헬퍼(순수 함수) ──────────────────────────────────────────────────
_SOURCE_TAG = "한국문화정보원 펫동반 문화시설"
_SOURCE_TAG_TRAVEL = "한국관광공사 반려동물 동반여행"
_SOURCE_TAG_RESTAURANT = "전주시 음식점 공공데이터"
_SOURCE_TAG_PARK = "전국 도시공원 표준데이터"
# 공원 PlannedStop id 오프셋 — 시설 id(코호트 키)와 겹치지 않게 큰 베이스를 더한다.
_PARK_ID_BASE = 8_000_000


def _finalize(
    region: str, pet_size: PetSize, plan: AgentCoursePlan, dtos: list[RouteStopDto],
    lodging: list[LodgingDto] | None, stopovers: list[StopoverDto] | None,
) -> RoutePlanResponse:
    """조립된 정류장 → 최종 응답 DTO(총 이동거리 합산)."""
    total_km = round(sum(d.distance_from_prev_km for d in dtos), 2)
    return RoutePlanResponse(
        region=region, pet_size=pet_size.value, stop_count=len(dtos),
        total_distance_km=total_km, summary=plan.narrative, stops=dtos,
        recommended_trails=plan.trails, lodging=lodging or [], stopovers=stopovers or [],
    )


# 리듬 채움 분류 — 카페/문화(실내)/야외. 레포지토리와 동일 기준(계층 분리 위해 인터랙터에도 둠).
_CULTURE_HINTS = ("박물관", "미술관", "전시", "문화원", "문예", "공연", "극장", "전당", "회관", "과학관", "유산")


def _stop_kind(category: str) -> str:
    c = category or ""
    if "카페" in c:
        return "cafe"
    if any(h in c for h in _CULTURE_HINTS):
        return "culture"
    return "outdoor"


# 스왑 추천 멘트용 종류 라벨.
_KIND_LABEL = {"cafe": "카페", "culture": "문화·전시 장소", "outdoor": "공원·산책 코스", "lodging": "숙소"}


def _lodging_reason() -> str:
    """숙소 스왑 대안의 추천 이유 — 펫 동반 숙소(대형견 체리 동반 가능) 근거 한 줄."""
    return "반려동물 동반 가능 숙소라 대형견 체리와 함께 묵을 수 있어요(객실 동반 조건·보증금은 예약 시 확인)."


def _dedup_stops(stops: list[PlannedStop]) -> list[PlannedStop]:
    """id 기준 중복 제거(순서 유지) — LLM 선택 + 버킷 합칠 때."""
    seen: set[int] = set()
    out: list[PlannedStop] = []
    for s in stops:
        if s.id in seen:
            continue
        seen.add(s.id)
        out.append(s)
    return out


def _take_nearest(pool: list[PlannedStop], used_ids: set[int], ref: Coordinate | None) -> PlannedStop | None:
    """후보 풀에서 미사용 중 기준점(ref)에 가장 가까운 정류장 하나(없으면 None)."""
    cands = [s for s in pool if s.id not in used_ids]
    if not cands:
        return None
    if ref is None:
        return cands[0]
    return min(cands, key=lambda s: ref.distance_km_to(Coordinate(s.latitude, s.longitude)))


# 숙소 취향·위치 키워드 → 숙소명/카테고리 부분일치 동의어.
_LODGING_KEYWORD_SYNS = {
    "한옥": ("한옥",), "한옥마을": ("한옥",), "펜션": ("펜션",), "호텔": ("호텔",),
    "게스트": ("게스트",), "전주역": ("역",), "덕진": ("덕진",),
}


def _pick_primary_lodging(places: list[PetFriendlyPlace], pref: str | None) -> PetFriendlyPlace | None:
    """대표 숙소 — 취향·위치 키워드와 매칭되는 곳, 없으면 첫 번째."""
    if not places:
        return None
    if pref:
        kws = [s for kw, syns in _LODGING_KEYWORD_SYNS.items() if kw in pref for s in syns]
        kws.append(pref)
        for p in places:
            text = f"{p.name} {p.category}"
            if any(k and k in text for k in kws):
                return p
    return places[0]


def _order_lodging(places: list[PetFriendlyPlace], primary: PetFriendlyPlace | None, days: int) -> list[LodgingDto]:
    """대표 숙소를 맨 앞에 둔 숙소 DTO 목록(프론트가 날짜별 lodging[d-1]로 사용)."""
    if not places:
        return []
    ordered = ([primary] if primary else []) + [p for p in places if p is not primary]
    return [_to_lodging_dto(p) for p in ordered]


def _is_heat_sensitive(pet_traits: str | None) -> bool:
    return bool(pet_traits and ("더위" in pet_traits or "heat" in pet_traits.lower()))


def _prefers_walking(pet_mobility: str | None) -> bool:
    """도보 위주 성향 — 차 이동 불편·예민·노견 등 무리 없는 동선을 원하는 신호."""
    return bool(pet_mobility and any(k in pet_mobility for k in ("도보", "걷", "불편", "예민", "노견", "최소")))


def _meal_reason(r: Restaurant, slot: TimeSlot) -> str:
    """식사 정류장 한 줄 — 시간대 + 업태 + 펫동반 여부."""
    base = f"{slot.label} 식사로 들르기 좋은 전주 {r.category}예요."
    if r.pet_friendly:
        return base + " 반려동물 동반 가능 매장으로 등록돼 체리와 함께 들어갈 수 있어요."
    return base + " 테라스·동반 가능 여부는 매장에 확인하세요."

# 데모는 전주 중심이나, 대화에서 목적지를 뽑는 힌트는 전국 주요 여행지로 둔다(시나리오 커버리지).
# 서울은 출발지 고정값이라 목적지 힌트에서 제외한다(목적지로 오인 방지).
_REGION_HINTS = (
    "전주", "강릉", "경주", "제주", "여수", "부산", "속초", "통영", "남원", "군산",
    "가평", "춘천", "담양", "양평", "포항", "안동", "목포", "순천",
)

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
        lodging_pref=getattr(sp, "lodging_pref", None) or None,
        interests=getattr(sp, "interests", None) or None,
        pet_mobility=getattr(sp, "pet_mobility", None) or None,
    )


def _ground_slots(slots: dict, schema: RouteChatSchema) -> dict:
    """LLM 슬롯 사후 검증 — 사용자가 실제로 말하지 않은 목적지는 버린다(few-shot 복붙·환각 차단).

    목적지는 코스 지역을 좌우하므로 반드시 사용자 발화에 근거해야 한다(약한 모델이 예시의
    지역명을 베끼는 것을 코드 레벨에서 막는다). 취향·이동성향 등은 요약이라 그대로 둔다.
    """
    if not slots:
        return slots
    dest = slots.get("destination")
    if dest:
        user_text = " ".join(m.content for m in schema.messages if m.role == "user")
        if str(dest) not in user_text:
            slots = {k: v for k, v in slots.items() if k != "destination"}
    return slots


def _merge_slots(plan: TripPlan, slots: dict) -> TripPlan:
    """LLM이 추출한 슬롯을 빈 슬롯에만 머지한다(이미 정해진 값은 절대 덮어쓰지 않음)."""
    if not slots:
        return plan
    destination = plan.destination or (slots.get("destination") or None)
    transport = plan.transport
    if transport is TransportMode.UNSET and slots.get("transport"):
        transport = _safe_transport(str(slots["transport"]))
        if transport is TransportMode.UNSET:  # "자차" 같은 자연어면 정규식 추출로 보강
            transport = TransportMode.from_raw(str(slots["transport"]))
    departure_time = plan.departure_time or (slots.get("departure_time") or None)
    lodging = plan.lodging
    nights = plan.nights
    if lodging is LodgingOption.UNSET:
        raw_nights = slots.get("nights")
        raw_lodging = slots.get("lodging")
        if raw_nights is not None:
            try:
                nights = max(0, int(raw_nights))
                lodging = LodgingOption.DAYTRIP if nights == 0 else LodgingOption.OVERNIGHT
            except (TypeError, ValueError):
                pass
        elif raw_lodging in ("overnight", "daytrip"):
            lodging = LodgingOption(raw_lodging)
            nights = 0 if lodging is LodgingOption.DAYTRIP else max(1, plan.nights)
    return TripPlan(
        origin=plan.origin, destination=destination, transport=transport,
        departure_time=departure_time, lodging=lodging, nights=nights,
        lodging_pref=plan.lodging_pref or (slots.get("lodging_pref") or None),
        interests=plan.interests or (slots.get("interests") or None),
        pet_mobility=plan.pet_mobility or (slots.get("pet_mobility") or None),
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
    """코스 확정 시 사전 브리핑 — 출발·이동 → 가는 길 배려 → 숙소 체크인 → 스타일 동선 → 수정 안내.

    시나리오 STEP7의 감성 브리핑 구조를 따른다(고정 문구 복붙이 아니라 상태 기반 조립).
    """
    stay = f"{plan.nights}박 {plan.nights + 1}일" if plan.lodging is LodgingOption.OVERNIGHT else "당일치기"
    bits = [f"{plan.origin}에서 {plan.transport.label}로 출발하는 {stay} {plan.destination} 여행 플랜을 짰어요."]

    if plan.transport is TransportMode.CAR and course.stopovers:
        names = ", ".join(s.name for s in course.stopovers[:2])
        bits.append(f"가는 길엔 {names} 같은 경유지를 넣어 체리가 쉬어갈 수 있게 했어요.")

    if plan.lodging is LodgingOption.OVERNIGHT and course.lodging:
        lodge = course.lodging[0].name
        bits.append(f"전주 도착 후엔 {lodge}에 먼저 체크인해 체리도 적응할 시간을 두고, 숙소를 중심으로 동선을 짰어요.")

    if _prefers_walking(plan.pet_mobility):
        bits.append("체리가 차 이동을 힘들어하는 만큼 숙소 반경 도보 위주로 무리 없이 구성했어요.")

    style = plan.interests
    rhythm = "끼니때 식당, 식사 뒤엔 카페에서 쉬고, 오후엔 명소를 둘러보는 여유로운 리듬"
    if style:
        bits.append(f"{style} 위주로 {rhythm}으로 담았어요.")
    else:
        bits.append(f"{rhythm}으로 담았어요.")

    bits.append("보시고 빼거나 바꾸고 싶은 코스가 있으면 편하게 말씀해 주세요!")
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
        lodging_pref=plan.lodging_pref,
        interests=plan.interests,
        pet_mobility=plan.pet_mobility,
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
        reason=_stopover_reason(p.category, p.name), source=_SOURCE_TAG_TRAVEL,
    )


def _stopover_reason(category: str, name: str) -> str:
    """경유지 한 줄 — 휴게소/공원/문화 등 성격에 맞게(가는 길의 실제 쓸모를 설명)."""
    text = f"{category or ''} {name or ''}"
    if "휴게" in text:
        return "가는 길에 화장실·급수 들르며 체리 배변·다리 풀기 좋은 휴게 포인트예요."
    if any(k in text for k in ("공원", "호수", "정원", "수목", "둘레", "해변", "숲")):
        return "탁 트인 야외라 장거리 이동 중 체리가 목줄 산책으로 기분 전환하기 좋아요."
    if any(k in text for k in ("박물관", "미술관", "전시", "문화", "유적", "사찰")):
        return "잠깐 들러 둘러보기 좋은 곳이라 이동 중 쉬어가는 코스로 넣었어요."
    return "가는 길에 잠시 들러 체리와 쉬어가기 좋은 경유지예요."


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
