from __future__ import annotations

from sqlalchemy import ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from core.database.base import Base


class PetStampOrm(Base):
    """수집 스탬프 (ERD: pet_stamp). pet+stamp_spot 복합 PK. 데이터는 mock 시드.

    spot_name은 표시용 도메인 항목이며 ORM에는 두지 않는다(스팟 차원에서 JOIN).
    """

    __tablename__ = "pet_stamp"

    pet_id: Mapped[int] = mapped_column(ForeignKey("pet.id"), primary_key=True)
    stamp_spot_id: Mapped[int] = mapped_column(Integer, primary_key=True)
    collected_at: Mapped[str] = mapped_column(String)
