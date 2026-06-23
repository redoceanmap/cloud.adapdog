from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class BreedPredictionDto:
    """견종 인식 후보 응답 항목 (use case 경계 밖으로 나가는 DTO)."""

    id: int
    pet_id: int
    candidate_breed: str
    similarity: float
    rank: int
