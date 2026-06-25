from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Optional

from core.introduction import Introduction
from map.app.dtos.route_planner_dto import AgentCoursePlan, ChatMessage, ChatTurn, CourseBrief
from map.domain.entities.pet_place_entity import PetFriendlyPlace
from map.domain.entities.route_planner_entity import Trail
from map.domain.value_objects.pet_place_vo import PetSize


class RoutePlannerAgentPort(ABC):
    """동선을 생성하는 AI 에이전트 출력 포트.

    구현체(Gemini 함수호출 / 규칙기반 폴백)는 repository에 둔다. 둘 다 같은 계약(LSP).
    """

    @abstractmethod
    async def plan(self, brief: CourseBrief) -> AgentCoursePlan:
        """반려견 조건과 지역을 받아 펫 동반 가능 동선을 생성한다."""
        ...

    @abstractmethod
    async def chat(
        self, messages: list[ChatMessage], pet_size: PetSize, pet_breed: Optional[str],
        pet_traits: Optional[str] = None,
    ) -> ChatTurn:
        """대화 기록을 받아 대화형으로 응답하고, 코스 확정 시 동선 계획을 함께 반환한다."""
        ...

    async def introduce_myself(self) -> Introduction:
        """연동 검증용 자기소개 — repository 계층에서 출발한다(구현체가 상속)."""
        return Introduction(
            context="map",
            feature="route_planner",
            message="AI 펫 동선 플래너 기능입니다. 연동 정상!",
            trail=["repository"],
        )


class TrailPort(ABC):
    """관광 둘레길 조회 출력 포트. 구현체(CSV)는 repository에 둔다."""

    @abstractmethod
    async def find_trails(self, region: str) -> list[Trail]:
        """지역(시작지점 주소 부분일치)의 둘레길 목록을 반환한다."""
        ...


class LodgingPort(ABC):
    """목적지 펫 동반 숙소 조회 출력 포트(숙박 계획 시). 구현체는 repository에 둔다."""

    @abstractmethod
    async def find_lodging(self, region: str, pet_size: PetSize) -> list[PetFriendlyPlace]:
        """지역의 펫 동반 가능 숙소(크기 동반 가능분)를 반환한다."""
        ...


class RouteLegsPort(ABC):
    """자차 이동 시 출발→목적지 경로상 경유지 조회 출력 포트. 구현체는 repository에 둔다."""

    @abstractmethod
    async def stopovers(self, origin: str, destination: str, pet_size: PetSize) -> list[PetFriendlyPlace]:
        """출발→목적지 가는 길에 들르기 좋은 펫 동반 경유지를 반환한다."""
        ...
