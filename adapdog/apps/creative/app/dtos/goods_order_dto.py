from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class GoodsOrderDto:
    """굿즈 주문 응답 항목 (use case 경계 밖으로 나가는 DTO)."""

    id: int
    decoration_id: int
    pet_id: int
    product_type: str
    status: str
    ordered_at: str
