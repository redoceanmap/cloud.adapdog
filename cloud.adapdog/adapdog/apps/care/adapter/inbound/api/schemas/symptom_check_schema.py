from __future__ import annotations

from pydantic import BaseModel

from care.app.dtos.symptom_check_dto import SymptomCheckDto


class SymptomCheckResponseSchema(BaseModel):
    """증상 체크 응답 스키마 (adapter 계층 — API 표현). DTO와 분리해 계층 경계를 지킨다.

    is_diagnostic은 항상 False (참고용·진단 아님).
    """

    id: int
    pet_id: int
    symptom_text: str
    ai_result_text: str
    severity: str
    is_diagnostic: bool
    created_at: str

    @classmethod
    def from_dto(cls, dto: SymptomCheckDto) -> "SymptomCheckResponseSchema":
        return cls(
            id=dto.id,
            pet_id=dto.pet_id,
            symptom_text=dto.symptom_text,
            ai_result_text=dto.ai_result_text,
            severity=dto.severity,
            is_diagnostic=dto.is_diagnostic,
            created_at=dto.created_at,
        )
