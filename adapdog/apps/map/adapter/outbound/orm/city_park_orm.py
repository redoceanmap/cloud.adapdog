from __future__ import annotations

from sqlalchemy import Float, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from core.database.base import Base


class CityParkOrm(Base):
    """플래너 야외 슬롯 후보 공원 (전국 도시공원 표준데이터). region 공유 차원 참조.

    별도 출처라 facility와 통합하지 않고 region 차원만 공유(§5.6 비통합 원칙).
    좌표는 표준데이터에 WGS84로 들어있어 변환 없이 저장한다.
    """

    __tablename__ = "city_park"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String)
    park_type: Mapped[str | None] = mapped_column(String, index=True, nullable=True)  # 공원구분
    latitude: Mapped[float] = mapped_column(Float, index=True)
    longitude: Mapped[float] = mapped_column(Float, index=True)
    region_id: Mapped[int | None] = mapped_column(ForeignKey("region.id"), index=True, nullable=True)
    road_address: Mapped[str | None] = mapped_column(String, nullable=True)
    jibun_address: Mapped[str | None] = mapped_column(String, nullable=True)
    phone: Mapped[str | None] = mapped_column(String, nullable=True)
