from __future__ import annotations

from map.domain.value_objects.pet_place_vo import PetSize
from map.domain.value_objects.safety_alert_vo import BreedTrait
from users.adapter.outbound.orm.breed_catalog_orm import BreedCatalog
from users.domain.entities.breed_catalog_entity import BreedProfile


class BreedCatalogMapper:
    """breed_catalog ORM(+체질 다중값) ↔ BreedProfile 엔티티."""

    @staticmethod
    def to_entity(row: BreedCatalog, traits: set[str]) -> BreedProfile:
        return BreedProfile(
            breed=row.breed,
            size=PetSize(row.size) if row.size in PetSize._value2member_map_ else PetSize.UNKNOWN,
            traits=frozenset(BreedTrait(t) for t in traits if t in BreedTrait._value2member_map_),
            temperament=row.temperament or "",
        )
