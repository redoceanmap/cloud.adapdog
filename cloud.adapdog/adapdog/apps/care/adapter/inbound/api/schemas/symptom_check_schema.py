from __future__ import annotations

from typing import Optional

from pydantic import BaseModel, Field

from care.app.dtos.symptom_check_dto import SymptomCheckDto, SymptomTriageDto


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


class TriageMessageSchema(BaseModel):
    """증상 대화 한 턴(role: user|ai, content)."""

    role: str = Field(..., description="user 또는 ai")
    content: str


class SymptomTriageRequestSchema(BaseModel):
    """증상 대화 요청 — 대화 기록 + 반려동물 프로필(선택)."""

    messages: list[TriageMessageSchema] = Field(..., description="대화 기록(보호자/AI 번갈아)")
    pet_breed: Optional[str] = Field("골든 리트리버", description="견종(선택)")
    pet_size: Optional[str] = Field("large", description="크기(선택)")

    model_config = {
        "json_schema_extra": {
            "example": {
                "messages": [{"role": "user", "content": "아침부터 헥헥거리고 침을 많이 흘려요"}],
                "pet_breed": "골든 리트리버", "pet_size": "large",
            }
        }
    }


class SymptomTriageResponseSchema(BaseModel):
    """증상 대화 응답 — 참고용 안내(진단 아님). is_diagnostic 항상 False."""

    reply: str
    possible_conditions: list[str]
    urgency: str
    advice: str
    is_diagnostic: bool

    @classmethod
    def from_dto(cls, dto: SymptomTriageDto) -> "SymptomTriageResponseSchema":
        return cls(
            reply=dto.reply,
            possible_conditions=list(dto.possible_conditions),
            urgency=dto.urgency,
            advice=dto.advice,
            is_diagnostic=dto.is_diagnostic,
        )
