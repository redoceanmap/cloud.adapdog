from __future__ import annotations

from fastapi import APIRouter, Depends

from core.introduction import IntroductionSchema
from map.adapter.inbound.api.schemas.route_planner_schema import RouteChatSchema, RoutePlannerSchema
from map.app.dtos.route_planner_dto import RouteChatResponse, RoutePlanResponse
from map.app.ports.input.route_planner_use_case import RoutePlannerUseCase
from map.dependencies.route_planner_provider import get_route_planner_use_case

route_planner_router = APIRouter(prefix="/route-planner", tags=["route-planner"])


@route_planner_router.post("/plan")
async def plan_route(
    schema: RoutePlannerSchema,
    use_case: RoutePlannerUseCase = Depends(get_route_planner_use_case),
) -> RoutePlanResponse:
    return await use_case.plan_route(schema)


@route_planner_router.post("/chat")
async def chat_route(
    schema: RouteChatSchema,
    use_case: RoutePlannerUseCase = Depends(get_route_planner_use_case),
) -> RouteChatResponse:
    """대화형 AI 동선 플래너 — 대화 기록을 받아 답변하고, 코스 확정 시 함께 반환."""
    return await use_case.chat(schema)


@route_planner_router.get("/myself", tags=["자기소개 (연동 검증)"])
async def introduce_myself(
    use_case: RoutePlannerUseCase = Depends(get_route_planner_use_case),
) -> IntroductionSchema:
    """연동 검증용 자기소개 — router→use case→interactor→port→repository 전 계층 확인."""
    intro = await use_case.introduce_myself()
    intro.trail.append("router")
    return IntroductionSchema.from_entity(intro)
