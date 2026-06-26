from __future__ import annotations

from fastapi import Depends

from map.adapter.outbound.repositories.entry_verdict_repository import RuleBasedVerdictMessage
from map.app.ports.input.entry_verdict_use_case import EntryVerdictUseCase
from map.app.ports.input.pet_place_use_case import PetPlaceUseCase
from map.app.ports.output.entry_verdict_port import VerdictMessagePort
from map.app.use_cases.entry_verdict_interactor import EntryVerdictInteractor
from map.dependencies.pet_place_provider import get_pet_place_use_case


def get_verdict_message_port() -> VerdictMessagePort:
    return RuleBasedVerdictMessage()


def get_entry_verdict_use_case(
    pet_place: PetPlaceUseCase = Depends(get_pet_place_use_case),
    message: VerdictMessagePort = Depends(get_verdict_message_port),
) -> EntryVerdictUseCase:
    return EntryVerdictInteractor(pet_place=pet_place, message=message)
