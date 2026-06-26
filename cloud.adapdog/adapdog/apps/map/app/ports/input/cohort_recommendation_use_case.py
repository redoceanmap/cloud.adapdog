from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Optional

from core.introduction import Introduction
from map.domain.entities.cohort_recommendation_entity import RecommendedFacility
from map.domain.value_objects.cohort_recommendation_vo import Cohort


class CohortRecommendationUseCase(ABC):
    """코호트 기반 시설 추천 입력 포트."""

    @abstractmethod
    async def recommend(
        self, cohort: Cohort, action_type: Optional[str] = None, limit: int = 10
    ) -> list[RecommendedFacility]:
        """코호트(특징)의 누적 행동을 시설별로 집계해 인기순으로 추천한다."""
        ...

    @abstractmethod
    async def introduce_myself(self) -> Introduction:
        """이 기능의 자기소개(연동 검증)."""
        ...
