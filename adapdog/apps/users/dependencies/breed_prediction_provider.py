from __future__ import annotations

import logging

# breed_prediction_orm을 임포트해 Base.metadata에 등록 → create_all_tables가 테이블 생성.
from users.adapter.outbound.orm.breed_prediction_orm import BreedPredictionOrm  # noqa: F401
from users.adapter.outbound.repositories.breed_prediction_repository import MockBreedPredictionRepository
from users.app.ports.input.breed_prediction_use_case import BreedPredictionUseCase
from users.app.ports.output.breed_prediction_port import BreedPredictionPort
from users.app.use_cases.breed_prediction_interactor import BreedPredictionInteractor

logger = logging.getLogger(__name__)


def get_breed_prediction_repository() -> BreedPredictionPort:
    """견종 인식 모델 미연동 단계 → mock repository."""
    logger.info("[provider] breed_prediction: mock 데이터 사용")
    return MockBreedPredictionRepository()


def get_breed_prediction_use_case() -> BreedPredictionUseCase:
    return BreedPredictionInteractor(repository=get_breed_prediction_repository())
