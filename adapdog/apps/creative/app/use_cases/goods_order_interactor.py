from __future__ import annotations

import logging
from typing import Optional

from creative.app.dtos.goods_order_dto import GoodsOrderDto
from creative.app.ports.input.goods_order_use_case import GoodsOrderUseCase
from creative.app.ports.output.goods_order_port import GoodsOrderPort

logger = logging.getLogger(__name__)


class GoodsOrderInteractor(GoodsOrderUseCase):
    """굿즈 주문 인터랙터 — 조회를 포트에 위임(DIP)하고 DTO로 매핑한다."""

    def __init__(self, repository: GoodsOrderPort) -> None:
        self.repository = repository

    async def list_orders(self, pet_id: Optional[int] = None) -> list[GoodsOrderDto]:
        orders = await self.repository.find_orders(pet_id)
        logger.info("[GoodsOrderInteractor] list_orders | pet_id=%s → %d건", pet_id, len(orders))
        return [
            GoodsOrderDto(
                id=o.id, decoration_id=o.decoration_id, pet_id=o.pet_id,
                product_type=o.product_type, status=o.status, ordered_at=o.ordered_at,
            )
            for o in orders
        ]
