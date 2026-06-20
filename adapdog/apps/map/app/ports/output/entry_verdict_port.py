from __future__ import annotations

from abc import ABC, abstractmethod

from core.introduction import Introduction
from map.domain.entities.entry_verdict_entity import EntryVerdict


class VerdictMessagePort(ABC):
    """판정 결과를 사람이 읽을 자연어 메시지로 렌더링하는 출력 포트.

    구현체(규칙기반 / 추후 LLM)는 repository에 둔다. 판정 로직 자체는 도메인이 결정.
    """

    @abstractmethod
    def render(self, verdict: EntryVerdict) -> str:
        """판정 엔티티 → 안내 메시지."""
        ...

    async def introduce_myself(self) -> Introduction:
        """연동 검증용 자기소개 — repository 계층에서 출발한다(구현체가 상속)."""
        return Introduction(
            context="map",
            feature="entry_verdict",
            message="맞춤 입장 판정 기능입니다. 연동 정상!",
            trail=["repository"],
        )
