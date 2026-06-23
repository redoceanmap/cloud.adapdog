from __future__ import annotations

from pydantic import BaseModel

from users.app.dtos.breed_prediction_dto import BreedPredictionDto


class BreedPredictionResponseSchema(BaseModel):
    """견종 인식 후보 응답 스키마 (adapter 계층 — API 표현). DTO와 분리해 계층 경계를 지킨다."""

    id: int
    pet_id: int
    candidate_breed: str
    similarity: float
    rank: int

    @classmethod
    def from_dto(cls, dto: BreedPredictionDto) -> "BreedPredictionResponseSchema":
        return cls(
            id=dto.id,
            pet_id=dto.pet_id,
            candidate_breed=dto.candidate_breed,
            similarity=dto.similarity,
            rank=dto.rank,
        )
