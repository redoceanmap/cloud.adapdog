from __future__ import annotations

from enum import Enum
from typing import Optional


class AccessibilityFeature(str, Enum):
    """무장애(배리어프리) 편의 요소."""

    WHEELCHAIR = "wheelchair"            # 휠체어 접근
    ACCESSIBLE_PARKING = "parking"      # 장애인 전용 주차
    BRAILLE = "braille"                 # 점자 가이드
    ACCESSIBLE_RESTROOM = "restroom"    # 장애인 화장실

    @classmethod
    def from_raw(cls, raw: Optional[str]) -> Optional["AccessibilityFeature"]:
        if not raw:
            return None
        text = raw.strip().lower()
        mapping = {
            "wheelchair": cls.WHEELCHAIR, "휠체어": cls.WHEELCHAIR,
            "parking": cls.ACCESSIBLE_PARKING, "주차": cls.ACCESSIBLE_PARKING,
            "braille": cls.BRAILLE, "점자": cls.BRAILLE,
            "restroom": cls.ACCESSIBLE_RESTROOM, "화장실": cls.ACCESSIBLE_RESTROOM,
        }
        return mapping.get(text)
