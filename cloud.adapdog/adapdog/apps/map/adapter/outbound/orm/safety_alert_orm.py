from __future__ import annotations

from core.database.base import Base


class SafetyAlertOrm(Base):
    """안전·위험 알리미 ORM.

    [기획 홀딩] 위험도는 요청 시 계산하며 영속화하지 않는다.
    """

    __abstract__ = True
