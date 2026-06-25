from __future__ import annotations

from map.domain.entities.visited_place_entity import VisitedPlace
from map.domain.value_objects.pet_place_vo import Coordinate


class VisitedPlaceMapper:
    """집계 쿼리 Row → VisitedPlace 엔티티."""

    @staticmethod
    def to_entity(row) -> VisitedPlace:
        return VisitedPlace(
            facility_id=row.id,
            name=row.name,
            category=row.category,
            coordinate=Coordinate(row.latitude, row.longitude),
            region=row.region,
            road_address=row.road_address,
            visit_count=int(row.visit_count),
            first_visited_at=row.first_visited_at,
        )
