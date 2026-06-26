from __future__ import annotations

from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from core.database.base import Base


class AudioGuideOrm(Base):
    """오디오 가이드 (ERD: audio_guide). 시설별 음성 해설. 데이터는 mock 시드."""

    __tablename__ = "audio_guide"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    facility_id: Mapped[int] = mapped_column(Integer, index=True)
    language: Mapped[str] = mapped_column(String)
    script_text: Mapped[str] = mapped_column(String)
    audio_url: Mapped[str] = mapped_column(String)
