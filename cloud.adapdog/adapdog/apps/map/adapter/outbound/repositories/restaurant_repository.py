from __future__ import annotations

import asyncio
import csv
import logging
from typing import Optional

from sqlalchemy import select

from core.database import session as dbs
from map.adapter.outbound.mappers.restaurant_mapper import RestaurantMapper
from map.adapter.outbound.orm.restaurant_orm import RestaurantOrm
from map.app.ports.output.restaurant_port import RestaurantPort
from map.domain.entities.restaurant_entity import Restaurant
from map.domain.value_objects.pet_place_vo import Coordinate, PetSize

logger = logging.getLogger(__name__)

# 펫동반 문화시설 CSV의 '입장 가능 동물 크기' 컬럼 후보(pet_place 리포지토리와 동일 기준).
_DINING_SIZE_KEYS = (
    "입장 가능 동물 크기", "입장가능 동물 크기", "동반 가능 동물 크기", "허용동물크기", "반려동물 크기",
)


def _pick_nearby(scored: list[tuple[float, Restaurant]], limit: int) -> list[Restaurant]:
    """펫동반 식당만 추려 가까운 순으로 모범·이미지 보유 우선 반환(동반 가능한 곳만 노출).

    펫동반 데이터에 등록되지 않은 식당은 입장 판정이 '동반 불가/정보 없음'으로 떠 혼란을 주므로
    아예 제외한다. 인근에 펫동반 식당이 없으면 빈 결과(해당 식사 슬롯은 비움)를 돌려준다.
    """
    pet = [(d, r) for d, r in scored if r.pet_friendly]
    if not pet:
        return []
    pet.sort(key=lambda x: x[0])
    near_pool = pet[:40]
    near_pool.sort(key=lambda x: (not x[1].recommended, x[1].image_url is None, x[0]))
    return [r for _, r in near_pool[:limit]]

# 식당명 정규화(공백 제거) — 기본정보↔이미지↔펫동반 데이터 매칭 키.
def _norm(name: str) -> str:
    return "".join((name or "").split())


# 펫동반 식당/카페 식별 — 펫동반 문화시설 CSV의 카테고리2/3 키워드.
_DINING_HINTS = ("카페", "식당", "음식", "맛집", "레스토랑", "베이커리")


class CsvRestaurantRepository(RestaurantPort):
    """전주 음식점 CSV 조회. 기본정보(좌표·전화·업태) + 이미지정보(썸네일) + 펫동반 매칭.

    세 CSV를 1회 로드 후 캐시. nearby_meal은 좌표 인근에서 펫동반·이미지 보유를 우선해 고른다.
    """

    def __init__(self, basic_csv: str, image_csv: str, petplace_csv: str, model_csv: str | None = None) -> None:
        self.basic_csv = basic_csv
        self.image_csv = image_csv
        self.petplace_csv = petplace_csv
        self.model_csv = model_csv
        self._cache: Optional[list[Restaurant]] = None
        self._petfriendly: dict[str, frozenset[PetSize]] = {}  # 식당명(정규화) → 동반 허용 크기

    def _load_recommended(self) -> set[str]:
        """전주시 모범음식점 CSV에서 업소명(정규화) 집합. cp949."""
        names: set[str] = set()
        if not self.model_csv:
            return names
        try:
            with open(self.model_csv, encoding="cp949", newline="") as f:
                for r in csv.DictReader(f):
                    n = _norm(r.get("업소명") or "")
                    if n:
                        names.add(n)
        except FileNotFoundError:
            logger.warning("[CsvRestaurantRepository] 모범음식점 CSV 없음 | %s", self.model_csv)
        return names

    def _load_images(self) -> dict[str, str]:
        """식당명(정규화) → 첫 이미지 URL. cp949 인코딩."""
        images: dict[str, str] = {}
        try:
            with open(self.image_csv, encoding="cp949", newline="") as f:
                for r in csv.DictReader(f):
                    name = _norm(r.get("식당명") or "")
                    url = (r.get("식당이미지(URL)") or "").strip()
                    if name and url and name not in images:
                        images[name] = url
        except FileNotFoundError:
            logger.warning("[CsvRestaurantRepository] 이미지 CSV 없음 | %s", self.image_csv)
        return images

    def _load_petfriendly(self) -> dict[str, frozenset[PetSize]]:
        """펫동반 문화시설 CSV → 전주 음식/카페 식당명(정규화) → 동반 허용 크기 집합. utf-8-sig.

        같은 식당명이 여러 행이면 허용 크기를 합집합한다. 입장 판정(entry-verdict)과 같은 크기
        기준을 써서, 우리 아이 크기를 못 받는 식당은 식사 후보에서 빠지게 한다.
        """
        sizes: dict[str, frozenset[PetSize]] = {}
        try:
            with open(self.petplace_csv, encoding="utf-8-sig", newline="") as f:
                for r in csv.DictReader(f):
                    if "전주" not in (r.get("시군구 명칭") or ""):
                        continue
                    cat = (r.get("카테고리2") or "") + (r.get("카테고리3") or "")
                    if not any(h in cat for h in _DINING_HINTS):
                        continue
                    key = _norm(r.get("시설명") or "")
                    if not key:
                        continue
                    raw = next((r.get(k) for k in _DINING_SIZE_KEYS if r.get(k)), None)
                    allowed = PetSize.parse_allowed(raw)
                    sizes[key] = sizes.get(key, frozenset()) | allowed
        except FileNotFoundError:
            logger.warning("[CsvRestaurantRepository] 펫동반 CSV 없음 | %s", self.petplace_csv)
        return sizes

    def _load(self) -> list[Restaurant]:
        if self._cache is not None:
            return self._cache
        images = self._load_images()
        petfriendly = self._load_petfriendly()
        self._petfriendly = petfriendly
        recommended = self._load_recommended()
        out: list[Restaurant] = []
        try:
            with open(self.basic_csv, encoding="utf-8-sig", newline="") as f:
                for r in csv.DictReader(f):
                    if (r.get("식당상태") or "").strip() not in ("", "운영중"):
                        continue
                    name = (r.get("식당명") or "").strip()
                    lat_s = (r.get("식당위도") or "").strip()
                    lng_s = (r.get("식당경도") or "").strip()
                    if not (name and lat_s and lng_s):
                        continue
                    try:
                        coord = Coordinate(float(lat_s), float(lng_s))
                    except (ValueError, TypeError):
                        continue
                    key = _norm(name)
                    out.append(Restaurant(
                        name=name,
                        coordinate=coord,
                        category=(r.get("영업신고증업태명") or r.get("영업인허가명") or "음식점").strip(),
                        phone=(r.get("식당대표전화번호") or "").strip() or None,
                        address=(r.get("도로명주소") or r.get("지번주소") or "").strip() or None,
                        image_url=images.get(key),
                        pet_friendly=key in petfriendly,
                        recommended=key in recommended,
                    ))
        except FileNotFoundError:
            logger.warning("[CsvRestaurantRepository] 기본정보 CSV 없음 | %s", self.basic_csv)
        self._cache = out
        logger.info("[CsvRestaurantRepository] 로드 | 식당=%d 펫동반매칭=%d 모범=%d 이미지=%d",
                    len(out), sum(1 for x in out if x.pet_friendly),
                    sum(1 for x in out if x.recommended), sum(1 for x in out if x.image_url))
        return out

    async def nearby_meal(
        self, near: Coordinate, exclude_names: frozenset[str], limit: int = 1,
        pet_size: PetSize = PetSize.UNKNOWN,
    ) -> list[Restaurant]:
        restaurants = await asyncio.to_thread(self._load)
        excluded = {_norm(n) for n in exclude_names}

        def _accepts(r: Restaurant) -> bool:
            # 우리 아이 크기를 받는 펫동반 식당만(크기 미지정이면 동반 등록 식당 전체).
            allowed = self._petfriendly.get(_norm(r.name))
            if not allowed:
                return False
            return pet_size is PetSize.UNKNOWN or pet_size in allowed

        scored = [
            (near.distance_km_to(r.coordinate), r)
            for r in restaurants if _norm(r.name) not in excluded and _accepts(r)
        ]
        return _pick_nearby(scored, limit)


