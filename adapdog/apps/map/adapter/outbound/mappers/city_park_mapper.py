from __future__ import annotations

from map.adapter.outbound.orm.city_park_orm import CityParkOrm
from map.domain.entities.city_park_entity import CityPark
from map.domain.value_objects.pet_place_vo import Coordinate


class CityParkMapper:
    """3NF ORM(CityParkOrm) ↔ CityPark 엔티티."""

    @staticmethod
    def to_entity(row: CityParkOrm) -> CityPark:
        return CityPark(
            id=row.id,
            name=row.name,
            coordinate=Coordinate(row.latitude, row.longitude),
            park_type=row.park_type or "공원",
            address=row.road_address or row.jibun_address,
            phone=row.phone,
        )
