from __future__ import annotations

import logging
from typing import Optional

from core.introduction import Introduction
from map.app.ports.input.cohort_recommendation_use_case import CohortRecommendationUseCase
from map.app.ports.output.cohort_recommendation_port import CohortRecommendationPort
from map.domain.entities.cohort_recommendation_entity import RecommendedFacility
from map.domain.value_objects.cohort_recommendation_vo import Cohort

logger = logging.getLogger(__name__)


class CohortRecommendationInteractor(CohortRecommendationUseCase):
    """코호트 추천 인터랙터. 집계 구현(DB read 모델)은 알지 못한다(DIP)."""

    def __init__(self, repository: CohortRecommendationPort) -> None:
        self.repository = repository

    async def recommend(
        self, cohort: Cohort, action_type: Optional[str] = None, limit: int = 10
    ) -> list[RecommendedFacility]:
        results = await self.repository.top_facilities(cohort, action_type, limit)
        logger.info(
            "[CohortRecommendationInteractor] recommend | size=%s traits=%s action=%s → %d곳",
            cohort.size.value, sorted(t.value for t in cohort.traits), action_type or "all", len(results),
        )
        return results

    async def introduce_myself(self) -> Introduction:
        intro = await self.repository.introduce_myself()
        intro.trail.append("interactor")
        return intro
