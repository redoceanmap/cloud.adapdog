from __future__ import annotations

from sqlalchemy import Boolean, Float, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from core.database.base import Base


class ItineraryOrm(Base):
    """저장된 코스 (ERD: itinerary). 데이터는 mock 시드.

    pet_id(users)·region_id(map)는 컨텍스트 경계를 넘는 논리 참조라 FK를 걸지 않고
    Integer index만 둔다(pet_activity.facility_id 패턴). 무결성은 애플리케이션 계층 보장.
    """

    __tablename__ = "itinerary"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    pet_id: Mapped[int] = mapped_column(Integer, index=True)
    title: Mapped[str] = mapped_column(String)
    region_id: Mapped[int | None] = mapped_column(Integer, index=True, nullable=True)
    prompt_text: Mapped[str] = mapped_column(String, default="")
    is_saved: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[str] = mapped_column(String)


class ItineraryStopOrm(Base):
    """코스 경유지 (ERD: itinerary_stop). itinerary_id+seq 복합 PK."""

    __tablename__ = "itinerary_stop"

    itinerary_id: Mapped[int] = mapped_column(ForeignKey("itinerary.id"), primary_key=True)
    seq: Mapped[int] = mapped_column(Integer, primary_key=True)
    facility_id: Mapped[int | None] = mapped_column(Integer, index=True, nullable=True)
    transport: Mapped[str] = mapped_column(String, default="")
    distance_from_prev_km: Mapped[float] = mapped_column(Float, default=0.0)
    note: Mapped[str] = mapped_column(String, default="")
