from __future__ import annotations

from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column

from core.database.base import Base


class PetPersonaOrm(Base):
    """페르소나 (ERD: pet_persona). pet과 1:1. 데이터는 mock 시드."""

    __tablename__ = "pet_persona"

    pet_id: Mapped[int] = mapped_column(ForeignKey("pet.id"), primary_key=True)
    intro_text: Mapped[str] = mapped_column(String)
    hero_image_url: Mapped[str] = mapped_column(String)
    mascot_image_url: Mapped[str] = mapped_column(String)
    tone: Mapped[str] = mapped_column(String)
    created_at: Mapped[str] = mapped_column(String)
