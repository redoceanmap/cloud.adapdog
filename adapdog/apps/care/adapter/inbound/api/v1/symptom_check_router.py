from __future__ import annotations

from typing import Optional

from fastapi import APIRouter, Depends

from care.adapter.inbound.api.schemas.symptom_check_schema import SymptomCheckResponseSchema
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
