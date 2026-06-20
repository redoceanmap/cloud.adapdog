from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Optional

from core.introduction import Introduction
from map.domain.entities.cohort_recommendation_entity import RecommendedFacility
from map.domain.value_objects.cohort_recommendation_vo import Cohort


class CohortRecommendationPort(ABC):
    """코호트 추천 집계 출력 포트. 구현체(DB read 모델/빈 폴백)는 repository에 둔다."""

    @abstractmethod
    async def top_facilities(
        self, cohort: Cohort, action_type: Optional[str], limit: int
    ) -> list[RecommendedFacility]:
        """코호트가 쌓은 행동을 시설별로 집계해 인기순 시설을 반환한다."""
        ...

    async def introduce_myself(self) -> Introduction:
        """연동 검증용 자기소개 — repository 계층에서 출발한다(구현체가 상속)."""
        return Introduction(
            context="map",
            feature="cohort_recommendation",
            message="코호트 기반 시설 추천 기능입니다. 연동 정상!",
            trail=["repository"],
        )
