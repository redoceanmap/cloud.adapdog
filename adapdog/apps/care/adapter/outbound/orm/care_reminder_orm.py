from __future__ import annotations

from sqlalchemy import Boolean, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from core.database.base import Base


class CareReminderOrm(Base):
    """케어 알림 (ERD: care_reminder).

    pet_id는 users 앱(pet)을 가리키는 cross-context 참조다. pet_activity.facility_id
    패턴을 따라 FK를 걸지 않고 Integer + index만 둔다. 데이터는 mock 시드.
    label은 도메인 표시용으로 ORM에는 두지 않는다.
    """

    __tablename__ = "care_reminder"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    pet_id: Mapped[int] = mapped_column(Integer, index=True)
    type: Mapped[str] = mapped_column(String)
    interval_min: Mapped[int] = mapped_column(Integer)
    scheduled_time: Mapped[str] = mapped_column(String)
    enabled: Mapped[bool] = mapped_column(Boolean, default=True)
