from __future__ import annotations

import asyncio
import csv
import logging
from typing import Optional

from sqlalchemy import select
from sqlalchemy.exc import SQLAlchemyError

from core.database import session as dbs
from map.adapter.outbound.mappers.city_park_mapper import CityParkMapper
from map.adapter.outbound.orm.city_park_orm import CityParkOrm
from map.app.ports.output.city_park_port import CityParkPort
from map.domain.entities.city_park_entity import CityPark
from map.domain.value_objects.pet_place_vo import Coordinate

logger = logging.getLogger(__name__)

# 산책 코스로 부적합한 공원구분 — 놀이터성 어린이공원은 후보에서 제외(전국의 약 절반).
_EXCLUDED_PARK_TYPES = ("어린이공원",)


def _walkable(park_type: str | None) -> bool:
    return (park_type or "") not in _EXCLUDED_PARK_TYPES


def _pick_nearby(scored: list[tuple[float, CityPark]], limit: int) -> list[CityPark]:
    """거리순 정렬 후 상한까지."""
    scored.sort(key=lambda x: x[0])
    return [p for _, p in scored[:limit]]


class CsvCityParkRepository(CityParkPort):
    """전국 도시공원 CSV 조회(cp949). 1회 로드 후 캐시, 인근 산책 적합 공원을 거리순으로 고른다."""

    def __init__(self, csv_path: str) -> None:
        self.csv_path = csv_path
        self._cache: Optional[list[CityPark]] = None

    def _load(self) -> list[CityPark]:
        if self._cache is not None:
            return self._cache
        out: list[CityPark] = []
        try:
            with open(self.csv_path, encoding="cp949", newline="") as f:
                for i, r in enumerate(csv.DictReader(f), start=1):
                    ptype = (r.get("공원구분") or "").strip()
                    if not _walkable(ptype):
                        continue
                    lat_s = (r.get("위도") or "").strip()
                    lng_s = (r.get("경도") or "").strip()
                    name = (r.get("공원명") or "").strip()
                    if not (name and lat_s and lng_s):
                        continue
                    try:
                        coord = Coordinate(float(lat_s), float(lng_s))
                    except (ValueError, TypeError):
                        continue
                    out.append(CityPark(
                        id=i,
                        name=name,
                        coordinate=coord,
                        park_type=ptype or "공원",
                        address=(r.get("소재지도로명주소") or r.get("소재지지번주소") or "").strip() or None,
                        phone=(r.get("전화번호") or "").strip() or None,
                    ))
        except FileNotFoundError:
            logger.warning("[CsvCityParkRepository] 도시공원 CSV 없음 | %s", self.csv_path)
        self._cache = out
        logger.info("[CsvCityParkRepository] 로드 | 산책공원=%d", len(out))
        return out

    async def nearby(self, near: Coordinate, limit: int = 6) -> list[CityPark]:
        parks = await asyncio.to_thread(self._load)
        delta = 0.1  # 약 ±11km — CSV는 전국이라 인근만 후보
        scored = [
            (near.distance_km_to(p.coordinate), p)
            for p in parks
            if abs(p.coordinate.latitude - near.latitude) <= delta
            and abs(p.coordinate.longitude - near.longitude) <= delta
        ]
        return _pick_nearby(scored, limit)


# ── 3NF DB 구현 (system of record) ────────────────────────────────────────────
class DbCityParkRepository(CityParkPort):
    """3NF Postgres DB(city_park)에서 인근 산책 공원을 조회.

    바운딩박스로 후보를 좁힌 뒤 Python에서 거리순으로 고른다. 테이블이 비면 CSV 폴백.
    """

    def __init__(self, csv_fallback: "CsvCityParkRepository | None" = None) -> None:
        self._csv_fallback = csv_fallback

    async def nearby(self, near: Coordinate, limit: int = 6) -> list[CityPark]:
        factory = dbs.async_session_factory
        if factory is None:
            dbs.init_engine()
            factory = dbs.async_session_factory
        if factory is None:
            logger.warning("[DbCityParkRepository] DB 미초기화 → CSV 폴백")
            return await self._fallback(near, limit)

        delta = 0.1  # 약 ±11km 바운딩박스
        try:
            async with factory() as s:
                rows = (await s.execute(
                    select(CityParkOrm).where(
                        CityParkOrm.latitude.between(near.latitude - delta, near.latitude + delta),
                        CityParkOrm.longitude.between(near.longitude - delta, near.longitude + delta),
                        CityParkOrm.park_type.notin_(_EXCLUDED_PARK_TYPES),
                    )
                )).scalars().all()
        except SQLAlchemyError as e:  # 테이블 미생성(마이그레이션 전) 등 → CSV 폴백(코스 끊김 방지)
            logger.warning("[DbCityParkRepository] DB 조회 실패 → CSV 폴백 | %s", e)
            return await self._fallback(near, limit)
        if not rows:  # 테이블 미시드/해당 지역 데이터 없음 → CSV 폴백
            return await self._fallback(near, limit)
        scored = [
            (near.distance_km_to((ent := CityParkMapper.to_entity(orm)).coordinate), ent)
            for orm in rows
        ]
        return _pick_nearby(scored, limit)

    async def _fallback(self, near: Coordinate, limit: int) -> list[CityPark]:
        if self._csv_fallback is None:
            return []
        return await self._csv_fallback.nearby(near, limit)
