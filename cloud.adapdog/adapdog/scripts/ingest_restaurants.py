"""전주시 음식점 CSV → restaurant / restaurant_image 테이블 적재 (비파괴 additive).

ingest_trails.py 패턴: drop_all 하지 않고 restaurant·restaurant_image 두 테이블만
비우고 재적재한다. region 공유 차원은 이미 적재돼 있다고 가정(주소→시군구/시도 룩업),
category(업태)는 lookup-or-create로 공유 category 차원에 추가한다. pet_friendly는
펫동반 문화시설 CSV의 음식/카페와 식당명 매칭으로 채운다. recommended는 모범음식점 매칭.

식사 슬롯은 펫동반 식당만 노출하므로, 펫동반 식사 후보를 늘리기 위해 (1)펫동반 문화시설
데이터의 음식/카페와 (2)한국관광공사 반려동물 동반여행 API(음식점)를 pet_friendly=True로
직접 적재한다.

실행: adapdog/ 에서  python scripts/ingest_restaurants.py
재실행 시 두 테이블만 전체 재적재(idempotent).
"""
from __future__ import annotations

import csv
import json
import os
import sys
import urllib.parse
import urllib.request

sys.path.insert(0, os.path.join(os.path.dirname(os.path.dirname(__file__)), "apps"))
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from sqlalchemy import create_engine, delete, select
from sqlalchemy.orm import Session

from core.config import (
    DATA_GO_KR_SERVICE_KEY,
    DATABASE_URL,
    PETPLACE_CSV_PATH,
    RESTAURANT_BASIC_CSV_PATH,
    RESTAURANT_IMAGE_CSV_PATH,
    RESTAURANT_MODEL_CSV_PATH,
)
from core.database.base import Base
from map.adapter.outbound.orm.pet_place_orm import Region  # noqa: F401 — 공유 region 차원
from map.adapter.outbound.orm.restaurant_orm import RestaurantImageOrm, RestaurantOrm

_DINING_HINTS = ("카페", "식당", "음식", "맛집", "레스토랑", "베이커리")

# KTO(한국관광공사) 반려동물 동반여행 API — data.go.kr 일반 인증키 공통 사용.
_PETTOUR_URL = "https://apis.data.go.kr/B551011/KorService2/detailPetTour2"
_AREA_BASED_URL = "https://apis.data.go.kr/B551011/KorService2/areaBasedList2"
_KTO_COMMON = {"_type": "json", "MobileOS": "ETC", "MobileApp": "adapdog"}
_CONTENT_TYPE_RESTAURANT = 39  # KTO contentTypeId: 39=음식점


def _kto_items(base: str, params: dict, rows: int = 1000):
    """KTO 표준 응답을 페이지네이션하며 item dict를 순회한다(serviceKey 자동 주입)."""
    page = 1
    while True:
        query = {**_KTO_COMMON, **params, "serviceKey": DATA_GO_KR_SERVICE_KEY,
                 "numOfRows": rows, "pageNo": page}
        url = base + "?" + urllib.parse.urlencode(query, safe="=")
        with urllib.request.urlopen(url, timeout=30) as resp:
            body = json.loads(resp.read().decode("utf-8", "replace")).get("response", {}).get("body", {})
        items = body.get("items") or ""
        items = items.get("item", []) if isinstance(items, dict) else []
        if not items:
            break
        yield from items
        if page * rows >= int(body.get("totalCount", 0) or 0):
            break
        page += 1


def _load_petfriendly_dining() -> list[dict]:
    """펫동반 문화시설 CSV의 음식/카페(좌표 보유) — 실제 펫동반 식사 후보(전국). utf-8-sig."""
    out: list[dict] = []
    try:
        with open(PETPLACE_CSV_PATH, encoding="utf-8-sig", newline="") as f:
            for r in csv.DictReader(f):
                cat = (r.get("카테고리2") or "") + (r.get("카테고리3") or "")
                if not any(h in cat for h in _DINING_HINTS):
                    continue
                name = (r.get("시설명") or "").strip()
                lat_s = (r.get("위도") or "").strip()
                lng_s = (r.get("경도") or "").strip()
                if not (name and lat_s and lng_s):
                    continue
                try:
                    lat, lng = float(lat_s), float(lng_s)
                except (ValueError, TypeError):
                    continue
                addr = (r.get("도로명주소") or r.get("지번주소") or "").strip()
                sido, sigungu = _region_tokens(addr)
                out.append({
                    "name": name, "lat": lat, "lng": lng,
                    "cuisine": (r.get("카테고리3") or r.get("카테고리2") or "음식점").strip() or None,
                    "phone": (r.get("전화번호") or "").strip() or None,
                    "address": addr or None, "sido": sido, "sigungu": sigungu,
                })
    except FileNotFoundError:
        print(f"펫동반 CSV 없음: {PETPLACE_CSV_PATH}")
    return out


