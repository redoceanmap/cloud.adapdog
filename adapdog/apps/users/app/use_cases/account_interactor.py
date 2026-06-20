from __future__ import annotations

import logging

from core.introduction import Introduction
from users.app.ports.input.account_use_case import AccountUseCase
from users.app.ports.output.account_port import (
    AccountPort,
    PasswordHasherPort,
    TokenServicePort,
)
from users.domain.entities.account_entity import Account
from users.domain.value_objects.account_vo import Email

logger = logging.getLogger(__name__)


class EmailAlreadyExistsError(Exception):
    """이미 가입된 이메일."""


class InvalidCredentialsError(Exception):
    """이메일/비밀번호 불일치 또는 유효하지 않은 토큰."""


class AccountInteractor(AccountUseCase):
    """회원 인증 인터랙터. 해싱·토큰 발급은 추상 포트에 위임한다(DIP)."""

    def __init__(
        self,
        repository: AccountPort,
        hasher: PasswordHasherPort,
        token_service: TokenServicePort,
    ) -> None:
        self.repository = repository
        self.hasher = hasher
        self.token_service = token_service

    async def signup(self, email: str, password: str, nickname: str) -> tuple[Account, str]:
        email = Email(email).value  # 형식 검증
        if await self.repository.find_by_email(email) is not None:
            raise EmailAlreadyExistsError(email)

        account = await self.repository.save(
            Account(id=None, email=email, password_hash=self.hasher.hash(password), nickname=nickname)
        )
        logger.info("[AccountInteractor] signup | id=%s email=%s", account.id, email)
        return account, self.token_service.issue(account.id)

    async def login(self, email: str, password: str) -> str:
        account = await self.repository.find_by_email(email)
        if account is None or not self.hasher.verify(password, account.password_hash):
            raise InvalidCredentialsError(email)
        logger.info("[AccountInteractor] login | id=%s", account.id)
        return self.token_service.issue(account.id)

    async def authenticate(self, token: str) -> Account:
        account_id = self.token_service.parse(token)
        if account_id is None:
            raise InvalidCredentialsError("invalid token")
        account = await self.repository.find_by_id(account_id)
        if account is None:
            raise InvalidCredentialsError("account not found")
        return account

    async def introduce_myself(self) -> Introduction:
        intro = await self.repository.introduce_myself()
        intro.trail.append("interactor")
        return intro
