from __future__ import annotations

from abc import ABC, abstractmethod

from map.domain.value_objects.policy_card_vo import BadgeType


class PolicyCardParserPort(ABC):
    """규정 텍스트 → 표준 배지 파서 출력 포트.

    구현체(Gemini / 규칙기반 폴백)는 repository에 둔다. 둘 다 같은 계약(LSP).
    """

    @abstractmethod
    async def parse(self, text: str) -> list[BadgeType]:
        """규정 텍스트에서 표준 배지 목록을 추출한다."""
        ...
