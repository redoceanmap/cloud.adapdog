from __future__ import annotations

from sqlalchemy import Boolean, Float, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from core.database.base import Base


class AnimalHospitalOrm(Base):
    """응급 안내용 동물병원 (행안부 동물병원 표준데이터). region 공유 차원 참조.

    별도 출처(LOCALDATA)라 facility와 통합하지 않는다. 좌표는 인제스트에서
    TM(EPSG:2097)→WGS84로 변환해 저장. 운영시간이 없어 24시 여부는 상호명에서 파생(컬럼 없음).
    """

    __tablename__ = "animal_hospital"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String)
    latitude: Mapped[float] = mapped_column(Float, index=True)
    longitude: Mapped[float] = mapped_column(Float, index=True)
    region_id: Mapped[int | None] = mapped_column(ForeignKey("region.id"), index=True, nullable=True)
    phone: Mapped[str | None] = mapped_column(String, nullable=True)
    road_address: Mapped[str | None] = mapped_column(String, nullable=True)
    is_open: Mapped[bool] = mapped_column(Boolean, default=True)  # 영업상태명 == 영업/정상
