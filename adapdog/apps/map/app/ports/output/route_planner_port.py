from __future__ import annotations

from abc import ABC, abstractmethod

from map.app.dtos.route_planner_dto import AgentCoursePlan, CourseBrief
from map.domain.entities.route_planner_entity import Trail


class RoutePlannerAgentPort(ABC):
    """동선을 생성하는 AI 에이전트 출력 포트.

    구현체(Gemini 함수호출 / 규칙기반 폴백)는 repository에 둔다. 둘 다 같은 계약(LSP).
    """

    @abstractmethod
    async def plan(self, brief: CourseBrief) -> AgentCoursePlan:
        """반려견 조건과 지역을 받아 펫 동반 가능 동선을 생성한다."""
        ...


class TrailPort(ABC):
    """관광 둘레길 조회 출력 포트. 구현체(CSV)는 repository에 둔다."""

    @abstractmethod
    async def find_trails(self, region: str) -> list[Trail]:
        """지역(시작지점 주소 부분일치)의 둘레길 목록을 반환한다."""
        ...
