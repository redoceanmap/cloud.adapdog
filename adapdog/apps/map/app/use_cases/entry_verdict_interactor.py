from __future__ import annotations

import logging

from map.adapter.inbound.api.schemas.entry_verdict_schema import EntryVerdictSchema
from map.app.dtos.entry_verdict_dto import EntryVerdictResponse
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
        logger.info("[EntryVerdictInteractor] %s × %s → %s", place.name, pet_size.value, verdict.verdict.value)
        return EntryVerdictResponse(
            place_name=verdict.place_name,
            pet_name=verdict.pet_name,
            verdict=verdict.verdict.value,
            conditions=verdict.conditions,
            message=self.message.render(verdict),
        )
