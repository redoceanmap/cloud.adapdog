from __future__ import annotations

from users.adapter.outbound.orm.account_orm import AccountOrm
from users.domain.entities.account_entity import Account


class AccountMapper:
    """AccountOrm ↔ Account 엔티티."""

    @staticmethod
    def to_entity(row: AccountOrm) -> Account:
        return Account(
            id=row.id,
            email=row.email,
            password_hash=row.password_hash,
            nickname=row.nickname,
            created_at=row.created_at,
        )

    @staticmethod
    def to_orm(account: Account) -> AccountOrm:
        return AccountOrm(
            email=account.email,
            password_hash=account.password_hash,
            nickname=account.nickname,
        )
