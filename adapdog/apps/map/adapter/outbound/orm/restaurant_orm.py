from __future__ import annotations

from sqlalchemy import Boolean, Float, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from core.database.base import Base


class RestaurantOrm(Base):
    """식사 정류장 후보 식당 (전주시 음식점기본정보). region/category 공유 차원 참조.

    펫동반 전용 facility와 출처·성격이 달라(일반식당 12k건) 별도 테이블로 둔다.
    pet_friendly는 펫동반 문화시설 데이터와 식당명 매칭으로 인제스트 시 채운다.
    """

    __tablename__ = "restaurant"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String)
    latitude: Mapped[float] = mapped_column(Float, index=True)
    longitude: Mapped[float] = mapped_column(Float, index=True)
    region_id: Mapped[int | None] = mapped_column(ForeignKey("region.id"), index=True, nullable=True)
    cuisine: Mapped[str | None] = mapped_column(String, nullable=True)  # 업태(한식/커피숍…) — 표시 라벨용. 시설 category 차원과 성격이 달라 비정규화 문자열로 보관.
    phone: Mapped[str | None] = mapped_column(String, nullable=True)
    road_address: Mapped[str | None] = mapped_column(String, nullable=True)
    jibun_address: Mapped[str | None] = mapped_column(String, nullable=True)
    status: Mapped[str | None] = mapped_column(String, nullable=True)  # 식당상태(운영중 등)
    # 대표 이미지(restaurant_image[min seq] 역정규화) — 카드 썸네일 조회를 2차 쿼리 없이.
    thumbnail_url: Mapped[str | None] = mapped_column(String, nullable=True)
    pet_friendly: Mapped[bool] = mapped_column(Boolean, default=False)
    # 전주시 모범음식점(위생·품질 지정) 매칭 여부 — 식사 슬롯에서 품질 신호로 우선 배치.
    recommended: Mapped[bool] = mapped_column(Boolean, default=False)


class RestaurantImageOrm(Base):
    """식당별 이미지 (다중값 분리, 3NF). seq=장 순서, url=이미지 주소."""

    __tablename__ = "restaurant_image"

    restaurant_id: Mapped[int] = mapped_column(ForeignKey("restaurant.id"), primary_key=True)
    seq: Mapped[int] = mapped_column(Integer, primary_key=True)
    url: Mapped[str] = mapped_column(String)
