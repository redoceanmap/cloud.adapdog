from __future__ import annotations

from dataclasses import dataclass

from map.domain.value_objects.pet_place_vo import Coordinate, PetSize


@dataclass
class PetFriendlyPlace:
    """반려동물 동반 가능 시설(도메인 노드).

    원천: 한국문화정보원 '전국 반려동물 동반가능 문화시설 위치' 데이터.
    동반 가능 여부 판정 등 도메인 규칙은 이 엔티티 내부에서만 처리한다.
    """

    id: int
    name: str
    coordinate: Coordinate
    category: str                       # 시설 유형 (카페, 미술관, 동물병원 등)
    allowed_sizes: frozenset[PetSize]   # 동반 허용 크기 집합 (3NF: facility_allowed_pet_size 동형)
    restriction: str = ""               # 반려동물 제한사항 (예: '이동장 필요', '목줄 착용 필수')

    def has_restriction(self) -> bool:
        return bool(self.restriction) and self.restriction.strip() not in ("제한사항 없음", "해당없음")

    def accommodates(self, size: PetSize) -> bool:
        """우리 아이(size)가 이 시설에 들어갈 수 있는가."""
        if size == PetSize.UNKNOWN:
            return True
        return size in self.allowed_sizes

    def is_animal_hospital(self) -> bool:
        """동선 후보 제외용 — 동물병원/약국 등 비여가 시설 여부."""
        return any(k in self.category for k in ("동물병원", "동물약국", "병원"))

    def is_vet_hospital(self) -> bool:
        """응급 안내용 — 실제 동물병원만(동물약국 제외)."""
        return "동물병원" in self.category

    def __eq__(self, other: object) -> bool:
        if not isinstance(other, PetFriendlyPlace):
            return NotImplemented
        return self.id == other.id

    def __hash__(self) -> int:
        return hash(self.id)
