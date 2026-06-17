from __future__ import annotations

from map.adapter.outbound.orm.pet_place_orm import Facility
from map.domain.entities.pet_place_entity import PetFriendlyPlace
from map.domain.value_objects.pet_place_vo import Coordinate, PetSize


class PetPlaceMapper:
    """3NF ORM(Facility + 정책 + 허용크기 + 카테고리명) ↔ PetFriendlyPlace 엔티티."""

    @staticmethod
    def to_entity(
        facility: Facility,
        category_name: str,
        restriction: str,
        sizes: set[str],
    ) -> PetFriendlyPlace:
        allowed = frozenset(PetSize(s) for s in sizes if s in PetSize._value2member_map_)
        return PetFriendlyPlace(
            id=facility.id,
            name=facility.name,
            coordinate=Coordinate(facility.latitude, facility.longitude),
            category=category_name or "기타",
            allowed_sizes=allowed or PetSize.all_sizes(),
            restriction=restriction or "",
        )
