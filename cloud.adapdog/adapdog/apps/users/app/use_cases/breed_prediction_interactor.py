from __future__ import annotations

import logging
from typing import Optional

from users.app.dtos.breed_prediction_dto import BreedPredictionDto
from users.app.ports.input.breed_prediction_use_case import BreedPredictionUseCase
from users.app.ports.output.breed_prediction_port import BreedPredictionPort

logger = logging.getLogger(__name__)


class BreedPredictionInteractor(BreedPredictionUseCase):
    """견종 인식 후보 인터랙터 — 조회를 포트에 위임(DIP)하고 DTO로 매핑한다."""

    def __init__(self, repository: BreedPredictionPort) -> None:
        self.repository = repository

    async def list_predictions(self, pet_id: Optional[int] = None) -> list[BreedPredictionDto]:
        predictions = await self.repository.find_predictions(pet_id)
        logger.info("[BreedPredictionInteractor] list_predictions | pet_id=%s → %d건", pet_id, len(predictions))
        return [
            BreedPredictionDto(
                id=p.id,
                pet_id=p.pet_id,
                candidate_breed=p.candidate_breed,
                similarity=p.similarity,
                rank=p.rank,
            )
            for p in predictions
        ]
