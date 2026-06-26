from __future__ import annotations

from core.database.base import Base


class RoutePlannerOrm(Base):
    """동선 슬라이스 ORM.

    [기획 홀딩] 동선 결과는 현재 영속화하지 않는다(요청 시 생성).
    동선 저장/공유 기능이 생기면 실 테이블을 정의한다.
    """

    __abstract__ = True
