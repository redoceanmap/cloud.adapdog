from __future__ import annotations

import logging

from map.app.ports.output.entry_verdict_port import VerdictMessagePort
from map.domain.entities.entry_verdict_entity import EntryVerdict
from map.domain.value_objects.entry_verdict_vo import VerdictType

logger = logging.getLogger(__name__)


class RuleBasedVerdictMessage(VerdictMessagePort):
    """규칙기반 판정 메시지 렌더러 (추후 LLM 렌더러로 교체 가능, 같은 포트)."""

    def render(self, verdict: EntryVerdict) -> str:
        pet = verdict.pet_name
        place = verdict.place_name
        if verdict.verdict == VerdictType.DENIED:
            return f"{pet}는 {place}에 입장하기 어려워요. ({', '.join(verdict.conditions)})"
        if verdict.verdict == VerdictType.CONDITIONAL:
            return f"{pet}는 {place} 입장이 가능하지만 {', '.join(verdict.conditions)} 조건이 있어요."
        return f"{pet}는 {place}에 자유롭게 입장할 수 있어요!"
