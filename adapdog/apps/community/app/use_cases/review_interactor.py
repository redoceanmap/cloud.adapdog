from __future__ import annotations

import logging
from typing import Optional

from community.app.dtos.review_dto import ReviewDto
from community.app.ports.input.review_use_case import ReviewUseCase
from community.app.ports.output.review_port import ReviewPort

logger = logging.getLogger(__name__)


class ReviewInteractor(ReviewUseCase):
    """리뷰 인터랙터 — 조회를 포트에 위임(DIP)하고 DTO로 매핑한다."""

    def __init__(self, repository: ReviewPort) -> None:
        self.repository = repository

    async def list_reviews(self, facility_id: Optional[int] = None) -> list[ReviewDto]:
        reviews = await self.repository.find_reviews(facility_id)
        logger.info("[ReviewInteractor] list_reviews | facility_id=%s → %d건", facility_id, len(reviews))
        return [
            ReviewDto(
                id=r.id, account_id=r.account_id, facility_id=r.facility_id,
                facility_name=r.facility_name, rating=r.rating,
                comment=r.comment, created_at=r.created_at,
            )
            for r in reviews
        ]
