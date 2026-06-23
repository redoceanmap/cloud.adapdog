from __future__ import annotations

from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from core.database.base import Base


class DecorationOrm(Base):
    """꾸미기 결과 (ERD: decoration).

    pet_id는 cross-context(users 컨텍스트)라 FK 없이 Integer index로만 둔다.
    template_id는 같은 creative 컨텍스트지만 데모 단계라 FK 없이 Integer로 둔다. 데이터는 mock 시드.
    """

    __tablename__ = "decoration"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    pet_id: Mapped[int] = mapped_column(Integer, index=True)
    template_id: Mapped[int] = mapped_column(Integer)
    source_photo_url: Mapped[str] = mapped_column(String, default="")
    result_image_url: Mapped[str] = mapped_column(String, default="")
    model3d_url: Mapped[str] = mapped_column(String, default="")
    created_at: Mapped[str] = mapped_column(String)
