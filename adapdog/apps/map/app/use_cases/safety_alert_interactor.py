from __future__ import annotations

import logging

from map.adapter.inbound.api.schemas.safety_alert_schema import SafetyAlertSchema
from map.app.dtos.safety_alert_dto import SafetyAlertResponse
from map.app.ports.input.pet_place_use_case import PetPlaceUseCase
from map.app.ports.input.safety_alert_use_case import SafetyAlertUseCase
from map.app.ports.output.safety_alert_port import WeatherPort
from map.domain.entities.safety_alert_entity import SafetyAlert
from map.domain.value_objects.pet_place_vo import Coordinate
from map.domain.value_objects.safety_alert_vo import BreedTrait

logger = logging.getLogger(__name__)


class SafetyAlertInteractor(SafetyAlertUseCase):
    """안전·위험 알리미 인터랙터 — 날씨 포트 + pet_place(동물병원) 재사용(DIP)."""

    def __init__(self, pet_place: PetPlaceUseCase, weather: WeatherPort) -> None:
        self.pet_place = pet_place
        self.weather = weather

    async def assess(self, schema: SafetyAlertSchema) -> SafetyAlertResponse:
        weather = await self.weather.current(schema.region)
        traits = BreedTrait.from_breed(schema.pet_breed)
        alert = SafetyAlert.assess(weather, traits)

        places = await self.pet_place.find_places(schema.region)
        hospitals = [p for p in places if p.is_vet_hospital()]
        if hospitals:
            if schema.latitude is not None and schema.longitude is not None:
                origin = Coordinate(schema.latitude, schema.longitude)
                nearest = min(hospitals, key=lambda h: origin.distance_km_to(h.coordinate))
                alert.attach_hospital(nearest.name, len(hospitals),
                                      round(origin.distance_km_to(nearest.coordinate), 2))
            else:
                # 위치 미제공 → 거리 산정 불가, 지역 대표 1곳 + 개수만 안내
                alert.attach_hospital(hospitals[0].name, len(hospitals), None)

        logger.info("[SafetyAlertInteractor] region=%s temp=%s risk=%s hospitals=%d",
                    schema.region, weather.temperature_c, alert.risk_level.value, alert.hospital_count)
        return SafetyAlertResponse(
            region=schema.region,
            temperature_c=weather.temperature_c,
            condition=weather.condition,
            risk_level=alert.risk_level.value,
            reasons=alert.reasons,
            hospital_count=alert.hospital_count,
            nearest_hospital=alert.nearest_hospital,
            nearest_hospital_km=alert.nearest_hospital_km,
        )
