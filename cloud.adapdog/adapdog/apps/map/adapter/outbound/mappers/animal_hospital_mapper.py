from __future__ import annotations

from map.adapter.outbound.orm.animal_hospital_orm import AnimalHospitalOrm
from map.domain.entities.animal_hospital_entity import AnimalHospital
from map.domain.value_objects.pet_place_vo import Coordinate


class AnimalHospitalMapper:
    """3NF ORM(AnimalHospitalOrm) ↔ AnimalHospital 엔티티."""

    @staticmethod
    def to_entity(row: AnimalHospitalOrm) -> AnimalHospital:
        return AnimalHospital(
            name=row.name,
            coordinate=Coordinate(row.latitude, row.longitude),
            phone=row.phone or "",
            road_address=row.road_address or "",
            is_open=bool(row.is_open),
        )
