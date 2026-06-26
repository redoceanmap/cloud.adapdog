from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Optional

from care.domain.entities.symptom_check_entity import SymptomCheck
from care.domain.value_objects.symptom_check_vo import SymptomTriage


class SymptomCheckPort(ABC):
    """증상 체크 데이터 조회 출력 포트. 구현체(mock/DB)는 repository에 둔다."""

    @abstractmethod
    async def find_checks(self, pet_id: Optional[int]) -> list[SymptomCheck]:
        """반려동물(선택)로 증상 체크 도메인 엔티티를 조회한다."""
        ...


class SymptomTriageAgentPort(ABC):
    """증상 대화형 안내 출력 포트 — LLM(또는 규칙기반)으로 증상을 듣고 참고 안내를 만든다."""

    @abstractmethod
    async def triage(
        self, messages: list[tuple[str, str]], pet_breed: Optional[str], pet_size: Optional[str]
    ) -> SymptomTriage:
        """대화 기록(role, content)과 반려동물 프로필로 참고용 증상 안내를 생성한다."""
        ...
