from __future__ import annotations

from abc import ABC, abstractmethod
from typing import TYPE_CHECKING

from core.introduction import Introduction
from map.app.dtos.route_planner_dto import RoutePlanResponse

if TYPE_CHECKING:
    from map.adapter.inbound.api.schemas.route_planner_schema import RoutePlannerSchema


class RoutePlannerUseCase(ABC):
    """AI 펫 동선 플래너 입력 포트."""

    @abstractmethod
    async def plan_route(self, schema: "RoutePlannerSchema") -> RoutePlanResponse:
        """반려견 조건과 지역을 받아 펫 동반 가능 동선을 생성한다."""
        ...

    @abstractmethod
    async def introduce_myself(self) -> Introduction:
        """이 기능의 자기소개(연동 검증)."""
        ...
