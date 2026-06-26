from __future__ import annotations

from datetime import datetime, timezone

from sqlalchemy import DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from core.database.base import Base


class PetActivityOrm(Base):
    """반려동물 행동 로그. 코호트 추천의 행동 신호원.

    facility_id는 map 컨텍스트(facility.id)의 논리 참조 — 컨텍스트 독립을 위해
    cross-context FK는 선언하지 않고 인덱스만 둔다.
    """

    __tablename__ = "pet_activity"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    pet_id: Mapped[int] = mapped_column(ForeignKey("pet.id"), index=True)
    facility_id: Mapped[int] = mapped_column(Integer, index=True)
    action_type: Mapped[str] = mapped_column(String)
    occurred_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
