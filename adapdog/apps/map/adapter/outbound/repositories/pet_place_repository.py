from __future__ import annotations

import asyncio
import json
import logging
import urllib.request
from collections import defaultdict
from typing import Any, Optional
from urllib.parse import urlencode

from sqlalchemy import or_, select
from sqlalchemy.orm import aliased

from core.database import session as dbs
from map.adapter.outbound.mappers.pet_place_mapper import PetPlaceMapper
from map.adapter.outbound.orm.pet_place_orm import (
    Category,
    Facility,
    FacilityAllowedPetSize,
    FacilityPetPolicy,
    Region,
)
from map.app.ports.output.pet_place_port import PetFriendlyPlacePort
from map.domain.entities.pet_place_entity import PetFriendlyPlace
from map.domain.value_objects.pet_place_vo import Coordinate, PetSize

logger = logging.getLogger(__name__)


# ── 목 구현 ───────────────────────────────────────────────────────────────────
_MOCK_PLACES: dict[str, list[PetFriendlyPlace]] = {
    "강릉": [
        PetFriendlyPlace(1, "경포해변 반려견 산책로", Coordinate(37.7950, 128.9100), "해변", PetSize.up_to(PetSize.LARGE)),
        PetFriendlyPlace(2, "강릉 펫 프렌들리 카페", Coordinate(37.7519, 128.8761), "카페", PetSize.up_to(PetSize.MEDIUM), "목줄 착용 필수"),
        PetFriendlyPlace(3, "오죽헌 야외 정원", Coordinate(37.7796, 128.8784), "미술관", PetSize.up_to(PetSize.SMALL), "이동장 필요"),
        PetFriendlyPlace(4, "안목해변 커피거리", Coordinate(37.7710, 128.9472), "해변", PetSize.up_to(PetSize.LARGE)),
        PetFriendlyPlace(5, "정동심곡 바다부채길", Coordinate(37.6905, 129.0357), "산책로", PetSize.up_to(PetSize.MEDIUM)),
        PetFriendlyPlace(6, "강릉 24시 동물병원", Coordinate(37.7600, 128.8990), "동물병원", PetSize.all_sizes()),
    ],
}


class MockPetFriendlyPlaceRepository(PetFriendlyPlacePort):
    """목 구현. DB/네트워크 불필요."""

    async def find_places(self, region: str) -> list[PetFriendlyPlace]:
        places = _MOCK_PLACES.get(region.strip(), [])
        logger.info("[MockPetFriendlyPlaceRepository] region=%s hit=%d", region, len(places))
        return places


# ── 3NF DB 구현 (system of record) ────────────────────────────────────────────
class DbPetFriendlyPlaceRepository(PetFriendlyPlacePort):
    """3NF Postgres DB에서 시설을 조회. CSV/API 인제스트 결과를 읽는다."""

    async def find_places(self, region: str) -> list[PetFriendlyPlace]:
        factory = dbs.async_session_factory
        if factory is None:
            dbs.init_engine()
            factory = dbs.async_session_factory
        if factory is None:
            logger.warning("[DbPetFriendlyPlaceRepository] DB 미초기화 → 빈 결과")
            return []

        q = f"%{region.strip()}%"
        sigungu = aliased(Region)
        sido = aliased(Region)
        async with factory() as s:
            facs = (await s.execute(
                select(Facility)
                .join(sigungu, Facility.region_id == sigungu.id)
                .outerjoin(sido, sigungu.parent_id == sido.id)
                .where(or_(sigungu.name.like(q), sido.name.like(q)))
            )).scalars().all()
            if not facs:
                return []
            ids = [f.id for f in facs]
            cats = dict((await s.execute(select(Category.id, Category.name))).all())
            pols = dict((await s.execute(
                select(FacilityPetPolicy.facility_id, FacilityPetPolicy.restriction)
                .where(FacilityPetPolicy.facility_id.in_(ids))
            )).all())
            sizes: dict[int, set[str]] = defaultdict(set)
            for fid, sz in (await s.execute(
                select(FacilityAllowedPetSize.facility_id, FacilityAllowedPetSize.pet_size)
                .where(FacilityAllowedPetSize.facility_id.in_(ids))
            )).all():
                sizes[fid].add(sz)

        places = [
            PetPlaceMapper.to_entity(f, cats.get(f.category_id, ""), pols.get(f.id, ""), sizes[f.id])
            for f in facs
        ]
        logger.info("[DbPetFriendlyPlaceRepository] region=%s matched=%d", region, len(places))
        return places


