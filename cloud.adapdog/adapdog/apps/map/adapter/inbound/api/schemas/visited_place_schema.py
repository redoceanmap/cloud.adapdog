from __future__ import annotations

from typing import Optional

from pydantic import BaseModel


class VisitedPlaceSchema(BaseModel):
    """발자국(방문 시설) 응답 — 지도 핀 1개."""

    facility_id: int
    name: str
    category: Optional[str] = None
    latitude: float
    longitude: float
    region: Optional[str] = None
    road_address: Optional[str] = None
    visit_count: int
    first_visited_at: Optional[str] = None

    @classmethod
    def from_entity(cls, v) -> "VisitedPlaceSchema":
        return cls(
            facility_id=v.facility_id,
            name=v.name,
            category=v.category,
            latitude=v.coordinate.latitude,
            longitude=v.coordinate.longitude,
            region=v.region,
            road_address=v.road_address,
            visit_count=v.visit_count,
            first_visited_at=v.first_visited_at.isoformat() if v.first_visited_at else None,
        )
