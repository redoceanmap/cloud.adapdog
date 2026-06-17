from __future__ import annotations

from abc import ABC, abstractmethod

from map.domain.entities.inclusive_filter_entity import BarrierFreePlace


class BarrierFreePlacePort(ABC):
    """무장애(배리어프리) 시설 조회 출력 포트.

    구현체(목/배리어프리 API/DB)는 repository에 둔다. 인터랙터는 이 추상에만 의존.
    """

    @abstractmethod
    async def find_barrier_free(self, region: str) -> list[BarrierFreePlace]:
        """지역명으로 무장애 시설 목록을 조회한다."""
        ...
