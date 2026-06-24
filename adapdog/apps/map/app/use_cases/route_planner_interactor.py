from __future__ import annotations

import logging

from core.introduction import Introduction
from map.adapter.inbound.api.schemas.route_planner_schema import RouteChatSchema, RoutePlannerSchema
from map.app.dtos.route_planner_dto import (
    AgentCoursePlan,
    ChatMessage,
    CourseBrief,
    RouteChatResponse,
    RoutePlanResponse,
    RouteStopDto,
)
from map.app.ports.input.cohort_recommendation_use_case import CohortRecommendationUseCase
from map.app.ports.input.route_planner_use_case import RoutePlannerUseCase
from map.app.ports.output.route_planner_port import RoutePlannerAgentPort
from map.domain.value_objects.cohort_recommendation_vo import Cohort
from map.domain.value_objects.pet_place_vo import Coordinate, PetSize

logger = logging.getLogger(__name__)


class RoutePlannerInteractor(RoutePlannerUseCase):
    """AI 펫 동선 플래너 인터랙터.

    동선 생성은 에이전트 포트에 위임(DIP)하고, 결과를 응답 DTO로 매핑한다.
    에이전트가 Gemini인지 규칙기반인지 알지 못한다.
    닮은친구%는 코호트 추천 use case를 재사용해 계산한다(entry_verdict가 pet_place를
    재사용하는 패턴과 동일 — 시설 인기도 집계는 코호트 슬라이스의 책임이다).
    """

    def __init__(self, agent: RoutePlannerAgentPort, cohort: CohortRecommendationUseCase) -> None:
        self.agent = agent
        self.cohort = cohort

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
        pet_size = PetSize.from_raw(schema.pet_size)
        messages = [ChatMessage(role=m.role, content=m.content) for m in schema.messages]
        logger.info("[RoutePlannerInteractor] chat | turns=%d pet_size=%s", len(messages), pet_size.value)

        turn = await self.agent.chat(messages, pet_size, schema.pet_breed)

        course = None
        if turn.plan and turn.plan.stops:
            course = await self._assemble_course(turn.region or "", pet_size, turn.plan)
        return RouteChatResponse(reply=turn.reply, course=course)

    async def _assemble_course(
        self, region: str, pet_size: PetSize, plan: AgentCoursePlan
    ) -> RoutePlanResponse:
        """에이전트 동선 계획 → 응답 DTO(이동거리·닮은친구% 부여). plan_route·chat 공용."""
        # 직전 정류장으로부터의 이동 거리(km). 첫 정류장은 0.
        coords = [Coordinate(s.latitude, s.longitude) for s in plan.stops]
        prev_km = [0.0] + [round(coords[i - 1].distance_km_to(coords[i]), 2) for i in range(1, len(coords))]

        # 닮은친구% — 같은 크기 코호트가 시설에 남긴 방문 인기도. 기록이 있으면 실측,
        # 없으면 순서 기반 보수 추정(데이터가 쌓일수록 실측으로 수렴).
        recommendations = await self.cohort.recommend(Cohort(size=pet_size), action_type="visit", limit=500)
        score_by_facility = {r.facility_id: r.score for r in recommendations}
        max_score = max(score_by_facility.values(), default=1)
        similarities = [
            min(98, round(62 + score_by_facility[s.id] / max_score * 36))
            if score_by_facility.get(s.id)
            else max(64, 82 - i * 4)
            for i, s in enumerate(plan.stops)
        ]

        stops = [
            RouteStopDto(i + 1, s.name, s.category, s.latitude, s.longitude, prev_km[i], similarities[i])
            for i, s in enumerate(plan.stops)
        ]
        total_km = round(sum(prev_km), 2)
        return RoutePlanResponse(
            region=region,
            pet_size=pet_size.value,
            stop_count=len(stops),
            total_distance_km=total_km,
            summary=plan.narrative,
            stops=stops,
            recommended_trails=plan.trails,
        )

    async def introduce_myself(self) -> Introduction:
        intro = await self.agent.introduce_myself()
        intro.trail.append("interactor")
        return intro
