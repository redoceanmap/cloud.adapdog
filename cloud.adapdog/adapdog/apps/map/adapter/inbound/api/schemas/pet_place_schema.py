from __future__ import annotations

from pydantic import BaseModel, Field


class PetPlaceSchema(BaseModel):
    """반려동물 동반시설 조회 요청."""

    region: str = Field(..., description="조회 지역 (예: 강릉)")

    model_config = {"json_schema_extra": {"example": {"region": "강릉"}}}


class PetPlaceItemSchema(BaseModel):
    id: int
    name: str
    category: str
    latitude: float
    longitude: float
    allowed_sizes: list[str]
