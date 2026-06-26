from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Optional

from users.app.dtos.breed_prediction_dto import BreedPredictionDto


class BreedPredictionUseCase(ABC):
    """견종 인식 후보 조회 입력 포트."""

    @abstractmethod
    async def list_predictions(self, pet_id: Optional[int] = None) -> list[BreedPredictionDto]:
        """반려동물(선택)로 견종 인식 후보를 조회한다. pet_id가 없으면 전체."""
        ...
