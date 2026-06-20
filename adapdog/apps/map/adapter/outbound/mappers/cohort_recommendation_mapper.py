from __future__ import annotations

from map.domain.entities.cohort_recommendation_entity import RecommendedFacility
from map.domain.value_objects.pet_place_vo import Coordinate


class CohortRecommendationMapper:
    """집계 쿼리 Row → RecommendedFacility 엔티티."""

    @staticmethod
    def to_entity(row) -> RecommendedFacility:
        return RecommendedFacility(
            facility_id=row.id,
            name=row.name,
            category=row.category,
            coordinate=Coordinate(row.latitude, row.longitude),
            road_address=row.road_address,
            score=int(row.score),
        )
