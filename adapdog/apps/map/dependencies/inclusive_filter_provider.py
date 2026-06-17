from __future__ import annotations

from fastapi import Depends

from core.config import DATABASE_URL
from map.adapter.outbound.repositories.inclusive_filter_repository import (
    DbBarrierFreePlaceRepository,
    MockBarrierFreePlaceRepository,
)
from map.app.ports.input.inclusive_filter_use_case import InclusiveFilterUseCase
from map.app.ports.input.pet_place_use_case import PetPlaceUseCase
from map.app.ports.output.inclusive_filter_port import BarrierFreePlacePort
from map.app.use_cases.inclusive_filter_interactor import InclusiveFilterInteractor
from map.dependencies.pet_place_provider import get_pet_place_use_case


def get_barrier_free_port() -> BarrierFreePlacePort:
    if DATABASE_URL:
        return DbBarrierFreePlaceRepository()
    return MockBarrierFreePlaceRepository()


def get_inclusive_filter_use_case(
    pet_place: PetPlaceUseCase = Depends(get_pet_place_use_case),
    barrier_free: BarrierFreePlacePort = Depends(get_barrier_free_port),
) -> InclusiveFilterUseCase:
    return InclusiveFilterInteractor(pet_place=pet_place, barrier_free=barrier_free)
