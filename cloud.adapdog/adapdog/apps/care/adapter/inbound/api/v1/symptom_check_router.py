from __future__ import annotations

from typing import Optional

from fastapi import APIRouter, Depends

from care.adapter.inbound.api.schemas.symptom_check_schema import (
    SymptomCheckResponseSchema,
    SymptomTriageRequestSchema,
    SymptomTriageResponseSchema,
)
from care.app.ports.input.symptom_check_use_case import SymptomCheckUseCase
from care.dependencies.symptom_check_provider import get_symptom_check_use_case

symptom_check_router = APIRouter(prefix="/symptom-check", tags=["symptom-check"])


@symptom_check_router.get("")
async def list_checks(
    pet_id: Optional[int] = None,
    use_case: SymptomCheckUseCase = Depends(get_symptom_check_use_case),
) -> list[SymptomCheckResponseSchema]:
    """D6~D9 응급 증상 체크 — 반려동물(선택)로 조회. 참고용이며 진단이 아니다."""
    checks = await use_case.list_checks(pet_id)
    return [SymptomCheckResponseSchema.from_dto(c) for c in checks]


@symptom_check_router.post("/triage")
async def triage(
    req: SymptomTriageRequestSchema,
    use_case: SymptomCheckUseCase = Depends(get_symptom_check_use_case),
) -> SymptomTriageResponseSchema:
    """증상 대화형 안내 — 보호자가 말한 증상에 AI가 짐작 원인·주의사항을 안내(참고용·진단 아님)."""
    messages = [(m.role, m.content) for m in req.messages]
    result = await use_case.triage(messages, req.pet_breed, req.pet_size)
    return SymptomTriageResponseSchema.from_dto(result)
