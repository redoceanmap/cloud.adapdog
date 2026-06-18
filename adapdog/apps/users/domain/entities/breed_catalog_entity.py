from __future__ import annotations

from dataclasses import dataclass, field

from map.domain.value_objects.pet_place_vo import PetSize
from map.domain.value_objects.safety_alert_vo import BreedTrait


@dataclass(frozen=True)
class BreedProfile:
    """견종 표준정보(도메인). 반려동물 등록 시 자동완성의 원천.

    map 컨텍스트의 PetSize/BreedTrait VO를 재사용해 시설 매칭·안전 알림과
    같은 어휘를 쓴다. 미등록 견종은 unknown()으로 안전한 기본값을 만든다.
    """

    breed: str                          # 정규화된 견종명 (표시용 정식 명칭)
    size: PetSize
    traits: frozenset[BreedTrait] = field(default_factory=frozenset)
    temperament: str = ""               # 기질 설명 (예: '영리하고 활발하다')

    @classmethod
    def unknown(cls, breed: str) -> "BreedProfile":
        """카탈로그에 없는 견종의 기본 프로필.

        크기는 미상으로 두되, 단두종 등 견종명에서 직접 읽히는 체질은 그대로 태깅한다
        (등록 실패가 가입을 막지 않도록).
        """
        return cls(
            breed=breed,
            size=PetSize.UNKNOWN,
            traits=BreedTrait.from_breed(breed),
            temperament="정보 없음",
        )
