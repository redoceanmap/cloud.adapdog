from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class ItineraryStopInput:
    order: int
    name: str
    category: str
    latitude: float
    longitude: float


@dataclass(frozen=True)
class SaveItineraryInput:
    pet_id: int
    title: str
    region: str
    prompt_text: str
    stops: list[ItineraryStopInput]


@dataclass(frozen=True)
class ItineraryStopDto:
    """경유지 DTO (Itinerary DTO에 중첩)."""

    order: int
    name: str
    category: str
    latitude: float
    longitude: float


@dataclass(frozen=True)
class ItineraryDto:
    """저장된 코스 응답 항목 (use case 경계 밖으로 나가는 DTO)."""

    id: int
    pet_id: int
    title: str
    region: str
    prompt_text: str
    is_saved: bool
    created_at: str
    stops: list[ItineraryStopDto]