# ── 3NF DB 구현 (system of record) ────────────────────────────────────────────
class DbRestaurantRepository(RestaurantPort):
    """3NF Postgres DB(restaurant + restaurant_image)에서 식사 식당을 조회.

    좌표 인근 바운딩박스로 후보를 좁힌 뒤 Python에서 거리·펫동반·이미지로 고른다(PostGIS 불필요).
    restaurant 테이블이 아직 시드되지 않았으면(빈 결과) CSV 폴백으로 끊김 없이 식당을 제공한다.
    """

    def __init__(self, csv_fallback: "CsvRestaurantRepository | None" = None) -> None:
        self._csv_fallback = csv_fallback

    async def nearby_meal(
        self, near: Coordinate, exclude_names: frozenset[str], limit: int = 1,
        pet_size: PetSize = PetSize.UNKNOWN,
    ) -> list[Restaurant]:
        factory = dbs.async_session_factory
        if factory is None:
            dbs.init_engine()
            factory = dbs.async_session_factory
        if factory is None:
            logger.warning("[DbRestaurantRepository] DB 미초기화 → CSV 폴백")
            return await self._fallback(near, exclude_names, limit, pet_size)

        delta = 0.1  # 약 ±11km 바운딩박스
        excluded = {_norm(n) for n in exclude_names}
        try:
            async with factory() as s:
                rows = (await s.execute(
                    select(RestaurantOrm).where(
                        RestaurantOrm.latitude.between(near.latitude - delta, near.latitude + delta),
                        RestaurantOrm.longitude.between(near.longitude - delta, near.longitude + delta),
                    )
                )).scalars().all()
        except Exception as e:  # noqa: BLE001 — 스키마 드리프트 등 DB 오류 시 CSV로 끊김 없이 폴백
            logger.warning("[DbRestaurantRepository] DB 조회 실패 → CSV 폴백 | %s", e)
            return await self._fallback(near, exclude_names, limit, pet_size)
        if not rows:  # 테이블 미시드/해당 지역 데이터 없음 → CSV 폴백(데모 안정)
            return await self._fallback(near, exclude_names, limit, pet_size)
        # 썸네일은 restaurant.thumbnail_url(역정규화)이라 이미지 2차 조회가 필요 없다.
        scored: list[tuple[float, Restaurant]] = []
        for orm in rows:
            if _norm(orm.name) in excluded:
                continue
            ent = RestaurantMapper.to_entity(orm)
            scored.append((near.distance_km_to(ent.coordinate), ent))
        return _pick_nearby(scored, limit)

    async def _fallback(
        self, near: Coordinate, exclude_names: frozenset[str], limit: int,
        pet_size: PetSize = PetSize.UNKNOWN,
    ) -> list[Restaurant]:
        if self._csv_fallback is None:
            return []
        return await self._csv_fallback.nearby_meal(near, exclude_names, limit, pet_size)
