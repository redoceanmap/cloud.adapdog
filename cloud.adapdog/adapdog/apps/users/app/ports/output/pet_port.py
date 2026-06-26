from __future__ import annotations

from abc import ABC, abstractmethod

from core.introduction import Introduction
from users.domain.entities.pet_entity import Pet


class PetPort(ABC):
    """반려동물 저장/조회 출력 포트. 구현체(인메모리/DB)는 repository에 둔다."""

    @abstractmethod
    async def save(self, pet: Pet) -> Pet:
        """반려동물을 저장하고 id가 채워진 엔티티를 반환한다."""
        ...

    @abstractmethod
    async def find_by_account(self, account_id: int) -> list[Pet]:
        ...

    @abstractmethod
    async def find_by_id(self, pet_id: int) -> Pet | None:
        ...

    @abstractmethod
    async def update(self, pet: Pet) -> Pet:
        ...

    async def introduce_myself(self) -> Introduction:
        """연동 검증용 자기소개 — repository 계층에서 출발한다(구현체가 상속)."""
        return Introduction(
            context="users",
            feature="pet",
            message="반려동물 등록 기능입니다. 연동 정상!",
            trail=["repository"],
        )
