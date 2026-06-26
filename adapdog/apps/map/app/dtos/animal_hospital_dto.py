from __future__ import annotations

from dataclasses import dataclass
from typing import Optional


@dataclass(frozen=True)
class AnimalHospitalDto:
    name: str
    latitude: float
    longitude: float
    phone: str
    road_address: str
    is_24h: bool
    is_open: bool
    distance_km: Optional[float]  # 현재 위치 미제공 시 None


@dataclass(frozen=True)
class AnimalHospitalListResponse:
    region: str
    total: int                       # 조건에 맞는 전체 병원 수
    hospitals: list[AnimalHospitalDto]  # 거리순 상위 N곳
