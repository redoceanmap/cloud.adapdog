from __future__ import annotations

import logging

from core.introduction import Introduction
from map.adapter.inbound.api.schemas.inclusive_filter_schema import InclusiveFilterSchema
from map.app.dtos.inclusive_filter_dto import InclusiveFilterResponse, InclusivePlaceItem
from map.app.ports.input.inclusive_filter_use_case import InclusiveFilterUseCase
from map.app.ports.input.pet_place_use_case import PetPlaceUseCase
from map.app.ports.output.inclusive_filter_port import BarrierFreePlacePort
from map.domain.value_objects.inclusive_filter_vo import AccessibilityFeature
from map.domain.value_objects.pet_place_vo import PetSize

logger = logging.getLogger(__name__)


class InclusiveFilterInteractor(InclusiveFilterUseCase):
    """포용형 교차필터 인터랙터.

    펫 동반시설(pet_place use case 재사용) ∩ 무장애시설(BarrierFreePlacePort)을
    근접 매칭으로 교차한다. 두 출력 포트에만 의존(DIP).
    """

    def __init__(self, pet_place: PetPlaceUseCase, barrier_free: BarrierFreePlacePort) -> None:
        self.pet_place = pet_place
        self.barrier_free = barrier_free

    async def find_inclusive(self, schema: InclusiveFilterSchema) -> InclusiveFilterResponse:
        pet_size = PetSize.from_raw(schema.pet_size)
        required = frozenset(
            f for f in (AccessibilityFeature.from_raw(r) for r in schema.required_features) if f is not None
        )

        pet_places = [p for p in await self.pet_place.find_places(schema.region) if p.accommodates(pet_size)]
        bf_places = await self.barrier_free.find_barrier_free(schema.region)

        items: list[InclusivePlaceItem] = []
        for pet in pet_places:
            match = next(
                (bf for bf in bf_places if bf.is_near(pet.coordinate) and bf.satisfies(required)),
                None,
            )
            if match is None:
                continue
            items.append(InclusivePlaceItem(
                name=pet.name,
                category=pet.category,
                latitude=pet.coordinate.latitude,
                longitude=pet.coordinate.longitude,
                accessibility=sorted(f.value for f in match.features),
            ))

        logger.info("[InclusiveFilterInteractor] region=%s pet=%d bf=%d inclusive=%d",
                    schema.region, len(pet_places), len(bf_places), len(items))
        return InclusiveFilterResponse(
            region=schema.region,
            pet_size=pet_size.value,
            count=len(items),
            places=items,
        )

    async def introduce_myself(self) -> Introduction:
        intro = await self.barrier_free.introduce_myself()
        intro.trail.append("interactor")
        return intro
