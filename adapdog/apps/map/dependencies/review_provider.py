from __future__ import annotations

import logging

from map.adapter.outbound.repositories.review_repository import MockReviewRepository
from map.app.ports.input.review_use_case import ReviewUseCase
from map.app.ports.output.review_port import ReviewPort
from map.app.use_cases.review_interactor import ReviewInteractor

logger = logging.getLogger(__name__)


def get_review_repository() -> ReviewPort:
    """후기 공공/실데이터 미연동 단계 → mock repository."""
    logger.info("[provider] review: mock 데이터 사용")
    return MockReviewRepository()


def get_review_use_case() -> ReviewUseCase:
    return ReviewInteractor(repository=get_review_repository())