# ── odcloud(data.go.kr 15111389) 실 API 구현 ─────────────────────────────────
_NAME_KEYS = ("시설명", "장소명", "상호명", "명칭")
_LAT_KEYS = ("위도", "y좌표", "lat", "LA", "latitude")
_LNG_KEYS = ("경도", "x좌표", "lng", "LO", "longitude")
_CATEGORY_KEYS = ("카테고리3", "카테고리2", "카테고리1", "시설종류", "시설구분", "구분")
_SIZE_KEYS = ("입장 가능 동물 크기", "입장가능 동물 크기", "동반 가능 동물 크기", "허용동물크기", "반려동물 크기")
_RESTRICTION_KEYS = ("반려동물 제한사항", "제한사항", "반려동물제한사항")
_ADDRESS_KEYS = ("도로명주소", "지번주소", "주소", "소재지도로명주소", "소재지지번주소")


class OdcloudPetFriendlyPlaceRepository(PetFriendlyPlacePort):
    """data.go.kr(odcloud) 실 API 구현 (요청시 호출). 지역 필터는 코드측."""

    def __init__(self, endpoint: str, service_key: str, max_rows: int) -> None:
        self.endpoint = endpoint
        self.service_key = service_key
        self.max_rows = max_rows

    async def find_places(self, region: str) -> list[PetFriendlyPlace]:
        records = await asyncio.to_thread(self._fetch_all)
        region = region.strip()
        places = [p for i, rec in enumerate(records, 1)
                  if _matches_region(rec, region) and (p := _to_place(i, rec)) is not None]
        logger.info("[Odcloud] region=%s fetched=%d matched=%d", region, len(records), len(places))
        return places

    def _fetch_all(self) -> list[dict[str, Any]]:
        collected: list[dict[str, Any]] = []
        page = 1
        while len(collected) < self.max_rows:
            params = urlencode({"page": page, "perPage": 500, "serviceKey": self.service_key, "returnType": "JSON"})
            try:
                with urllib.request.urlopen(f"{self.endpoint}?{params}", timeout=15) as resp:  # noqa: S310
                    payload = json.loads(resp.read().decode("utf-8"))
            except Exception as e:  # noqa: BLE001 — 외부 API 장애 시 수집분만 반환(서비스 유지)
                logger.warning("[Odcloud] page=%d 호출 실패 → 수집분 %d건 반환 | %s", page, len(collected), e)
                break
            data = payload.get("data") or []
            if not data:
                break
            collected.extend(data)
            if len(collected) >= payload.get("totalCount", len(collected)):
                break
            page += 1
        return collected[: self.max_rows]


def _pick(rec: dict[str, Any], keys: tuple[str, ...]) -> Optional[str]:
    for k in keys:
        v = rec.get(k)
        if v is not None and str(v).strip():
            return str(v).strip()
    return None


def _matches_region(rec: dict[str, Any], region: str) -> bool:
    if not region:
        return True
    return region in (_pick(rec, _ADDRESS_KEYS) or "") or region in (_pick(rec, _NAME_KEYS) or "")


def _to_place(place_id: int, rec: dict[str, Any]) -> Optional[PetFriendlyPlace]:
    lat_raw, lng_raw, name = _pick(rec, _LAT_KEYS), _pick(rec, _LNG_KEYS), _pick(rec, _NAME_KEYS)
    if not (lat_raw and lng_raw and name):
        return None
    try:
        coordinate = Coordinate(float(lat_raw), float(lng_raw))
    except (ValueError, TypeError):
        return None
    return PetFriendlyPlace(
        id=place_id,
        name=name,
        coordinate=coordinate,
        category=_pick(rec, _CATEGORY_KEYS) or "기타",
        allowed_sizes=PetSize.parse_allowed(_pick(rec, _SIZE_KEYS)),
        restriction=_pick(rec, _RESTRICTION_KEYS) or "",
    )
