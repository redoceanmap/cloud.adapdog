from __future__ import annotations

from dataclasses import dataclass, field

from map.domain.value_objects.pet_place_vo import PetSize
from map.domain.value_objects.safety_alert_vo import BreedTrait


@dataclass(frozen=True)
class Cohort:
    """추천 코호트 정의 — 반려동물 특징 묶음(크기 + 체질).

    같은 코호트의 반려동물들이 쌓은 행동(pet_activity)을 시설별로 집계해 추천한다.
    크기/체질 VO는 시설 매칭·안전 알림과 동일 어휘를 공유한다.
    """

    size: PetSize
    traits: frozenset[BreedTrait] = field(default_factory=frozenset)
