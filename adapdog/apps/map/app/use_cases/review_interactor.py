from __future__ import annotations

import logging
from typing import Optional

from map.app.dtos.review_dto import ReviewDto
from map.app.ports.input.review_use_case import ReviewUseCase
from map.app.ports.output.review_port import ReviewPort

logger = logging.getLogger(__name__)


class ReviewInteractor(ReviewUseCase):
    """시설 후기 인터랙터 — 조회를 포트에 위임(DIP)하고 DTO로 매핑한다."""

    def __init__(self, repository: ReviewPort) -> None:
        self.repository = repository

    async def list_reviews(
        self, facility_id: Optional[int] = None, place_name: Optional[str] = None
    ) -> list[ReviewDto]:
        reviews = await self.repository.find_reviews(facility_id, place_name)
        logger.info(
            "[ReviewInteractor] list_reviews | facility_id=%s place_name=%s → %d건",
            facility_id, place_name, len(reviews),
        )
        return [
            ReviewDto(
                id=r.id, facility_id=r.facility_id, place_name=r.place_name,
                title=r.title, body=r.body, rating=r.rating,
                author=r.author, source=r.source,
            )
            for r in reviews
        ]
