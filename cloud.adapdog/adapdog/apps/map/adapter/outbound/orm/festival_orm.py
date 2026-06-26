from __future__ import annotations

from sqlalchemy import Boolean, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from core.database.base import Base


class FestivalOrm(Base):
    """축제 (ERD: festival). region 공유 차원 참조(nullable). 데이터는 mock 시드."""

    __tablename__ = "festival"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    region_id: Mapped[int | None] = mapped_column(ForeignKey("region.id"), index=True, nullable=True)
    name: Mapped[str] = mapped_column(String)
    start_date: Mapped[str] = mapped_column(String)
    end_date: Mapped[str] = mapped_column(String)
    pet_allowed: Mapped[bool] = mapped_column(Boolean, default=True)
    source: Mapped[str] = mapped_column(String, default="")
