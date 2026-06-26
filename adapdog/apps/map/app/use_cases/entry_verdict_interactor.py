from __future__ import annotations

import logging

from core.introduction import Introduction
from map.adapter.inbound.api.schemas.entry_verdict_schema import EntryVerdictSchema
from map.app.dtos.entry_verdict_dto import EntryAlternativeDto, EntryVerdictResponse
from map.app.ports.input.entry_verdict_use_case import EntryVerdictUseCase
from map.app.ports.input.pet_place_use_case import PetPlaceUseCase
from map.app.ports.output.entry_verdict_port import VerdictMessagePort
from map.domain.entities.entry_verdict_entity import EntryVerdict
from map.domain.value_objects.entry_verdict_vo import VerdictType
from map.domain.value_objects.pet_place_vo import PetSize

logger = logging.getLogger(__name__)


class EntryVerdictInteractor(EntryVerdictUseCase):
    """맞춤 입장 판정 인터랙터 — pet_place 재사용 + 메시지 렌더 포트(DIP)."""

    def __init__(self, pet_place: PetPlaceUseCase, message: VerdictMessagePort) -> None:
        self.pet_place = pet_place
        self.message = message

    async def check(self, schema: EntryVerdictSchema) -> EntryVerdictResponse:
        pet_size = PetSize.from_raw(schema.pet_size)
        places = await self.pet_place.find_places(schema.region)
        place = next((p for p in places if schema.place_name in p.name), None)

        if place is None:
            return EntryVerdictResponse(
                place_name=schema.place_name,
                pet_name=schema.pet_name,
                verdict=VerdictType.DENIED.value,
                conditions=["해당 시설을 찾지 못함"],
                message=f"'{schema.place_name}' 시설 정보를 {schema.region}에서 찾지 못했어요.",
            )

        verdict = EntryVerdict.judge(place, schema.pet_name, pet_size)
        # 입장 불가 시: 같은 지역에서 이 견을 받아주는 인근 시설을 거리순 대안으로 제시(시나리오 2).
        alternatives: list[EntryAlternativeDto] = []
        if verdict.verdict == VerdictType.DENIED:
            cands = [
                p for p in places
                if p.name != place.name and p.accommodates(pet_size) and not p.is_vet_hospital()
            ]
            cands.sort(key=lambda p: (
                p.category != place.category,  # 같은 업종 우선
                place.coordinate.distance_km_to(p.coordinate),
            ))
            alternatives = [
                EntryAlternativeDto(
                    name=p.name, category=p.category,
                    latitude=p.coordinate.latitude, longitude=p.coordinate.longitude,
                    distance_km=round(place.coordinate.distance_km_to(p.coordinate), 2),
                )
                for p in cands[:3]
            ]
        logger.info("[EntryVerdictInteractor] %s × %s → %s (대안 %d)",
                    place.name, pet_size.value, verdict.verdict.value, len(alternatives))
        return EntryVerdictResponse(
            place_name=verdict.place_name,
            pet_name=verdict.pet_name,
            verdict=verdict.verdict.value,
            conditions=verdict.conditions,
            message=self.message.render(verdict),
            alternatives=alternatives,
        )

    async def introduce_myself(self) -> Introduction:
        intro = await self.message.introduce_myself()
        intro.trail.append("interactor")
        return intro
