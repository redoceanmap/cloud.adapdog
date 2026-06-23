from __future__ import annotations

from pydantic import BaseModel

from creative.app.dtos.goods_order_dto import GoodsOrderDto


class GoodsOrderResponseSchema(BaseModel):
    """굿즈 주문 응답 스키마 (adapter 계층 — API 표현). DTO와 분리해 계층 경계를 지킨다."""

    id: int
    decoration_id: int
    pet_id: int
    product_type: str
    status: str
    ordered_at: str

    @classmethod
    def from_dto(cls, dto: GoodsOrderDto) -> "GoodsOrderResponseSchema":
        return cls(
            id=dto.id,
            decoration_id=dto.decoration_id,
            pet_id=dto.pet_id,
            product_type=dto.product_type,
            status=dto.status,
            ordered_at=dto.ordered_at,
        )
