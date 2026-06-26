from __future__ import annotations

from sqlalchemy import Boolean, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from core.database.base import Base


class SymptomCheckOrm(Base):
    """응급 증상 체크 (ERD: symptom_check). 참고용 기록이며 진단이 아니다.

    pet_id는 users 앱(pet)을 가리키는 cross-context 참조다. pet_activity.facility_id
    패턴을 따라 FK를 걸지 않고 Integer + index만 둔다. is_diagnostic은 항상 False.
    데이터는 mock 시드.
    """

    __tablename__ = "symptom_check"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    pet_id: Mapped[int] = mapped_column(Integer, index=True)
    photo_url: Mapped[str] = mapped_column(String, default="")
    symptom_text: Mapped[str] = mapped_column(String)
    ai_result_text: Mapped[str] = mapped_column(String)
    severity: Mapped[str] = mapped_column(String)
    is_diagnostic: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[str] = mapped_column(String)
