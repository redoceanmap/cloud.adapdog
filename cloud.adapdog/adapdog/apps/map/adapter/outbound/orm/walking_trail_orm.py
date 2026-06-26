from __future__ import annotations

from sqlalchemy import Float, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from core.database.base import Base


class WalkingTrailOrm(Base):
    """둘레길 (ERD: walking_trail). region 공유 차원 참조(nullable). 데이터는 mock 시드."""

    __tablename__ = "walking_trail"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    region_id: Mapped[int | None] = mapped_column(ForeignKey("region.id"), index=True, nullable=True)
    name: Mapped[str] = mapped_column(String)
    distance_km: Mapped[float] = mapped_column(Float, default=0.0)
    difficulty: Mapped[str] = mapped_column(String, default="")
    duration: Mapped[str] = mapped_column(String, default="")
    path_geojson: Mapped[str] = mapped_column(String, default="")
    route_info: Mapped[str] = mapped_column(String, default="")  # 경유지 텍스트("A→B→C"), 두루누비 경로정보
    description: Mapped[str] = mapped_column(String, default="")
