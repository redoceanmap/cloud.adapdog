from __future__ import annotations

import logging

# pet_stamp_orm을 임포트해 Base.metadata에 등록 → create_all_tables가 테이블 생성.
from users.adapter.outbound.orm.pet_stamp_orm import PetStampOrm  # noqa: F401
from users.adapter.outbound.repositories.pet_stamp_repository import MockPetStampRepository
from users.app.ports.input.pet_stamp_use_case import PetStampUseCase
from users.app.ports.output.pet_stamp_port import PetStampPort
from users.app.use_cases.pet_stamp_interactor import PetStampInteractor

logger = logging.getLogger(__name__)


def get_pet_stamp_repository() -> PetStampPort:
    """스탬프 적립 파이프라인 미연동 단계 → mock repository."""
    logger.info("[provider] pet_stamp: mock 데이터 사용")
    return MockPetStampRepository()


def get_pet_stamp_use_case() -> PetStampUseCase:
    return PetStampInteractor(repository=get_pet_stamp_repository())
