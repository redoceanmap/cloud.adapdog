from __future__ import annotations

from abc import ABC, abstractmethod
from typing import TYPE_CHECKING

from core.introduction import Introduction
from map.app.dtos.animal_hospital_dto import AnimalHospitalListResponse

if TYPE_CHECKING:
    from map.adapter.inbound.api.schemas.animal_hospital_schema import AnimalHospitalSchema


class AnimalHospitalUseCase(ABC):
    """응급 동물병원 안내 입력 포트."""

    @abstractmethod
    async def nearby(self, schema: "AnimalHospitalSchema") -> AnimalHospitalListResponse:
        """현재 위치 기준 가까운(영업 중) 동물병원을 거리순으로 안내한다."""
        ...

    @abstractmethod
    async def introduce_myself(self) -> Introduction:
        """이 기능의 자기소개(연동 검증)."""
        ...
