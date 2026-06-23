from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Optional

from creative.domain.entities.goods_order_entity import GoodsOrder


class GoodsOrderPort(ABC):
    """굿즈 주문 데이터 조회 출력 포트. 구현체(mock/DB)는 repository에 둔다."""

    @abstractmethod
    async def find_orders(self, pet_id: Optional[int]) -> list[GoodsOrder]:
        """반려동물(선택)로 굿즈 주문 도메인 엔티티를 조회한다."""
        ...
