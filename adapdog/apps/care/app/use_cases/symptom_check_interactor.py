from __future__ import annotations

import logging
from typing import Optional

from care.app.dtos.symptom_check_dto import SymptomCheckDto, SymptomTriageDto
from care.app.ports.input.symptom_check_use_case import SymptomCheckUseCase
from care.app.ports.output.symptom_check_port import SymptomCheckPort, SymptomTriageAgentPort

logger = logging.getLogger(__name__)


class SymptomCheckInteractor(SymptomCheckUseCase):
    """증상 체크 인터랙터 — 조회·대화 안내를 포트에 위임(DIP)하고 DTO로 매핑한다.

    가드레일: is_diagnostic은 항상 False로 강제한다(진단 아님).
    """

    def __init__(self, repository: SymptomCheckPort, triage_agent: SymptomTriageAgentPort) -> None:
        self.repository = repository
        self.triage_agent = triage_agent

    async def list_checks(self, pet_id: Optional[int] = None) -> list[SymptomCheckDto]:
        checks = await self.repository.find_checks(pet_id)
        logger.info("[SymptomCheckInteractor] list_checks | pet_id=%s → %d건", pet_id, len(checks))
        return [
            SymptomCheckDto(
                id=c.id, pet_id=c.pet_id, symptom_text=c.symptom_text,
                ai_result_text=c.ai_result_text, severity=c.severity,
                is_diagnostic=False,  # 가드레일: 진단 아님
                created_at=c.created_at,
            )
            for c in checks
        ]

    async def triage(
        self, messages: list[tuple[str, str]], pet_breed: Optional[str], pet_size: Optional[str]
    ) -> SymptomTriageDto:
        result = await self.triage_agent.triage(messages, pet_breed, pet_size)
        logger.info("[SymptomCheckInteractor] triage | turns=%d urgency=%s", len(messages), result.urgency)
        return SymptomTriageDto(
            reply=result.reply,
            possible_conditions=list(result.possible_conditions),
            urgency=result.urgency,
            advice=result.advice,
            is_diagnostic=False,  # 가드레일: 진단 아님
        )
