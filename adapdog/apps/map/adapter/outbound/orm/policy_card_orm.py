from __future__ import annotations

from core.database.base import Base


class PolicyCardOrm(Base):
    """정책 카드 ORM.

    [기획 홀딩] 카드는 요청 시 생성하며 영속화하지 않는다. 캐싱이 필요해지면 정의.
    """

    __abstract__ = True
