from __future__ import annotations

from enum import Enum
from typing import Optional


class Gender(str, Enum):
    """반려동물 성별 (선택 입력)."""

    MALE = "male"
    FEMALE = "female"
    UNKNOWN = "unknown"

    @classmethod
    def from_raw(cls, raw: Optional[str]) -> "Gender":
        if not raw:
            return cls.UNKNOWN
        mapping = {
            "male": cls.MALE, "m": cls.MALE, "수컷": cls.MALE, "남": cls.MALE,
            "female": cls.FEMALE, "f": cls.FEMALE, "암컷": cls.FEMALE, "여": cls.FEMALE,
        }
        return mapping.get(raw.strip().lower(), cls.UNKNOWN)
