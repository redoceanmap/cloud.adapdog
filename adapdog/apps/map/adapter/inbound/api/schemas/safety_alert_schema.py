from __future__ import annotations

from typing import Optional

from pydantic import BaseModel, Field


class SafetyAlertSchema(BaseModel):
    """안전·위험 알리미 요청."""

    region: str = Field(..., description="지역 (예: 강릉)")
    pet_breed: Optional[str] = Field(None, description="견종 (예: 프렌치불독)")
    pet_size: str = Field("medium", description="반려견 크기 (small/medium/large)")
    latitude: Optional[float] = Field(None, description="현재 위치 위도 (선택) — 주면 최근접 동물병원 계산")
    longitude: Optional[float] = Field(None, description="현재 위치 경도 (선택)")

    model_config = {
        "json_schema_extra": {
            "example": {"region": "강릉", "pet_breed": "프렌치불독", "pet_size": "small",
                        "latitude": 37.7519, "longitude": 128.8761}
        }
    }
