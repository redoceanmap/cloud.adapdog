from __future__ import annotations

import logging

from map.adapter.inbound.api.schemas.route_planner_schema import RoutePlannerSchema
from map.app.dtos.route_planner_dto import CourseBrief, RoutePlanResponse, RouteStopDto
from map.app.ports.input.route_planner_use_case import RoutePlannerUseCase
from map.app.ports.output.route_planner_port import RoutePlannerAgentPort
from map.domain.value_objects.pet_place_vo import Coordinate, PetSize

logger = logging.getLogger(__name__)


class RoutePlannerInteractor(RoutePlannerUseCase):
    """AI 펫 동선 플래너 인터랙터.

    동선 생성은 에이전트 포트에 위임(DIP)하고, 결과를 응답 DTO로 매핑한다.
    에이전트가 Gemini인지 규칙기반인지 알지 못한다.
    """

    def __init__(self, agent: RoutePlannerAgentPort) -> None:
        self.agent = agent

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

        stops = [
            RouteStopDto(i + 1, s.name, s.category, s.latitude, s.longitude)
            for i, s in enumerate(plan.stops)
        ]
        coords = [Coordinate(s.latitude, s.longitude) for s in plan.stops]
        total_km = round(sum(a.distance_km_to(b) for a, b in zip(coords, coords[1:])), 2)
        return RoutePlanResponse(
            region=schema.region,
            pet_size=pet_size.value,
            stop_count=len(stops),
            total_distance_km=total_km,
            summary=plan.narrative,
            stops=stops,
            recommended_trails=plan.trails,
        )
