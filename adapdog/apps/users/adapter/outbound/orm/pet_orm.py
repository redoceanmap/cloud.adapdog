from __future__ import annotations

from sqlalchemy import ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from core.database.base import Base


class PetOrm(Base):
    """반려동물 테이블. size/temperament는 견종 자동완성 결과를 보관."""

    __tablename__ = "pet"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    account_id: Mapped[int] = mapped_column(ForeignKey("account.id"), index=True)
    name: Mapped[str] = mapped_column(String)
    breed: Mapped[str] = mapped_column(String)
    photo_url: Mapped[str] = mapped_column(String)
    size: Mapped[str] = mapped_column(String)               # small / medium / large / unknown
    temperament: Mapped[str] = mapped_column(String, default="")
    birth_year: Mapped[int | None] = mapped_column(Integer, nullable=True)
    gender: Mapped[str] = mapped_column(String, default="unknown")
    features: Mapped[str | None] = mapped_column(String, nullable=True)


class PetTraitOrm(Base):
    """반려동물 체질 (다중값 분리, 3NF). 견종 자동완성에서 파생."""

    __tablename__ = "pet_trait"

    pet_id: Mapped[int] = mapped_column(ForeignKey("pet.id"), primary_key=True)
    trait: Mapped[str] = mapped_column(String, primary_key=True)
