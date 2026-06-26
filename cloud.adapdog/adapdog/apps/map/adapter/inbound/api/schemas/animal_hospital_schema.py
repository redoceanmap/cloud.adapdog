from __future__ import annotations

from typing import Optional

from pydantic import BaseModel, Field


class AnimalHospitalSchema(BaseModel):
    """응급 동물병원 안내 요청 — 현재 위치(선택)·지역으로 가까운 병원 조회."""

    region: Optional[str] = Field(None, description="지역 (도로명주소 부분일치, 예: 전주)")
    latitude: Optional[float] = Field(None, description="현재 위치 위도 — 주면 거리순 정렬")
    longitude: Optional[float] = Field(None, description="현재 위치 경도")
    open_only: bool = Field(True, description="영업 중(영업/정상)만")
    limit: int = Field(5, ge=1, le=20, description="반환할 병원 수")

    model_config = {
        "json_schema_extra": {
            "example": {"region": "전주", "latitude": 35.8149, "longitude": 127.153,
                        "open_only": True, "limit": 3}
        }
    }
