from __future__ import annotations

from typing import Optional

from creative.app.ports.output.goods_order_port import GoodsOrderPort
from creative.domain.entities.goods_order_entity import GoodsOrder


class MockGoodsOrderRepository(GoodsOrderPort):
    """데이터 없는 단계의 mock 굿즈 주문 — 체리 데모 시나리오용.

    결제·제작 연동 전까지 사용. DB 시드로 전환 시 DbGoodsOrderRepository로
    교체하면 도메인/인터랙터는 무수정(OCP). pet_id=1은 체리.
    """

    _DATA = (
        GoodsOrder(1, 2, 1, "figure", "제작중", "2026-06-22"),
    )

    async def find_orders(self, pet_id: Optional[int]) -> list[GoodsOrder]:
        if pet_id is not None:
            return [o for o in self._DATA if o.pet_id == pet_id]
        return list(self._DATA)
