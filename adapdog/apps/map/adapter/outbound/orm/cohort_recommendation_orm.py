from __future__ import annotations

from core.database.base import Base


class CohortRecommendationOrm(Base):
    """코호트 추천 슬라이스 ORM.

    자체 테이블 없음 — pet_activity(users 행동 신호) ⋈ pet/pet_trait ⋈ facility(map)를
    읽어 집계하는 CQRS read 모델이다. 영속 대상이 없어 추상으로 둔다.
    """

    __abstract__ = True
