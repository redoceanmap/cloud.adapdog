from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Optional

from users.domain.entities.account_entity import Account


class AccountPort(ABC):
    """회원 저장/조회 출력 포트. 구현체(인메모리/DB)는 repository에 둔다."""

    @abstractmethod
    async def find_by_email(self, email: str) -> Optional[Account]:
        ...

    @abstractmethod
    async def find_by_id(self, account_id: int) -> Optional[Account]:
        ...

    @abstractmethod
    async def save(self, account: Account) -> Account:
        """신규 회원을 저장하고 id가 채워진 엔티티를 반환한다."""
        ...


class PasswordHasherPort(ABC):
    """비밀번호 해싱 출력 포트. 인터랙터는 bcrypt 등 구체 구현을 알지 못한다(DIP)."""

    @abstractmethod
    def hash(self, raw: str) -> str:
        ...

    @abstractmethod
    def verify(self, raw: str, hashed: str) -> bool:
        ...


class TokenServicePort(ABC):
    """액세스 토큰 발급/검증 출력 포트. JWT 등 구체 구현을 인터랙터로부터 분리."""

    @abstractmethod
    def issue(self, account_id: int) -> str:
        ...

    @abstractmethod
    def parse(self, token: str) -> Optional[int]:
        """토큰을 검증하고 account_id를 반환. 유효하지 않으면 None."""
        ...
