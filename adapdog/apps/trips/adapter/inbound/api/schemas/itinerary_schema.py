from __future__ import annotations

from pydantic import BaseModel

from trips.app.dtos.itinerary_dto import ItineraryDto


class ItineraryStopResponseSchema(BaseModel):
    """경유지 응답 스키마."""

    order: int
    name: str
    category: str
    latitude: float
    longitude: float


class ItineraryResponseSchema(BaseModel):
    """저장된 코스 응답 스키마 (adapter 계층 — API 표현). DTO와 분리해 계층 경계를 지킨다."""

    id: int
    pet_id: int
    title: str
    region: str
    prompt_text: str
    is_saved: bool
    created_at: str
    stops: list[ItineraryStopResponseSchema]

    @classmethod
    def from_dto(cls, dto: ItineraryDto) -> "ItineraryResponseSchema":
        return cls(
            id=dto.id,
            pet_id=dto.pet_id,
            title=dto.title,
            region=dto.region,
            prompt_text=dto.prompt_text,
            is_saved=dto.is_saved,
            created_at=dto.created_at,
            stops=[
                ItineraryStopResponseSchema(
                    order=s.order,
                    name=s.name,
                    category=s.category,
                    latitude=s.latitude,
                    longitude=s.longitude,
                )
                for s in dto.stops
            ],
        )
