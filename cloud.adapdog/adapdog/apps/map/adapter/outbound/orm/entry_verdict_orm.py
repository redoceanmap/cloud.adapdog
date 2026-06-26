from __future__ import annotations

from core.database.base import Base


class EntryVerdictOrm(Base):
    """입장 판정 ORM.

    [기획 홀딩] 판정은 요청 시 계산하며 영속화하지 않는다. 판정 이력 저장이 필요해지면 정의.
    """

    __abstract__ = True
