from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class PetStamp:
    """수집 스탬프(E4) — 반려동물이 스탬프 스팟에서 모은 한 항목.

    pet_id+stamp_spot_id로 식별. spot_name은 표시용 비정규 항목(현재는 mock).
    """

    pet_id: int
    stamp_spot_id: int
    spot_name: str
    collected_at: str
