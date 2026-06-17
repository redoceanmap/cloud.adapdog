from __future__ import annotations

import logging

from fastapi import Depends

from core.config import KMA_SERVICE_KEY, KMA_WEATHER_ENDPOINT
from map.adapter.outbound.repositories.safety_alert_repository import (
    KmaWeatherRepository,
    MockWeatherRepository,
)
from map.app.ports.input.pet_place_use_case import PetPlaceUseCase
from map.app.ports.input.safety_alert_use_case import SafetyAlertUseCase
from map.app.ports.output.safety_alert_port import WeatherPort
from map.app.use_cases.safety_alert_interactor import SafetyAlertInteractor
from map.dependencies.pet_place_provider import get_pet_place_use_case

logger = logging.getLogger(__name__)


def get_weather_port() -> WeatherPort:
    """키가 있으면 기상청 실 API, 없으면 목."""
    if KMA_SERVICE_KEY:
        logger.info("[provider] weather: 기상청 실 API 사용")
        return KmaWeatherRepository(endpoint=KMA_WEATHER_ENDPOINT, service_key=KMA_SERVICE_KEY)
    logger.info("[provider] weather: 목 데이터 사용")
    return MockWeatherRepository()


def get_safety_alert_use_case(
    pet_place: PetPlaceUseCase = Depends(get_pet_place_use_case),
    weather: WeatherPort = Depends(get_weather_port),
) -> SafetyAlertUseCase:
    return SafetyAlertInteractor(pet_place=pet_place, weather=weather)
