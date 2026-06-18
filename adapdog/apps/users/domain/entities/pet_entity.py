from __future__ import annotations

from dataclasses import dataclass, field
from typing import Optional

from map.domain.value_objects.pet_place_vo import PetSize
from map.domain.value_objects.safety_alert_vo import BreedTrait
from users.domain.value_objects.pet_vo import Gender


@dataclass
class Pet:
    """반려동물(도메인). 등록의 주체.

    유저는 name·breed·photo_url만 입력하고, size·traits·temperament는 견종
    카탈로그에서 자동으로 채워진다. birth_year·gender·features는 선택 입력.
    크기/체질은 map 컨텍스트 VO를 재사용해 시설 매칭·안전 알림과 어휘를 공유한다.
    """

    id: Optional[int]
    account_id: int
    name: str
    breed: str
    photo_url: str
    size: PetSize                                       # 견종 자동완성
    traits: frozenset[BreedTrait] = field(default_factory=frozenset)  # 견종 자동완성
    temperament: str = ""                               # 견종 자동완성
    birth_year: Optional[int] = None                    # 선택
    gender: Gender = Gender.UNKNOWN                     # 선택
    features: Optional[str] = None                      # 선택 (자유 특징)
