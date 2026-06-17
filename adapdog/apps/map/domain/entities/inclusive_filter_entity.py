from __future__ import annotations

from dataclasses import dataclass

from map.domain.value_objects.inclusive_filter_vo import AccessibilityFeature
from map.domain.value_objects.pet_place_vo import Coordinate


@dataclass
class BarrierFreePlace:
    """무장애(배리어프리) 시설.

    원천: 한국문화정보원 '전국 문화예술관광지 배리어프리 정보'.
    """

    id: int
    name: str
    coordinate: Coordinate
    features: frozenset[AccessibilityFeature]

    def is_near(self, coordinate: Coordinate, threshold_km: float = 0.3) -> bool:
        """같은 시설로 볼 수 있을 만큼 가까운가(펫 시설과의 교차 매칭용)."""
        return self.coordinate.distance_km_to(coordinate) <= threshold_km

    def satisfies(self, required: frozenset[AccessibilityFeature]) -> bool:
        return required.issubset(self.features)
