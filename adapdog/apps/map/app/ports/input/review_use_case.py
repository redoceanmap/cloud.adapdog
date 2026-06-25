from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Optional

from map.app.dtos.review_dto import ReviewDto


class ReviewUseCase(ABC):
    """시설 후기 조회 입력 포트."""

    @abstractmethod
    async def list_reviews(
        self, facility_id: Optional[int] = None, place_name: Optional[str] = None
    ) -> list[ReviewDto]:
        """시설(id 또는 이름)로 후기를 조회한다. 식별자가 없으면 전체."""
        ...
