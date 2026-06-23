from __future__ import annotations

from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from core.database.base import Base


class DecorationTemplateOrm(Base):
    """꾸미기 템플릿 (ERD: decoration_template). 독립 마스터(부모 FK 없음). 데이터는 mock 시드."""

    __tablename__ = "decoration_template"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String)
    theme: Mapped[str] = mapped_column(String)
    thumbnail_url: Mapped[str] = mapped_column(String, default="")
    source: Mapped[str] = mapped_column(String, default="")
