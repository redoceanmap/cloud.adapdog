from __future__ import annotations

from abc import ABC, abstractmethod

from core.introduction import Introduction
from map.domain.value_objects.policy_card_vo import BadgeType


class PolicyCardParserPort(ABC):
    """규정 텍스트 → 표준 배지 파서 출력 포트.

    구현체(Gemini / 규칙기반 폴백)는 repository에 둔다. 둘 다 같은 계약(LSP).
    """

    @abstractmethod
    async def parse(self, text: str) -> list[BadgeType]:
        """규정 텍스트에서 표준 배지 목록을 추출한다."""
        ...

    async def introduce_myself(self) -> Introduction:
        """연동 검증용 자기소개 — repository 계층에서 출발한다(구현체가 상속)."""
        return Introduction(
            context="map",
            feature="policy_card",
            message="AI 정책 카드(규정 텍스트 → 표준 배지) 기능입니다. 연동 정상!",
            trail=["repository"],
        )
