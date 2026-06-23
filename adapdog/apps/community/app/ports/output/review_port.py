from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Optional

from community.domain.entities.review_entity import Review


class ReviewPort(ABC):
    """리뷰 데이터 조회 출력 포트. 구현체(mock/DB)는 repository에 둔다."""

    @abstractmethod
    async def find_reviews(self, facility_id: Optional[int]) -> list[Review]:
        """시설(선택)로 리뷰 도메인 엔티티를 조회한다."""
        ...
