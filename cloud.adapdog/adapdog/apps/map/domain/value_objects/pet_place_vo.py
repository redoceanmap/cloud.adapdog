from __future__ import annotations

import math
import re
from dataclasses import dataclass
from enum import Enum
from typing import Optional


class PetSize(str, Enum):
    """반려견 크기 등급. 시설의 동반 가능 기준과 매칭하는 데 쓰인다."""

    SMALL = "small"    # 소형견
    MEDIUM = "medium"  # 중형견
    LARGE = "large"    # 대형견
    UNKNOWN = "unknown"

    @classmethod
    def from_raw(cls, raw: Optional[str]) -> "PetSize":
        if raw is None:
            return cls.UNKNOWN
        mapping = {
            "small": cls.SMALL, "소형": cls.SMALL, "소형견": cls.SMALL,
            "medium": cls.MEDIUM, "중형": cls.MEDIUM, "중형견": cls.MEDIUM,
            "large": cls.LARGE, "대형": cls.LARGE, "대형견": cls.LARGE,
        }
        return mapping.get(raw.strip().lower(), cls.UNKNOWN)

    @property
    def rank(self) -> int:
        """크기 서열 (UNKNOWN은 가장 작게 취급)."""
        return {PetSize.UNKNOWN: 0, PetSize.SMALL: 1, PetSize.MEDIUM: 2, PetSize.LARGE: 3}[self]

    @classmethod
    def all_sizes(cls) -> "frozenset[PetSize]":
        return frozenset((cls.SMALL, cls.MEDIUM, cls.LARGE))

    @classmethod
    def up_to(cls, largest: "PetSize") -> "frozenset[PetSize]":
        """largest 이하 크기 집합 (예: LARGE → {소형,중형,대형})."""
        return frozenset(s for s in (cls.SMALL, cls.MEDIUM, cls.LARGE) if 1 <= s.rank <= largest.rank)

    @classmethod
    def parse_allowed(cls, raw: Optional[str]) -> "frozenset[PetSize]":
        """'입장 가능 동물 크기' 원천값 → 허용 크기 집합.

        '모든/제한없음/전체/무관' 또는 빈 값은 전체 허용으로 본다(동반 가능 시설 데이터 특성).
        '소형'·'중형'·'대형' 키워드와 무게 임계(kg)를 함께 해석해 비연속 조합도 표현한다.
        """
        if not raw or not raw.strip():
            return cls.all_sizes()
        text = raw.strip().lower()
        if any(k in text for k in ("모든", "모두", "제한없", "제한 없", "전체", "무관", "상관없", "all")):
            return cls.all_sizes()
        found = set()
        if "소형" in text or "small" in text:
            found.add(cls.SMALL)
        if "중형" in text or "medium" in text:
            found.add(cls.MEDIUM)
        if "대형" in text or "large" in text:
            found.add(cls.LARGE)
        if not found:
            found |= _sizes_from_weight(text)
        return frozenset(found) if found else cls.all_sizes()


def _sizes_from_weight(text: str) -> set[PetSize]:
    """'10kg 이하' 같은 무게 임계를 크기 집합으로 매핑 (소형<10, 중형<25)."""
    m = re.search(r"(\d+)\s*kg", text)
    if not m:
        return set()
    kg = int(m.group(1))
    if kg <= 10:
        return {PetSize.SMALL}
    if kg <= 25:
        return {PetSize.SMALL, PetSize.MEDIUM}
    return {PetSize.SMALL, PetSize.MEDIUM, PetSize.LARGE}


@dataclass(frozen=True)
class Coordinate:
    """위경도 좌표 VO. 동선의 노드 위치이자 거리 계산의 기준."""

    latitude: float
    longitude: float

    def __post_init__(self) -> None:
        if not (-90.0 <= self.latitude <= 90.0):
            raise ValueError(f"위도 범위 초과: {self.latitude}")
        if not (-180.0 <= self.longitude <= 180.0):
            raise ValueError(f"경도 범위 초과: {self.longitude}")

    def distance_km_to(self, other: "Coordinate") -> float:
        """하버사인 거리(km)."""
        radius = 6371.0
        d_lat = math.radians(other.latitude - self.latitude)
        d_lng = math.radians(other.longitude - self.longitude)
        a = (
            math.sin(d_lat / 2) ** 2
            + math.cos(math.radians(self.latitude))
            * math.cos(math.radians(other.latitude))
            * math.sin(d_lng / 2) ** 2
        )
        return radius * 2 * math.asin(math.sqrt(a))
