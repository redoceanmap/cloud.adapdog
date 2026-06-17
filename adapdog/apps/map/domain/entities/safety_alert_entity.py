from __future__ import annotations

from dataclasses import dataclass, field
from typing import Optional

from map.domain.value_objects.safety_alert_vo import BreedTrait, RiskLevel, Weather


@dataclass
class SafetyAlert:
    """견종 체질 × 날씨로 산정한 산책·이동 위험도 + 응급 라우팅 정보."""

    risk_level: RiskLevel
    reasons: list[str] = field(default_factory=list)
    hospital_count: int = 0
    nearest_hospital: Optional[str] = None
    nearest_hospital_km: Optional[float] = None

    @classmethod
    def assess(cls, weather: Weather, traits: frozenset[BreedTrait]) -> "SafetyAlert":
        reasons: list[str] = []
        level = RiskLevel.LOW
        t = weather.temperature_c

        if t >= 31:
            level = RiskLevel.HIGH
            reasons.append(f"폭염({t}°C) — 펫 온열질환 위험")
        elif t >= 27:
            level = RiskLevel.MODERATE
            reasons.append(f"더위({t}°C) 주의 — 한낮 산책 자제")
        elif t <= -3:
            level = RiskLevel.HIGH
            reasons.append(f"한파({t}°C) — 저체온·발바닥 동상 위험")
        elif t <= 3:
            level = RiskLevel.MODERATE
            reasons.append(f"추위({t}°C) 주의")

        if BreedTrait.BRACHYCEPHALIC in traits and t >= 25:
            level = level.escalate()
            reasons.append("단두종 — 고온에 호흡기가 취약해 위험도 상향")

        if not reasons:
            reasons.append("산책하기 좋은 날씨예요.")
        return cls(risk_level=level, reasons=reasons)

    def attach_hospital(self, name: str, count: int, distance_km: Optional[float]) -> None:
        self.nearest_hospital = name
        self.hospital_count = count
        self.nearest_hospital_km = distance_km
