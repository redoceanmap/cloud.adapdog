from __future__ import annotations

from enum import Enum
from typing import Optional


class BadgeType(str, Enum):
    """시설 입장 규정을 표준화한 배지(픽토그램) 종류."""

    CARRIER_REQUIRED = "carrier_required"  # 이동장 필수
    SMALL_ONLY = "small_only"              # 소형견만
    INDOOR_OK = "indoor_ok"                # 실내 가능
    OUTDOOR_ONLY = "outdoor_only"          # 실외만
    LEASH_REQUIRED = "leash_required"      # 목줄 필수
    MUZZLE_REQUIRED = "muzzle_required"    # 입마개 필수
    WASTE_BAG = "waste_bag"                # 배변봉투 지참
    EXTRA_FEE = "extra_fee"                # 추가 요금

    @property
    def label(self) -> str:
        return {
            BadgeType.CARRIER_REQUIRED: "이동장 필수",
            BadgeType.SMALL_ONLY: "소형견만",
            BadgeType.INDOOR_OK: "실내 가능",
            BadgeType.OUTDOOR_ONLY: "실외만",
            BadgeType.LEASH_REQUIRED: "목줄 필수",
            BadgeType.MUZZLE_REQUIRED: "입마개 필수",
            BadgeType.WASTE_BAG: "배변봉투 지참",
            BadgeType.EXTRA_FEE: "추가 요금",
        }[self]

    @classmethod
    def from_code(cls, code: Optional[str]) -> Optional["BadgeType"]:
        if not code:
            return None
        try:
            return cls(code.strip().lower())
        except ValueError:
            return None
