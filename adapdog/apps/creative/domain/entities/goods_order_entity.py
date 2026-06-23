from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class GoodsOrder:
    """굿즈 주문 — 꾸미기 결과로 제작하는 실물 굿즈 주문(F10).

    decoration_id로 꾸미기 결과를 참조, pet 종속. 데이터는 mock 시드(결제 미연동).
    """

    id: int
    decoration_id: int
    pet_id: int
    product_type: str
    status: str
    ordered_at: str  # ISO yyyy-mm-dd
