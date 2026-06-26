from __future__ import annotations

from sqlalchemy import Float, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from core.database.base import Base

# region / category 차원은 pet_place_orm 에서 정의(공유). 여기선 import 없이 FK 문자열로 참조.


class BarrierFreeFacility(Base):
    """무장애(배리어프리) 시설. 원천: data.go.kr 15111386."""

    __tablename__ = "barrier_free_facility"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String)
    latitude: Mapped[float] = mapped_column(Float)
    longitude: Mapped[float] = mapped_column(Float)
    region_id: Mapped[int | None] = mapped_column(ForeignKey("region.id"), index=True, nullable=True)
    category_id: Mapped[int | None] = mapped_column(ForeignKey("category.id"), nullable=True)
    road_address: Mapped[str | None] = mapped_column(String, nullable=True)


class BarrierFreeFeature(Base):
    """시설별 무장애 요소 (다중값 분리, 3NF). feature_code = AccessibilityFeature.value."""

    __tablename__ = "barrier_free_feature"

    facility_id: Mapped[int] = mapped_column(ForeignKey("barrier_free_facility.id"), primary_key=True)
    feature_code: Mapped[str] = mapped_column(String, primary_key=True)