def _fetch_kto_pet_restaurants() -> list[dict]:
    """KTO 반려동물 동반여행 — 동반등록 콘텐츠(detailPetTour2) ∩ 음식점(areaBasedList2 type=39)."""
    if not DATA_GO_KR_SERVICE_KEY:
        return []
    try:
        pet_ids = {it["contentid"] for it in _kto_items(_PETTOUR_URL, {}) if it.get("contentid")}
        out: list[dict] = []
        for it in _kto_items(_AREA_BASED_URL, {"contentTypeId": _CONTENT_TYPE_RESTAURANT}):
            if it.get("contentid") not in pet_ids:
                continue  # 반려동물 동반 미등록 음식점 제외
            name = (it.get("title") or "").strip()
            try:
                lat, lng = float(it.get("mapy")), float(it.get("mapx"))
            except (TypeError, ValueError):
                continue
            if not name or lat == 0 or lng == 0:
                continue
            addr = (it.get("addr1") or "").strip()
            sido, sigungu = _region_tokens(addr)
            out.append({
                "name": name, "lat": lat, "lng": lng, "cuisine": "음식점",
                "phone": (it.get("tel") or "").strip() or None,
                "address": addr or None, "sido": sido, "sigungu": sigungu,
            })
        return out
    except Exception as e:  # noqa: BLE001 — API 실패 시 CSV 소스만으로 진행
        print(f"KTO 동반여행 음식점 조회 실패(생략): {e}")
        return []


def _norm(name: str) -> str:
    return "".join((name or "").split())


def _region_tokens(addr: str) -> tuple[str, str]:
    toks = (addr or "").split()
    return (toks[0] if toks else ""), (toks[1] if len(toks) > 1 else "")


def _load_images() -> dict[str, list[str]]:
    """식당명(정규화) → 이미지 URL 리스트(등장 순). cp949."""
    images: dict[str, list[str]] = {}
    try:
        with open(RESTAURANT_IMAGE_CSV_PATH, encoding="cp949", newline="") as f:
            for r in csv.DictReader(f):
                name = _norm(r.get("식당명") or "")
                url = (r.get("식당이미지(URL)") or "").strip()
                if name and url:
                    images.setdefault(name, []).append(url)
    except FileNotFoundError:
        print(f"이미지 CSV 없음: {RESTAURANT_IMAGE_CSV_PATH}")
    return images


def _load_petfriendly() -> set[str]:
    """펫동반 문화시설 CSV에서 전주 음식/카페 식당명(정규화) 집합. utf-8-sig."""
    names: set[str] = set()
    try:
        with open(PETPLACE_CSV_PATH, encoding="utf-8-sig", newline="") as f:
            for r in csv.DictReader(f):
                if "전주" not in (r.get("시군구 명칭") or ""):
                    continue
                cat = (r.get("카테고리2") or "") + (r.get("카테고리3") or "")
                if any(h in cat for h in _DINING_HINTS):
                    names.add(_norm(r.get("시설명") or ""))
    except FileNotFoundError:
        print(f"펫동반 CSV 없음: {PETPLACE_CSV_PATH}")
    return names


def _load_recommended() -> set[str]:
    """전주시 모범음식점 CSV에서 업소명(정규화) 집합. cp949."""
    names: set[str] = set()
    try:
        with open(RESTAURANT_MODEL_CSV_PATH, encoding="cp949", newline="") as f:
            for r in csv.DictReader(f):
                n = _norm(r.get("업소명") or "")
                if n:
                    names.add(n)
    except FileNotFoundError:
        print(f"모범음식점 CSV 없음: {RESTAURANT_MODEL_CSV_PATH}")
    return names


