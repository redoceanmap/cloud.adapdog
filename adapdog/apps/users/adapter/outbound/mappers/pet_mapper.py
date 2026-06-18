from __future__ import annotations

from map.domain.value_objects.pet_place_vo import PetSize
from map.domain.value_objects.safety_alert_vo import BreedTrait
from users.adapter.outbound.orm.pet_orm import PetOrm
from users.domain.entities.pet_entity import Pet
from users.domain.value_objects.pet_vo import Gender


class PetMapper:
    """PetOrm(+체질 다중값) ↔ Pet 엔티티."""

    @staticmethod
    def to_entity(row: PetOrm, traits: set[str]) -> Pet:
        return Pet(
            id=row.id,
            account_id=row.account_id,
            name=row.name,
            breed=row.breed,
            photo_url=row.photo_url,
            size=PetSize(row.size) if row.size in PetSize._value2member_map_ else PetSize.UNKNOWN,
            traits=frozenset(BreedTrait(t) for t in traits if t in BreedTrait._value2member_map_),
            temperament=row.temperament or "",
            birth_year=row.birth_year,
            gender=Gender(row.gender) if row.gender in Gender._value2member_map_ else Gender.UNKNOWN,
            features=row.features,
        )

    @staticmethod
    def to_orm(pet: Pet) -> PetOrm:
        return PetOrm(
            account_id=pet.account_id,
            name=pet.name,
            breed=pet.breed,
            photo_url=pet.photo_url,
            size=pet.size.value,
            temperament=pet.temperament,
            birth_year=pet.birth_year,
            gender=pet.gender.value,
            features=pet.features,
        )
