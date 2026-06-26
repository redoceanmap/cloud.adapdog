from __future__ import annotations

import asyncio
import csv
import logging
from typing import Optional

from map.app.ports.output.restaurant_port import RestaurantPort
from map.domain.entities.restaurant_entity import Restaurant
from map.domain.value_objects.pet_place_vo import Coordinate

logger = logging.getLogger(__name__)

# 식당명 정규화(공백 제거) — 기본정보↔이미지↔펫동반 데이터 매칭 키.
def _norm(name: str) -> str:
    return "".join((name or "").split())


# 펫동반 식당/카페 식별 — 펫동반 문화시설 CSV의 카테고리2/3 키워드.
_DINING_HINTS = ("카페", "식당", "음식", "맛집", "레스토랑", "베이커리")


class CsvRestaurantRepository(RestaurantPort):
    """전주 음식점 CSV 조회. 기본정보(좌표·전화·업태) + 이미지정보(썸네일) + 펫동반 매칭.

    세 CSV를 1회 로드 후 캐시. nearby_meal은 좌표 인근에서 펫동반·이미지 보유를 우선해 고른다.
    """

    def __init__(self, basic_csv: str, image_csv: str, petplace_csv: str) -> None:
        self.basic_csv = basic_csv
        self.image_csv = image_csv
        self.petplace_csv = petplace_csv
        self._cache: Optional[list[Restaurant]] = None

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

    def _load_petfriendly(self) -> set[str]:
        """펫동반 문화시설 CSV에서 전주 음식/카페 식당명(정규화) 집합. utf-8-sig."""
        names: set[str] = set()
        try:
            with open(self.petplace_csv, encoding="utf-8-sig", newline="") as f:
                for r in csv.DictReader(f):
                    if "전주" not in (r.get("시군구 명칭") or ""):
                        continue
                    cat = (r.get("카테고리2") or "") + (r.get("카테고리3") or "")
                    if any(h in cat for h in _DINING_HINTS):
                        names.add(_norm(r.get("시설명") or ""))
        except FileNotFoundError:
            logger.warning("[CsvRestaurantRepository] 펫동반 CSV 없음 | %s", self.petplace_csv)
        return names

    def _load(self) -> list[Restaurant]:
        if self._cache is not None:
            return self._cache
        images = self._load_images()
        petfriendly = self._load_petfriendly()
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
                    ))
        except FileNotFoundError:
            logger.warning("[CsvRestaurantRepository] 기본정보 CSV 없음 | %s", self.basic_csv)
        self._cache = out
        logger.info("[CsvRestaurantRepository] 로드 | 식당=%d 펫동반매칭=%d 이미지=%d",
                    len(out), sum(1 for x in out if x.pet_friendly), sum(1 for x in out if x.image_url))
        return out

    async def nearby_meal(
        self, near: Coordinate, exclude_names: frozenset[str], limit: int = 1,
    ) -> list[Restaurant]:
        restaurants = await asyncio.to_thread(self._load)
        excluded = {_norm(n) for n in exclude_names}
        scored = [
            (near.distance_km_to(r.coordinate), r)
            for r in restaurants if _norm(r.name) not in excluded
        ]
        if not scored:
            return []
        # 인근 40곳으로 좁힌 뒤 펫동반·이미지 보유를 우선(둘 다 동률이면 더 가까운 곳).
        scored.sort(key=lambda x: x[0])
        near_pool = scored[:40]
        near_pool.sort(key=lambda x: (not x[1].pet_friendly, x[1].image_url is None, x[0]))
        return [r for _, r in near_pool[:limit]]
