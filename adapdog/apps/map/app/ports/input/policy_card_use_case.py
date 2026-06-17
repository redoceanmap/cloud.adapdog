from __future__ import annotations

from abc import ABC, abstractmethod
from typing import TYPE_CHECKING

from map.app.dtos.policy_card_dto import PolicyCardResponse

if TYPE_CHECKING:
    from map.adapter.inbound.api.schemas.policy_card_schema import PolicyCardSchema


class PolicyCardUseCase(ABC):
    """AI 정책 카드 입력 포트 — 규정 텍스트를 표준 배지로 변환."""

    @abstractmethod
    async def parse_policy(self, schema: "PolicyCardSchema") -> PolicyCardResponse:
        """시설 규정 텍스트를 표준 배지 카드로 변환한다."""
        ...
