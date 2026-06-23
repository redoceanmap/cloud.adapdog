from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class SymptomCheckDto:
    """증상 체크 응답 항목 (use case 경계 밖으로 나가는 DTO)."""

    id: int
    pet_id: int
    symptom_text: str
    ai_result_text: str
    severity: str
    is_diagnostic: bool
    created_at: str
