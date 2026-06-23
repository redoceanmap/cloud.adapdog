from __future__ import annotations

from sqlalchemy import Float, Integer, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from core.database.base import Base


class YearSummaryOrm(Base):
    """연말 결산 (ERD: year_summary). pet_id + year 유일. 데이터는 mock 시드."""

    __tablename__ = "year_summary"
    __table_args__ = (UniqueConstraint("pet_id", "year", name="uq_year_summary_pet_year"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    pet_id: Mapped[int] = mapped_column(Integer, index=True)
    year: Mapped[int] = mapped_column(Integer)
    total_distance_km: Mapped[float] = mapped_column(Float, default=0.0)
    places_count: Mapped[int] = mapped_column(Integer, default=0)
    story_text: Mapped[str] = mapped_column(String, default="")
    created_at: Mapped[str] = mapped_column(String)
