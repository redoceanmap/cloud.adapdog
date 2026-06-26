from __future__ import annotations

from abc import ABC, abstractmethod
from typing import TYPE_CHECKING

from core.introduction import Introduction
from map.app.dtos.route_planner_dto import RouteChatResponse, RoutePlanResponse

if TYPE_CHECKING:
    from map.adapter.inbound.api.schemas.route_planner_schema import (
        RouteChatSchema,
        RouteOptimizeSchema,
        RoutePlannerSchema,
        RouteRecommendSchema,
    )


class RoutePlannerUseCase(ABC):
    """AI 펫 동선 플래너 입력 포트."""

    @abstractmethod
    async def plan_route(self, schema: "RoutePlannerSchema") -> RoutePlanResponse:
        """반려견 조건과 지역을 받아 펫 동반 가능 동선을 생성한다."""
        ...

    @abstractmethod
    async def chat(self, schema: "RouteChatSchema") -> RouteChatResponse:
        """대화 기록을 받아 대화형으로 응답하고, 코스가 확정되면 함께 반환한다."""
        ...

    @abstractmethod
    async def recommend(self, schema: "RouteRecommendSchema") -> RouteChatResponse:
        """현재 코스를 분석해 대화형으로 대안을 추천한다(코스 재생성 없이 추천 칩만)."""
        ...

    @abstractmethod
    async def optimize(self, schema: "RouteOptimizeSchema") -> RoutePlanResponse:
        """사용자가 선택한 정류장들을 출발점 기준 최적 순서로 재배열한다."""
        ...

    @abstractmethod
    async def introduce_myself(self) -> Introduction:
        """이 기능의 자기소개(연동 검증)."""
        ...
