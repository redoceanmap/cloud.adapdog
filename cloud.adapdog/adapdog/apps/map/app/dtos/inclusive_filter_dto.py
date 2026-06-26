from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class InclusivePlaceItem:
    """펫 동반 ∩ 무장애 교차 결과 한 건."""

    name: str
    category: str
    latitude: float
    longitude: float
    accessibility: list[str]


@dataclass(frozen=True)
class InclusiveFilterResponse:
    region: str
    pet_size: str
    count: int
    places: list[InclusivePlaceItem]
