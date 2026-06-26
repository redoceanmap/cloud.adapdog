from __future__ import annotations

import asyncio
import logging
from functools import lru_cache

from core.config import ANIMAL_HOSPITAL_CSV_PATH, DATABASE_URL
from core.introduction import Introduction
from map.adapter.outbound.repositories.animal_hospital_repository import (
    CsvAnimalHospitalRepository,
    DbAnimalHospitalRepository,
)
from map.app.ports.input.animal_hospital_use_case import AnimalHospitalUseCase
from map.app.ports.output.animal_hospital_port import AnimalHospitalPort
from map.app.use_cases.animal_hospital_interactor import AnimalHospitalInteractor
from map.domain.entities.animal_hospital_entity import AnimalHospital

logger = logging.getLogger(__name__)

_DB_FIND_TIMEOUT_SEC = 8.0


class FallbackAnimalHospitalRepository(AnimalHospitalPort):
    """DB 우선 조회, 비어 있거나 실패하면 행안부 CSV로 폴백."""

    def __init__(self) -> None:
        self._csv = CsvAnimalHospitalRepository(csv_path=ANIMAL_HOSPITAL_CSV_PATH)
        self._db = DbAnimalHospitalRepository() if DATABASE_URL else None

    async def find(self, region: str | None, open_only: bool) -> list[AnimalHospital]:
        if self._db is not None:
            try:
                rows = await asyncio.wait_for(
                    self._db.find(region=region, open_only=open_only),
                    timeout=_DB_FIND_TIMEOUT_SEC,
                )
                if rows:
                    return rows
                logger.info("[FallbackAnimalHospitalRepository] DB 결과 없음 → CSV")
            except Exception as exc:
                logger.warning(
                    "[FallbackAnimalHospitalRepository] DB 조회 실패 → CSV | %s",
                    exc,
                )
        return await self._csv.find(region=region, open_only=open_only)

    async def introduce_myself(self) -> Introduction:
        if self._db is not None:
            try:
                intro = await asyncio.wait_for(self._db.introduce_myself(), timeout=3.0)
                intro.message += " (CSV 폴백 대기)"
                return intro
            except Exception:
                pass
        return await self._csv.introduce_myself()


@lru_cache(maxsize=1)
def get_animal_hospital_repository() -> AnimalHospitalPort:
    """DB + CSV 폴백. CSV는 내부 캐시라 싱글톤."""
    logger.info("[provider] animal_hospital: DB+CSV 폴백 사용")
    return FallbackAnimalHospitalRepository()


def get_animal_hospital_use_case() -> AnimalHospitalUseCase:
    return AnimalHospitalInteractor(hospitals=get_animal_hospital_repository())
