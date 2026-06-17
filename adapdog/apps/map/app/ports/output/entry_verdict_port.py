from __future__ import annotations

from abc import ABC, abstractmethod

from map.domain.entities.entry_verdict_entity import EntryVerdict


class VerdictMessagePort(ABC):
    """판정 결과를 사람이 읽을 자연어 메시지로 렌더링하는 출력 포트.

    구현체(규칙기반 / 추후 LLM)는 repository에 둔다. 판정 로직 자체는 도메인이 결정.
    """

    @abstractmethod
    def render(self, verdict: EntryVerdict) -> str:
        """판정 엔티티 → 안내 메시지."""
        ...
