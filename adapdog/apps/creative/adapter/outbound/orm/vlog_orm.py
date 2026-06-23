from __future__ import annotations

from sqlalchemy import ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from core.database.base import Base


class VlogOrm(Base):
    """브이로그 (ERD: vlog).

    pet_id는 cross-context(users)라 FK 없이 Integer index로 둔다.
    itinerary_id도 cross-context(map 동선)라 FK 없이 Integer로 둔다. 데이터는 mock 시드.
    """

    __tablename__ = "vlog"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    pet_id: Mapped[int] = mapped_column(Integer, index=True)
    itinerary_id: Mapped[int] = mapped_column(Integer)
    tone: Mapped[str] = mapped_column(String)
    video_url: Mapped[str] = mapped_column(String, default="")
    created_at: Mapped[str] = mapped_column(String)


class VlogClipOrm(Base):
    """브이로그 클립 (ERD: vlog_clip). vlog_id+seq 복합 PK로 vlog에 종속.

    vlog_clip은 독립 슬라이스가 아니라 vlog 도메인에 포함되므로 같은 ORM 파일에 둔다.
    """

    __tablename__ = "vlog_clip"

    vlog_id: Mapped[int] = mapped_column(ForeignKey("vlog.id"), primary_key=True)
    seq: Mapped[int] = mapped_column(Integer, primary_key=True)
    source_type: Mapped[str] = mapped_column(String)
    media_url: Mapped[str] = mapped_column(String, default="")
