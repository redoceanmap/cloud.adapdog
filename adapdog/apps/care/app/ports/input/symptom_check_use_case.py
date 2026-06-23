from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Optional

from care.app.dtos.symptom_check_dto import SymptomCheckDto


class SymptomCheckUseCase(ABC):
    """응급 증상 체크 조회 입력 포트 (참고용·진단 아님)."""

    @abstractmethod
    async def list_checks(self, pet_id: Optional[int] = None) -> list[SymptomCheckDto]:
        """반려동물(선택)로 증상 체크 기록을 조회한다. pet_id가 없으면 전체."""
        ...
