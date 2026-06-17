from __future__ import annotations

from typing import Optional

from pydantic import BaseModel, Field


class RoutePlannerSchema(BaseModel):
    """AI 펫 동선 플래너 요청."""

    region: str = Field(..., description="여행 지역 (예: 강릉)")
    days: int = Field(1, ge=1, le=14, description="여행 일수")
    pet_size: str = Field("medium", description="반려견 크기 (small / medium / large)")
    pet_breed: Optional[str] = Field(None, description="견종 (선택)")

    model_config = {
        "json_schema_extra": {
            "example": {
                "region": "강릉",
                "days": 2,
                "pet_size": "small",
                "pet_breed": "말티즈",
            }
        }
    }
