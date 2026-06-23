from __future__ import annotations

from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from core.database.base import Base


class ReviewOrm(Base):
    """리뷰 (ERD: review). 데이터는 mock 시드.

    facility_name은 도메인/표시용이라 조회 시 facility JOIN으로 채운다(현재는 mock).
    """

    __tablename__ = "review"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    account_id: Mapped[int] = mapped_column(Integer, index=True)
    facility_id: Mapped[int] = mapped_column(Integer, index=True)
    rating: Mapped[int] = mapped_column(Integer, default=0)
    comment: Mapped[str] = mapped_column(String, default="")
    created_at: Mapped[str] = mapped_column(String)
