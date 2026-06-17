from __future__ import annotations

from abc import ABC, abstractmethod
from typing import TYPE_CHECKING

from map.app.dtos.inclusive_filter_dto import InclusiveFilterResponse

if TYPE_CHECKING:
    from map.adapter.inbound.api.schemas.inclusive_filter_schema import InclusiveFilterSchema


class InclusiveFilterUseCase(ABC):
    """포용형 교차필터 입력 포트 — 펫 동반 ∩ 무장애 시설."""

    @abstractmethod
    async def find_inclusive(self, schema: "InclusiveFilterSchema") -> InclusiveFilterResponse:
        """반려견 동반 가능하면서 무장애 접근도 되는 시설을 찾는다."""
        ...
