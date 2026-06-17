from __future__ import annotations

from dataclasses import dataclass, field

from map.domain.entities.pet_place_entity import PetFriendlyPlace
from map.domain.value_objects.entry_verdict_vo import VerdictType
from map.domain.value_objects.pet_place_vo import PetSize


@dataclass
class EntryVerdict:
    """반려견 프로필 × 시설 → 개인화된 입장 판정.

    판정 규칙은 이 엔티티의 팩토리(judge)에서만 결정한다.
    """

    place_name: str
    pet_name: str
    pet_size: PetSize
    verdict: VerdictType
    conditions: list[str] = field(default_factory=list)

    @classmethod
    def judge(cls, place: PetFriendlyPlace, pet_name: str, pet_size: PetSize) -> "EntryVerdict":
        if not place.accommodates(pet_size):
            return cls(place.name, pet_name, pet_size, VerdictType.DENIED,
                       [f"{pet_size.value} 크기는 입장 불가"])
        conditions: list[str] = []
        if place.has_restriction():
            conditions.append(place.restriction)
        verdict = VerdictType.CONDITIONAL if conditions else VerdictType.ALLOWED
        return cls(place.name, pet_name, pet_size, verdict, conditions)
