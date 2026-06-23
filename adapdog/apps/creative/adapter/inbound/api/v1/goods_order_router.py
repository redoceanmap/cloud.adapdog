from __future__ import annotations

from typing import Optional

from fastapi import APIRouter, Depends

from creative.adapter.inbound.api.schemas.goods_order_schema import GoodsOrderResponseSchema
from creative.app.ports.input.goods_order_use_case import GoodsOrderUseCase
from creative.dependencies.goods_order_provider import get_goods_order_use_case

goods_order_router = APIRouter(prefix="/goods-order", tags=["goods-order"])


@goods_order_router.get("")
async def list_orders(
    pet_id: Optional[int] = None,
    use_case: GoodsOrderUseCase = Depends(get_goods_order_use_case),
) -> list[GoodsOrderResponseSchema]:
    """F10 굿즈 주문 — 반려동물(선택)로 조회."""
    orders = await use_case.list_orders(pet_id)
    return [GoodsOrderResponseSchema.from_dto(o) for o in orders]
