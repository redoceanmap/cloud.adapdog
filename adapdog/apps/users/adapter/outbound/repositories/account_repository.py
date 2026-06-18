from __future__ import annotations

from datetime import datetime, timedelta, timezone
from typing import Optional

import bcrypt
import jwt
from sqlalchemy import select

from core.database import session as dbs
from users.adapter.outbound.mappers.account_mapper import AccountMapper
from users.adapter.outbound.orm.account_orm import AccountOrm
from users.app.ports.output.account_port import (
    AccountPort,
    PasswordHasherPort,
    TokenServicePort,
)
from users.domain.entities.account_entity import Account


# ── 회원 저장소 ───────────────────────────────────────────────────────────────
class InMemoryAccountRepository(AccountPort):
    """DB 없이 부팅할 때 쓰는 인메모리 구현(개발/데모). 프로세스 수명 동안만 유지."""

    def __init__(self) -> None:
        self._by_id: dict[int, Account] = {}
        self._seq = 0

    async def find_by_email(self, email: str) -> Optional[Account]:
        return next((a for a in self._by_id.values() if a.email == email), None)

    async def find_by_id(self, account_id: int) -> Optional[Account]:
        return self._by_id.get(account_id)

    async def save(self, account: Account) -> Account:
        self._seq += 1
        account.id = self._seq
        self._by_id[self._seq] = account
        return account


class DbAccountRepository(AccountPort):
    """account 테이블 기반 구현."""

    async def find_by_email(self, email: str) -> Optional[Account]:
        async with dbs.get_session_factory()() as s:
            row = (await s.execute(
                select(AccountOrm).where(AccountOrm.email == email)
            )).scalar_one_or_none()
        return AccountMapper.to_entity(row) if row else None

    async def find_by_id(self, account_id: int) -> Optional[Account]:
        async with dbs.get_session_factory()() as s:
            row = await s.get(AccountOrm, account_id)
        return AccountMapper.to_entity(row) if row else None

    async def save(self, account: Account) -> Account:
        async with dbs.get_session_factory()() as s:
            row = AccountMapper.to_orm(account)
            s.add(row)
            await s.commit()
            await s.refresh(row)
        return AccountMapper.to_entity(row)


# ── 보안 어댑터 (도메인이 아닌 인프라 계층) ──────────────────────────────────
def _to_bytes(raw: str) -> bytes:
    """bcrypt 입력(최대 72바이트)으로 인코딩. 초과분은 잘라 일관되게 처리한다."""
    return raw.encode("utf-8")[:72]


class BcryptPasswordHasher(PasswordHasherPort):
    """bcrypt 기반 비밀번호 해싱 구현."""

    def hash(self, raw: str) -> str:
        return bcrypt.hashpw(_to_bytes(raw), bcrypt.gensalt()).decode("utf-8")

    def verify(self, raw: str, hashed: str) -> bool:
        return bcrypt.checkpw(_to_bytes(raw), hashed.encode("utf-8"))


class JwtTokenService(TokenServicePort):
    """JWT(pyjwt) 기반 액세스 토큰 구현. 시크릿/알고리즘/만료는 주입받는다(테스트 용이)."""

    def __init__(self, secret_key: str, algorithm: str, expire_minutes: int) -> None:
        self.secret_key = secret_key
        self.algorithm = algorithm
        self.expire_minutes = expire_minutes

    def issue(self, account_id: int) -> str:
        now = datetime.now(timezone.utc)
        payload = {
            "sub": str(account_id),
            "iat": now,
            "exp": now + timedelta(minutes=self.expire_minutes),
        }
        return jwt.encode(payload, self.secret_key, algorithm=self.algorithm)

    def parse(self, token: str) -> Optional[int]:
        try:
            payload = jwt.decode(token, self.secret_key, algorithms=[self.algorithm])
            return int(payload["sub"])
        except (jwt.PyJWTError, KeyError, ValueError):
            return None
