from __future__ import annotations

from sqlalchemy import ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from core.database.base import Base


class ReservationOrm(Base):
    """예약 (ERD: reservation). itinerary 참조. 데이터는 mock 시드.

    place_name은 표시용으로 mock 도메인에만 두고, ERD 테이블에는 두지 않는다.
    """

    __tablename__ = "reservation"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    itinerary_id: Mapped[int] = mapped_column(ForeignKey("itinerary.id"), index=True)
    seq: Mapped[int] = mapped_column(Integer, default=1)
    pet_id: Mapped[int] = mapped_column(Integer, index=True)
    type: Mapped[str] = mapped_column(String)
    party_size: Mapped[int] = mapped_column(Integer, default=1)
    price: Mapped[str] = mapped_column(String, default="")
    status: Mapped[str] = mapped_column(String, default="")
    reserved_at: Mapped[str] = mapped_column(String)
