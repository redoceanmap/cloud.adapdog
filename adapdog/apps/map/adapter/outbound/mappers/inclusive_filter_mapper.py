from __future__ import annotations

from map.adapter.outbound.orm.inclusive_filter_orm import BarrierFreeFacility
from map.domain.entities.inclusive_filter_entity import BarrierFreePlace
from map.domain.value_objects.inclusive_filter_vo import AccessibilityFeature
from map.domain.value_objects.pet_place_vo import Coordinate


class InclusiveFilterMapper:
    """3NF ORM(BarrierFreeFacility + 요소) ↔ BarrierFreePlace 엔티티."""

    @staticmethod
    def to_entity(facility: BarrierFreeFacility, feature_codes: set[str]) -> BarrierFreePlace:
        features = frozenset(
            f for f in (AccessibilityFeature.from_raw(c) for c in feature_codes) if f is not None
        )
        return BarrierFreePlace(
            id=facility.id,
            name=facility.name,
            coordinate=Coordinate(facility.latitude, facility.longitude),
            features=features,
        )
