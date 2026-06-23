from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Optional

from creative.app.dtos.goods_order_dto import GoodsOrderDto


class GoodsOrderUseCase(ABC):
    """굿즈 주문 조회 입력 포트."""

    @abstractmethod
    async def list_orders(self, pet_id: Optional[int] = None) -> list[GoodsOrderDto]:
        """반려동물(선택)로 굿즈 주문을 조회한다. pet_id가 없으면 전체."""
        ...
