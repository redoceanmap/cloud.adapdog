from __future__ import annotations

from typing import Optional

from users.app.ports.output.breed_prediction_port import BreedPredictionPort
from users.domain.entities.breed_prediction_entity import BreedPrediction


class MockBreedPredictionRepository(BreedPredictionPort):
    """데이터 없는 단계의 mock 견종 인식 후보 — 체리 데모 시나리오용.

    사진 인식 모델 연동 전까지 사용. DB 시드로 전환 시
    DbBreedPredictionRepository로 교체하면 도메인/인터랙터는 무수정(OCP).
    """

    _DATA = (
        BreedPrediction(1, 1, "골든 리트리버", 0.96, 1),
        BreedPrediction(2, 1, "래브라도 리트리버", 0.71, 2),
        BreedPrediction(3, 1, "토이푸들", 0.38, 3),
    )

    async def find_predictions(self, pet_id: Optional[int]) -> list[BreedPrediction]:
        if pet_id is not None:
            return [p for p in self._DATA if p.pet_id == pet_id]
        return list(self._DATA)
