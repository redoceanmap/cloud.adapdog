from __future__ import annotations

from abc import ABC, abstractmethod
from typing import TYPE_CHECKING

from core.introduction import Introduction
from map.app.dtos.entry_verdict_dto import EntryVerdictResponse

if TYPE_CHECKING:
    from map.adapter.inbound.api.schemas.entry_verdict_schema import EntryVerdictSchema


class EntryVerdictUseCase(ABC):
    """맞춤 입장 판정 입력 포트."""

    @abstractmethod
    async def check(self, schema: "EntryVerdictSchema") -> EntryVerdictResponse:
        """반려견 프로필과 시설명으로 개인화된 입장 가능 여부를 판정한다."""
        ...

    @abstractmethod
    async def introduce_myself(self) -> Introduction:
        """이 기능의 자기소개(연동 검증)."""
        ...
