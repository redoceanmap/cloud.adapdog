from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Optional

from community.app.dtos.review_dto import ReviewDto


class ReviewUseCase(ABC):
    """리뷰 조회 입력 포트."""

    @abstractmethod
    async def list_reviews(self, facility_id: Optional[int] = None) -> list[ReviewDto]:
        """시설(선택)로 리뷰를 조회한다. facility_id가 없으면 전체."""
        ...
