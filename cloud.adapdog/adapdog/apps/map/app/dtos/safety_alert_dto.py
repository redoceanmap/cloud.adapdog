from __future__ import annotations

from dataclasses import dataclass
from typing import Optional


@dataclass(frozen=True)
class SafetyAlertResponse:
    region: str
    temperature_c: float
    condition: str
    risk_level: str
    reasons: list[str]
    hospital_count: int            # 지역 내 영업 중 동물병원 수
    nearest_hospital: Optional[str]
    nearest_hospital_km: Optional[float]  # 위경도 미제공 시 None
