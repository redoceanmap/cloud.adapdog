from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class BreedPrediction:
    """견종 인식 후보 — 닮은친구(A4) % 한 항목.

    사진 인식 결과 상위 후보를 유사도와 함께 보관(현재는 mock). pet_id로 반려동물과 연결.
    """

    id: int
    pet_id: int
    candidate_breed: str
    similarity: float
    rank: int
