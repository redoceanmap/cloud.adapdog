from __future__ import annotations

from dataclasses import dataclass, field


@dataclass(frozen=True)
class EntryAlternativeDto:
    """입장 불가 시 제시하는 인근 동반 가능 대안 시설."""

    name: str
    category: str
    latitude: float
    longitude: float
    distance_km: float


@dataclass(frozen=True)
class EntryVerdictResponse:
    place_name: str
    pet_name: str
    verdict: str
    conditions: list[str]
    message: str
    alternatives: list[EntryAlternativeDto] = field(default_factory=list)  # 불가 시 인근 대안
