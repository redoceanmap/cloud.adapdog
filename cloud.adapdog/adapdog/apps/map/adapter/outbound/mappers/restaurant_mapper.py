from __future__ import annotations

from map.adapter.outbound.orm.restaurant_orm import RestaurantOrm
from map.domain.entities.restaurant_entity import Restaurant
from map.domain.value_objects.pet_place_vo import Coordinate


class RestaurantMapper:
    """3NF ORM(RestaurantOrm) ↔ Restaurant 엔티티. 썸네일은 역정규화된 thumbnail_url 사용."""

    @staticmethod
    def to_entity(row: RestaurantOrm) -> Restaurant:
        return Restaurant(
            name=row.name,
            coordinate=Coordinate(row.latitude, row.longitude),
            category=row.cuisine or "음식점",
            phone=row.phone,
            address=row.road_address or row.jibun_address,
            image_url=row.thumbnail_url,
            pet_friendly=bool(row.pet_friendly),
            recommended=bool(row.recommended),
        )
