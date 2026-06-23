from __future__ import annotations

from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from core.database.base import Base


class FavoriteOrm(Base):
    """즐겨찾기 (ERD: favorite). account_id + facility_id 복합 PK. 데이터는 mock 시드.

    facility_name은 도메인/표시용이라 조회 시 facility JOIN으로 채운다(현재는 mock).
    """

    __tablename__ = "favorite"

    account_id: Mapped[int] = mapped_column(Integer, primary_key=True)
    facility_id: Mapped[int] = mapped_column(Integer, primary_key=True)
    created_at: Mapped[str] = mapped_column(String)
