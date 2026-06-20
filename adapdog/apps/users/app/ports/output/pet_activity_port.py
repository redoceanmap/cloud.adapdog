from __future__ import annotations

from abc import ABC, abstractmethod

from core.introduction import Introduction
from users.domain.entities.pet_activity_entity import PetActivity


class PetActivityPort(ABC):
    """반려동물 행동 저장/조회 출력 포트. 구현체(인메모리/DB)는 repository에 둔다."""

    @abstractmethod
    async def save(self, activity: PetActivity) -> PetActivity:
        """행동을 저장하고 id·occurred_at이 채워진 엔티티를 반환한다."""
        ...

    @abstractmethod
    async def find_by_pet(self, pet_id: int) -> list[PetActivity]:
        ...

    async def introduce_myself(self) -> Introduction:
        """연동 검증용 자기소개 — repository 계층에서 출발한다(구현체가 상속)."""
        return Introduction(
            context="users",
            feature="pet_activity",
            message="반려동물 행동 기록(방문/저장) 기능입니다. 연동 정상!",
            trail=["repository"],
        )
