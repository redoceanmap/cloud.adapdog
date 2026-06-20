from __future__ import annotations

from typing import Optional

from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column

from core.database.base import Base


class BreedCatalog(Base):
    """견종 표준정보 (자동완성 데이터원). breed는 정규화 키(조회용), display_name은 표시용 정식명."""

    __tablename__ = "breed_catalog"

    breed: Mapped[str] = mapped_column(String, primary_key=True)
    display_name: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    size: Mapped[str] = mapped_column(String)           # small / medium / large / unknown
    temperament: Mapped[str] = mapped_column(String, default="")


class BreedCatalogTrait(Base):
    """견종별 체질 (다중값 분리, 3NF). facility_allowed_pet_size와 동형."""

    __tablename__ = "breed_catalog_trait"

    breed: Mapped[str] = mapped_column(ForeignKey("breed_catalog.breed"), primary_key=True)
    trait: Mapped[str] = mapped_column(String, primary_key=True)
