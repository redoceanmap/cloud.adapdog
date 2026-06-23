from __future__ import annotations

import logging

# review_orm을 임포트해 Base.metadata에 등록 → create_all_tables가 테이블 생성.
from community.adapter.outbound.orm.review_orm import ReviewOrm  # noqa: F401
from community.adapter.outbound.repositories.review_repository import MockReviewRepository
from community.app.ports.input.review_use_case import ReviewUseCase
from community.app.ports.output.review_port import ReviewPort
from community.app.use_cases.review_interactor import ReviewInteractor

logger = logging.getLogger(__name__)


def get_review_repository() -> ReviewPort:
    """리뷰 DB 미연동 단계 → mock repository."""
    logger.info("[provider] review: mock 데이터 사용")
    return MockReviewRepository()


def get_review_use_case() -> ReviewUseCase:
    return ReviewInteractor(repository=get_review_repository())
