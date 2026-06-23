from __future__ import annotations

from sqlalchemy import ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from core.database.base import Base


class StampSpotOrm(Base):
    """문화시설 스탬프 대상 (ERD: stamp_spot). facility·region 참조(nullable). 데이터는 mock 시드."""

    __tablename__ = "stamp_spot"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    facility_id: Mapped[int | None] = mapped_column(Integer, index=True, nullable=True)
    region_id: Mapped[int | None] = mapped_column(ForeignKey("region.id"), index=True, nullable=True)
    name: Mapped[str] = mapped_column(String)
    theme: Mapped[str] = mapped_column(String, default="")
