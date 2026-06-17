from __future__ import annotations

from pydantic import BaseModel, Field


class InclusiveFilterSchema(BaseModel):
    """포용형 교차필터 요청."""

    region: str = Field(..., description="지역 (예: 강릉)")
    pet_size: str = Field("medium", description="반려견 크기 (small/medium/large)")
    required_features: list[str] = Field(
        default_factory=list,
        description="필요 무장애 요소 (wheelchair/parking/braille/restroom)",
    )

    model_config = {
        "json_schema_extra": {
            "example": {"region": "강릉", "pet_size": "small", "required_features": ["wheelchair"]}
        }
    }
