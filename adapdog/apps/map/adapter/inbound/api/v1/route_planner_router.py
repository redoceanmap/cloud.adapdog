from __future__ import annotations

from fastapi import APIRouter, Depends

from map.adapter.inbound.api.schemas.route_planner_schema import RoutePlannerSchema
from map.app.dtos.route_planner_dto import RoutePlanResponse
from map.app.ports.input.route_planner_use_case import RoutePlannerUseCase
from map.dependencies.route_planner_provider import get_route_planner_use_case

route_planner_router = APIRouter(prefix="/route-planner", tags=["route-planner"])


@route_planner_router.post("/plan")
async def plan_route(
    schema: RoutePlannerSchema,
    use_case: RoutePlannerUseCase = Depends(get_route_planner_use_case),
) -> RoutePlanResponse:
    return await use_case.plan_route(schema)
