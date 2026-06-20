from __future__ import annotations

from typing import Optional

from pydantic import BaseModel


class RecommendedFacilitySchema(BaseModel):
    """코호트 추천 시설 응답."""

    facility_id: int
    name: str
    category: Optional[str] = None
    latitude: float
    longitude: float
    road_address: Optional[str] = None
    score: int

    @classmethod
    def from_entity(cls, rec) -> "RecommendedFacilitySchema":
        return cls(
            facility_id=rec.facility_id,
            name=rec.name,
            category=rec.category,
            latitude=rec.coordinate.latitude,
            longitude=rec.coordinate.longitude,
            road_address=rec.road_address,
            score=rec.score,
        )
