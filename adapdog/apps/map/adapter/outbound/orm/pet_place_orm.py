from __future__ import annotations

from sqlalchemy import Boolean, Float, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from core.database.base import Base


class Region(Base):
    """행정구역 차원 (3NF, 자기참조). level 1=시도, 2=시군구. 두 데이터셋이 공유."""

    __tablename__ = "region"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String, index=True)
    level: Mapped[int] = mapped_column(Integer)
    parent_id: Mapped[int | None] = mapped_column(ForeignKey("region.id"), nullable=True)


class Category(Base):
    """시설 분류 차원 (3NF, 자기참조). 카테고리1/2/3 계층. 두 데이터셋이 공유."""

    __tablename__ = "category"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String, index=True)
    level: Mapped[int] = mapped_column(Integer)
    parent_id: Mapped[int | None] = mapped_column(ForeignKey("category.id"), nullable=True)


class Facility(Base):
    """반려동물 동반 가능 시설 (pet_place). 원천: data.go.kr 15111389."""

    __tablename__ = "facility"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String)
    latitude: Mapped[float] = mapped_column(Float)
    longitude: Mapped[float] = mapped_column(Float)
    region_id: Mapped[int | None] = mapped_column(ForeignKey("region.id"), index=True, nullable=True)
    category_id: Mapped[int | None] = mapped_column(ForeignKey("category.id"), nullable=True)
    road_address: Mapped[str | None] = mapped_column(String, nullable=True)
    jibun_address: Mapped[str | None] = mapped_column(String, nullable=True)
    phone: Mapped[str | None] = mapped_column(String, nullable=True)
    operating_hours: Mapped[str | None] = mapped_column(String, nullable=True)


class FacilityPetPolicy(Base):
    """시설별 반려동물 정책 (1:1)."""

    __tablename__ = "facility_pet_policy"

    facility_id: Mapped[int] = mapped_column(ForeignKey("facility.id"), primary_key=True)
    companion_allowed: Mapped[bool] = mapped_column(Boolean, default=True)
    restriction: Mapped[str | None] = mapped_column(String, nullable=True)
    extra_fee: Mapped[str | None] = mapped_column(String, nullable=True)
    indoor: Mapped[bool] = mapped_column(Boolean, default=False)
    outdoor: Mapped[bool] = mapped_column(Boolean, default=False)


class FacilityAllowedPetSize(Base):
    """시설별 입장 허용 크기 (다중값 분리, 3NF)."""

    __tablename__ = "facility_allowed_pet_size"

    facility_id: Mapped[int] = mapped_column(ForeignKey("facility.id"), primary_key=True)
    pet_size: Mapped[str] = mapped_column(String, primary_key=True)
