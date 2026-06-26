from __future__ import annotations

from abc import ABC, abstractmethod

from core.introduction import Introduction
from users.domain.entities.account_entity import Account


class AccountUseCase(ABC):
    """회원 인증 입력 포트."""

    @abstractmethod
    async def signup(self, email: str, password: str, nickname: str) -> tuple[Account, str]:
        """회원을 생성하고 (회원, access token)을 반환한다."""
        ...

    @abstractmethod
    async def login(self, email: str, password: str) -> tuple[Account, str]:
        """자격 증명을 확인하고 (회원, access token)을 반환한다."""
        ...

    @abstractmethod
    async def authenticate(self, token: str) -> Account:
        """access token을 검증하고 해당 회원을 반환한다."""
        ...

    @abstractmethod
    async def introduce_myself(self) -> Introduction:
        """이 기능의 자기소개(연동 검증)."""
        ...
