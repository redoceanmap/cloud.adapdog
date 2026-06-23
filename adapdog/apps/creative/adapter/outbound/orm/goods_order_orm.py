from __future__ import annotations

from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from core.database.base import Base


class GoodsOrderOrm(Base):
    """굿즈 주문 (ERD: goods_order).

    decoration_id는 같은 creative 컨텍스트지만 데모 단계라 FK 없이 Integer index로 둔다.
    pet_id는 cross-context(users)라 FK 없이 Integer로 둔다. 데이터는 mock 시드.
    """

    __tablename__ = "goods_order"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    decoration_id: Mapped[int] = mapped_column(Integer, index=True)
    pet_id: Mapped[int] = mapped_column(Integer)
    product_type: Mapped[str] = mapped_column(String)
    status: Mapped[str] = mapped_column(String)
    ordered_at: Mapped[str] = mapped_column(String)
