from __future__ import annotations

import logging
from functools import lru_cache

from core.config import DATABASE_URL
from map.adapter.outbound.repositories.cohort_recommendation_repository import (
    DbCohortRecommendationRepository,
    EmptyCohortRecommendationRepository,
)
from map.app.ports.input.cohort_recommendation_use_case import CohortRecommendationUseCase
from map.app.ports.output.cohort_recommendation_port import CohortRecommendationPort
from map.app.use_cases.cohort_recommendation_interactor import CohortRecommendationInteractor

logger = logging.getLogger(__name__)


@lru_cache(maxsize=1)
def get_cohort_recommendation_repository() -> CohortRecommendationPort:
    """DB가 있으면 read 모델, 없으면 빈 추천 폴백(누적 데이터가 DB에만 있으므로)."""
    if DATABASE_URL:
        logger.info("[provider] cohort_recommendation: DB read 모델 사용")
        return DbCohortRecommendationRepository()
    logger.info("[provider] cohort_recommendation: DB 없음 → 빈 추천")
    return EmptyCohortRecommendationRepository()


def get_cohort_recommendation_use_case() -> CohortRecommendationUseCase:
    return CohortRecommendationInteractor(repository=get_cohort_recommendation_repository())
