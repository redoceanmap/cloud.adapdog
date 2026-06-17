from __future__ import annotations

from pydantic import BaseModel, Field


class EntryVerdictSchema(BaseModel):
    """맞춤 입장 판정 요청."""

    region: str = Field(..., description="지역 (예: 강릉)")
    place_name: str = Field(..., description="시설명(부분 일치, 예: 오죽헌)")
    pet_name: str = Field("우리 강아지", description="반려견 이름 (예: 체리)")
    pet_size: str = Field("small", description="반려견 크기 (small/medium/large)")

    model_config = {
        "json_schema_extra": {
            "example": {"region": "강릉", "place_name": "오죽헌", "pet_name": "체리", "pet_size": "small"}
        }
    }
