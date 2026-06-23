from __future__ import annotations

from typing import Optional

from fastapi import APIRouter, Depends

from users.adapter.inbound.api.schemas.breed_prediction_schema import BreedPredictionResponseSchema
from users.app.ports.input.breed_prediction_use_case import BreedPredictionUseCase
from users.dependencies.breed_prediction_provider import get_breed_prediction_use_case

breed_prediction_router = APIRouter(prefix="/breed-prediction", tags=["breed_prediction"])


@breed_prediction_router.get("")
async def list_predictions(
    pet_id: Optional[int] = None,
    use_case: BreedPredictionUseCase = Depends(get_breed_prediction_use_case),
) -> list[BreedPredictionResponseSchema]:
    """A4 닮은친구 % — 반려동물(선택)로 견종 인식 후보를 조회."""
    predictions = await use_case.list_predictions(pet_id)
    return [BreedPredictionResponseSchema.from_dto(p) for p in predictions]
