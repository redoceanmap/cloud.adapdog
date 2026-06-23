from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Optional

from users.domain.entities.breed_prediction_entity import BreedPrediction


class BreedPredictionPort(ABC):
    """견종 인식 후보 조회 출력 포트. 구현체(mock/DB)는 repository에 둔다."""

    @abstractmethod
    async def find_predictions(self, pet_id: Optional[int]) -> list[BreedPrediction]:
        """반려동물(선택)로 견종 인식 후보 도메인 엔티티를 조회한다."""
        ...
