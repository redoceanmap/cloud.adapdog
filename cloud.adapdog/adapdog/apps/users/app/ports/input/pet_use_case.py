from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Optional

from core.introduction import Introduction
from users.domain.entities.pet_entity import Pet


class PetUseCase(ABC):
    """반려동물 등록 입력 포트."""

    @abstractmethod
    async def register(
        self,
        account_id: int,
        name: str,
        breed: str,
        photo_url: str,
        birth_year: Optional[int] = None,
        gender: Optional[str] = None,
        features: Optional[str] = None,
    ) -> Pet:
        """견종 카탈로그로 크기·체질·기질을 자동완성한 뒤 반려동물을 등록한다."""
        ...

    @abstractmethod
    async def list_by_account(self, account_id: int) -> list[Pet]:
        ...

    @abstractmethod
    async def update_profile(
        self,
        account_id: int,
        pet_id: int,
        *,
        name: str | None = None,
        breed: str | None = None,
        photo_url: str | None = None,
        features: str | None = None,
        birth_year: int | None = None,
    ) -> Pet:
        """반려동물 프로필을 수정한다."""
        ...

    @abstractmethod
    async def introduce_myself(self) -> Introduction:
        """이 기능의 자기소개(연동 검증)."""
        ...
