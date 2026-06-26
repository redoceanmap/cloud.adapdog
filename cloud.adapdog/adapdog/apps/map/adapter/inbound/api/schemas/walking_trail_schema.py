from __future__ import annotations

from pydantic import BaseModel

from map.app.dtos.walking_trail_dto import WalkingTrailDto


class WalkingTrailResponseSchema(BaseModel):
    """둘레길 응답 스키마 (adapter 계층 — API 표현)."""

    id: int
    name: str
    region: str
    distance_km: float
    difficulty: str
    duration: str
    description: str
    route_info: str = ""

    @classmethod
    def from_dto(cls, dto: WalkingTrailDto) -> "WalkingTrailResponseSchema":
        return cls(
            id=dto.id,
            name=dto.name,
            region=dto.region,
            distance_km=dto.distance_km,
            difficulty=dto.difficulty,
            duration=dto.duration,
            description=dto.description,
            route_info=dto.route_info,
        )