def main() -> None:
    if not DATABASE_URL:
        raise SystemExit("DATABASE_URL 미설정")

    images = _load_images()
    petfriendly = _load_petfriendly()
    recommended = _load_recommended()

    engine = create_engine(DATABASE_URL, echo=False)
    # 비파괴: 자식(restaurant_image) → 부모(restaurant) 순으로만 drop 후 재생성.
    RestaurantImageOrm.__table__.drop(engine, checkfirst=True)
    RestaurantOrm.__table__.drop(engine, checkfirst=True)
    Base.metadata.create_all(engine)

    with Session(engine) as s:
        # region 차원 룩업
        sigungu_lut: dict[str, int] = {}
        sido_lut: dict[str, int] = {}
        for rid, name, level in s.execute(select(Region.id, Region.name, Region.level)).all():
            if level == 2:
                sigungu_lut.setdefault(name, rid)
            elif level == 1:
                sido_lut.setdefault(name, rid)

        s.execute(delete(RestaurantImageOrm))
        s.execute(delete(RestaurantOrm))

        name_to_id: dict[str, int] = {}
        inserted = 0
        matched_region = 0
        pf_count = 0
        rec_count = 0
        with open(RESTAURANT_BASIC_CSV_PATH, encoding="utf-8-sig", newline="") as f:
            for r in csv.DictReader(f):
                if (r.get("식당상태") or "").strip() not in ("", "운영중"):
                    continue
                name = (r.get("식당명") or "").strip()
                lat_s = (r.get("식당위도") or "").strip()
                lng_s = (r.get("식당경도") or "").strip()
                if not (name and lat_s and lng_s):
                    continue
                try:
                    lat, lng = float(lat_s), float(lng_s)
                except (ValueError, TypeError):
                    continue
                road = (r.get("도로명주소") or "").strip()
                jibun = (r.get("지번주소") or "").strip()
                sido, sigungu = _region_tokens(road or jibun)
                region_id = sigungu_lut.get(sigungu) or sido_lut.get(sido)
                if region_id is not None:
                    matched_region += 1
                key = _norm(name)
                pet_friendly = key in petfriendly
                if pet_friendly:
                    pf_count += 1
                is_recommended = key in recommended
                if is_recommended:
                    rec_count += 1
                row = RestaurantOrm(
                    name=name,
                    latitude=lat,
                    longitude=lng,
                    region_id=region_id,
                    cuisine=(r.get("영업신고증업태명") or r.get("영업인허가명") or "음식점").strip() or None,
                    phone=(r.get("식당대표전화번호") or "").strip() or None,
                    road_address=road or None,
                    jibun_address=jibun or None,
                    status=(r.get("식당상태") or "").strip() or None,
                    thumbnail_url=(images.get(key) or [None])[0],  # 대표 이미지 역정규화(첫 장)
                    pet_friendly=pet_friendly,
                    recommended=is_recommended,
                )
                s.add(row)
                inserted += 1
                # 같은 이름이 여러 건이면 첫 건에 이미지 연결(이미지는 보조 데이터).
                name_to_id.setdefault(key, row)  # ORM 객체 보관 → flush 후 id 사용

        # ── 펫동반 식사 후보 보강(전국): 펫동반 문화시설 음식/카페 + KTO 동반여행 음식점 ──
        # 식사 슬롯은 펫동반 식당만 노출하므로, 실제 펫동반 식당을 직접 적재해 후보를 늘린다.
        pf_added = 0
        pf_dining = _load_petfriendly_dining() + _fetch_kto_pet_restaurants()
        for d in pf_dining:
            key = _norm(d["name"])
            if not key or key in name_to_id:
                continue  # 전주 CSV/이미 추가한 펫동반 후보와 중복 방지
            region_id = sigungu_lut.get(d["sigungu"]) or sido_lut.get(d["sido"])
            row = RestaurantOrm(
                name=d["name"], latitude=d["lat"], longitude=d["lng"],
                region_id=region_id, cuisine=d["cuisine"], phone=d["phone"],
                road_address=d["address"], jibun_address=None, status="운영중",
                thumbnail_url=None, pet_friendly=True, recommended=False,
            )
            s.add(row)
            name_to_id.setdefault(key, row)
            inserted += 1
            pf_count += 1
            pf_added += 1

        s.flush()  # restaurant id 채우기

        img_inserted = 0
        for key, orm in name_to_id.items():
            urls = images.get(key)
            if not urls:
                continue
            for seq, url in enumerate(urls, start=1):
                s.add(RestaurantImageOrm(restaurant_id=orm.id, seq=seq, url=url))
                img_inserted += 1

        s.commit()

    print(
        f"restaurant 적재 완료: {inserted}건 (region 매칭 {matched_region} / 펫동반 {pf_count}"
        f"[그중 보강 {pf_added}] / 모범 {rec_count}) · restaurant_image {img_inserted}건"
    )


if __name__ == "__main__":
    main()
