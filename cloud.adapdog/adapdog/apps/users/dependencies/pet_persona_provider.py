from __future__ import annotations

import logging

# pet_persona_orm을 임포트해 Base.metadata에 등록 → create_all_tables가 테이블 생성.
from users.adapter.outbound.orm.pet_persona_orm import PetPersonaOrm  # noqa: F401
from users.adapter.outbound.repositories.pet_persona_repository import MockPetPersonaRepository
from users.app.ports.input.pet_persona_use_case import PetPersonaUseCase
from users.app.ports.output.pet_persona_port import PetPersonaPort
from users.app.use_cases.pet_persona_interactor import PetPersonaInteractor

logger = logging.getLogger(__name__)


def get_pet_persona_repository() -> PetPersonaPort:
    """페르소나 생성 파이프라인 미연동 단계 → mock repository."""
    logger.info("[provider] pet_persona: mock 데이터 사용")
    return MockPetPersonaRepository()


def get_pet_persona_use_case() -> PetPersonaUseCase:
    return PetPersonaInteractor(repository=get_pet_persona_repository())
