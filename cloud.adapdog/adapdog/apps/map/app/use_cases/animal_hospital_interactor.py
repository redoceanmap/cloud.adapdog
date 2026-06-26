from __future__ import annotations

import logging

from core.introduction import Introduction
from map.adapter.inbound.api.schemas.animal_hospital_schema import AnimalHospitalSchema
from map.app.dtos.animal_hospital_dto import AnimalHospitalDto, AnimalHospitalListResponse
from map.app.ports.input.animal_hospital_use_case import AnimalHospitalUseCase
from map.app.ports.output.animal_hospital_port import AnimalHospitalPort
from map.domain.entities.animal_hospital_entity import AnimalHospital
from map.domain.value_objects.pet_place_vo import Coordinate

logger = logging.getLogger(__name__)


class AnimalHospitalInteractor(AnimalHospitalUseCase):
    """응급 동물병원 안내 — 현재 위치 기준 거리순 정렬 + 24시 우선."""

    def __init__(self, hospitals: AnimalHospitalPort) -> None:
        self.hospitals = hospitals

    async def _find_hospitals(
        self,
        region: str | None,
        open_only: bool,
        origin: Coordinate | None,
    ) -> list[AnimalHospital]:
        found = await self.hospitals.find(region=region, open_only=open_only)
        if found:
            return found
        if open_only:
            found = await self.hospitals.find(region=region, open_only=False)
        if found:
            return found
        if region and origin is not None:
            found = await self.hospitals.find(region=None, open_only=open_only)
        return found

    async def nearby(self, schema: AnimalHospitalSchema) -> AnimalHospitalListResponse:
        origin = (
            Coordinate(schema.latitude, schema.longitude)
            if schema.latitude is not None and schema.longitude is not None
            else None
        )
        found = await self._find_hospitals(schema.region, schema.open_only, origin)

        def distance(h: AnimalHospital) -> float:
            return origin.distance_km_to(h.coordinate) if origin else 0.0

        # 위치 있으면 정확 거리순(동률 시 24시 우선), 없으면 24시만 앞으로.
        if origin:
            ranked = sorted(found, key=lambda h: (distance(h), not h.is_24h))
        else:
            ranked = sorted(found, key=lambda h: not h.is_24h)

        top = ranked[: schema.limit]
        dtos = [
            AnimalHospitalDto(
                name=h.name,
                latitude=h.coordinate.latitude,
                longitude=h.coordinate.longitude,
                phone=h.phone,
                road_address=h.road_address,
                is_24h=h.is_24h,
                is_open=h.is_open,
                distance_km=round(distance(h), 2) if origin else None,
            )
            for h in top
        ]
        logger.info("[AnimalHospitalInteractor] region=%s total=%d top=%d origin=%s",
                    schema.region, len(found), len(dtos), origin is not None)
        return AnimalHospitalListResponse(region=schema.region or "", total=len(found), hospitals=dtos)

    async def introduce_myself(self) -> Introduction:
        intro = await self.hospitals.introduce_myself()
        intro.trail.append("interactor")
        return intro
