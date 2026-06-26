from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Optional

from core.introduction import Introduction
from map.domain.entities.animal_hospital_entity import AnimalHospital


class AnimalHospitalPort(ABC):
    """동물병원 조회 출력 포트. 구현체(CSV/DB)는 repository에 둔다."""

    @abstractmethod
    async def find(self, region: Optional[str], open_only: bool) -> list[AnimalHospital]:
        """지역(도로명주소 부분일치)으로 동물병원을 조회한다. open_only면 영업 중만."""
        ...

    async def introduce_myself(self) -> Introduction:
        """연동 검증용 자기소개 — repository 계층에서 출발한다."""
        return Introduction(
            context="map",
            feature="animal_hospital",
            message="응급 동물병원 안내 기능입니다. 연동 정상!",
            trail=["repository"],
        )
