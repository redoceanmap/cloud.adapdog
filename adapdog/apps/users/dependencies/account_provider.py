from __future__ import annotations

import logging
from functools import lru_cache

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from core.config import DATABASE_URL, JWT_ALGORITHM, JWT_EXPIRE_MINUTES, JWT_SECRET_KEY
from users.adapter.outbound.repositories.account_repository import (
    BcryptPasswordHasher,
    DbAccountRepository,
    InMemoryAccountRepository,
    JwtTokenService,
)
from users.app.ports.input.account_use_case import AccountUseCase
from users.app.ports.output.account_port import (
    AccountPort,
    PasswordHasherPort,
    TokenServicePort,
)
from users.app.use_cases.account_interactor import AccountInteractor, InvalidCredentialsError
from users.domain.entities.account_entity import Account

logger = logging.getLogger(__name__)

_bearer = HTTPBearer(auto_error=False)


@lru_cache(maxsize=1)
def get_account_repository() -> AccountPort:
    """DB > 인메모리 순으로 선택. 인메모리는 상태 보존을 위해 싱글톤으로 둔다."""
    if DATABASE_URL:
        logger.info("[provider] account: DB 사용")
        return DbAccountRepository()
    logger.info("[provider] account: 인메모리(개발) 사용")
    return InMemoryAccountRepository()


@lru_cache(maxsize=1)
def get_password_hasher() -> PasswordHasherPort:
    return BcryptPasswordHasher()


@lru_cache(maxsize=1)
def get_token_service() -> TokenServicePort:
    return JwtTokenService(JWT_SECRET_KEY, JWT_ALGORITHM, JWT_EXPIRE_MINUTES)


def get_account_use_case() -> AccountUseCase:
    return AccountInteractor(
        repository=get_account_repository(),
        hasher=get_password_hasher(),
        token_service=get_token_service(),
    )


async def get_current_account(
    credentials: HTTPAuthorizationCredentials | None = Depends(_bearer),
    use_case: AccountUseCase = Depends(get_account_use_case),
) -> Account:
    """Bearer 토큰을 검증해 현재 회원을 주입한다. 보호 엔드포인트가 사용."""
    if credentials is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="인증이 필요합니다")
    try:
        return await use_case.authenticate(credentials.credentials)
    except InvalidCredentialsError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="유효하지 않은 토큰입니다")
