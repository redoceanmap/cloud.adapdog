from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Optional

from care.domain.entities.symptom_check_entity import SymptomCheck


class SymptomCheckPort(ABC):
    """증상 체크 데이터 조회 출력 포트. 구현체(mock/DB)는 repository에 둔다."""

    @abstractmethod
    async def find_checks(self, pet_id: Optional[int]) -> list[SymptomCheck]:
        """반려동물(선택)로 증상 체크 도메인 엔티티를 조회한다."""
        ...
