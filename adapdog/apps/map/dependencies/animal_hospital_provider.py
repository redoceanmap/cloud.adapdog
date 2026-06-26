from __future__ import annotations

import logging
from functools import lru_cache

from core.config import ANIMAL_HOSPITAL_CSV_PATH, DATABASE_URL
from map.adapter.outbound.repositories.animal_hospital_repository import (
    CsvAnimalHospitalRepository,
    DbAnimalHospitalRepository,
)
from map.app.ports.input.animal_hospital_use_case import AnimalHospitalUseCase
from map.app.ports.output.animal_hospital_port import AnimalHospitalPort
from map.app.use_cases.animal_hospital_interactor import AnimalHospitalInteractor

logger = logging.getLogger(__name__)


@lru_cache(maxsize=1)
def get_animal_hospital_repository() -> AnimalHospitalPort:
    """DB 있으면 3NF DB, 없으면 CSV 직접 읽기로 폴백. CSV는 내부 캐시라 싱글톤."""
    if DATABASE_URL:
        logger.info("[provider] animal_hospital: 3NF DB 사용")
        return DbAnimalHospitalRepository()
    logger.info("[provider] animal_hospital: CSV 폴백 사용")
    return CsvAnimalHospitalRepository(csv_path=ANIMAL_HOSPITAL_CSV_PATH)


def get_animal_hospital_use_case() -> AnimalHospitalUseCase:
    return AnimalHospitalInteractor(hospitals=get_animal_hospital_repository())
