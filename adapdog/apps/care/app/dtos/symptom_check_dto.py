from __future__ import annotations

from dataclasses import dataclass, field


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


@dataclass(frozen=True)
class SymptomTriageDto:
    """증상 대화형 안내 응답 DTO (참고용·진단 아님 — is_diagnostic 항상 False)."""

    reply: str
    possible_conditions: list[str] = field(default_factory=list)
    urgency: str = "medium"
    advice: str = ""
    is_diagnostic: bool = False
