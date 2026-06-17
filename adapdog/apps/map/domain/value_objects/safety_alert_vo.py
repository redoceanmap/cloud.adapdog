from __future__ import annotations

from dataclasses import dataclass
from enum import Enum
from typing import Optional


class RiskLevel(str, Enum):
    """반려견 외출 위험도."""

    LOW = "low"
    MODERATE = "moderate"
    HIGH = "high"
    SEVERE = "severe"

    @property
    def rank(self) -> int:
        return {RiskLevel.LOW: 0, RiskLevel.MODERATE: 1, RiskLevel.HIGH: 2, RiskLevel.SEVERE: 3}[self]

    def escalate(self) -> "RiskLevel":
        order = [RiskLevel.LOW, RiskLevel.MODERATE, RiskLevel.HIGH, RiskLevel.SEVERE]
        return order[min(self.rank + 1, 3)]


class BreedTrait(str, Enum):
    """위험도에 영향을 주는 견종 체질."""

    BRACHYCEPHALIC = "brachycephalic"  # 단두종(호흡기 취약)

    @classmethod
    def from_breed(cls, breed: Optional[str]) -> "frozenset[BreedTrait]":
        if not breed:
            return frozenset()
        brachy = ("불독", "불도그", "프렌치", "퍼그", "시츄", "페키니즈", "보스턴")
        traits = set()
        if any(b in breed for b in brachy):
            traits.add(cls.BRACHYCEPHALIC)
        return frozenset(traits)


@dataclass(frozen=True)
class Weather:
    """지역 현재 날씨 VO."""

    temperature_c: float
    condition: str  # 맑음 / 폭염 / 한파 / 비 등
