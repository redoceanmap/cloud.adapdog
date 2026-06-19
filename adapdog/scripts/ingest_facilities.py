"""CSV(추후 API) → 3NF Postgres 적재 파이프라인.

공유 region/category 차원을 빌드하고 facility/정책/허용크기/무장애요소를 정규화 적재한다.
실행: adapdog/ 에서  python scripts/ingest_facilities.py
재실행 시 전체 재적재(drop_all + create_all).
"""
from __future__ import annotations

import csv
import json
import os
import sys
import urllib.parse
import urllib.request
from urllib.parse import urlparse

sys.path.insert(0, os.path.join(os.path.dirname(os.path.dirname(__file__)), "apps"))
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from pyproj import Transformer
from sqlalchemy import create_engine, insert
from sqlalchemy.orm import Session

from core.config import DATABASE_URL, DATA_GO_KR_SERVICE_KEY
from core.database.base import Base
from map.adapter.outbound.orm.inclusive_filter_orm import BarrierFreeFacility, BarrierFreeFeature
from map.adapter.outbound.orm.pet_place_orm import (
    Category,
    Facility,
    FacilityAllowedPetSize,
    FacilityPetPolicy,
    Region,
)
from map.domain.value_objects.pet_place_vo import PetSize

CSV_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "csv")
PET_CSV = os.path.join(CSV_DIR, "한국문화정보원_전국 반려동물 동반 가능 문화시설 위치 데이터_20250324.csv")
BF_CSV = os.path.join(CSV_DIR, "한국문화정보원_전국 배리어프리 문화예술관광지_20221125.csv")
VET_CSV = os.path.join(CSV_DIR, "동물_동물병원.csv")

# KTO(한국관광공사) 실시간 API. data.go.kr 일반 인증키(DATA_GO_KR_SERVICE_KEY) 공통 사용.
_GOCAMPING_URL = "https://apis.data.go.kr/B551011/GoCamping/basedList"
_PETTOUR_URL = "https://apis.data.go.kr/B551011/KorService2/detailPetTour2"
_AREA_BASED_URL = "https://apis.data.go.kr/B551011/KorService2/areaBasedList2"
_KTO_COMMON = {"_type": "json", "MobileOS": "ETC", "MobileApp": "adapdog"}

_TRUTHY = {"Y", "y", "있음", "가능", "유", "O", "o", "1", "true"}

# LOCALDATA(지방행정 인허가) 좌표계 = 보정 중부원점TM(EPSG:5174) → WGS84 위경도.
_TM_TO_WGS84 = Transformer.from_crs("EPSG:5174", "EPSG:4326", always_xy=True)


def _truthy(v: str | None) -> bool:
    return bool(v) and v.strip() in _TRUTHY


def _coord(lat: str | None, lng: str | None) -> tuple[float, float] | None:
    try:
        la, lo = float(lat), float(lng)  # type: ignore[arg-type]
    except (TypeError, ValueError):
        return None
    if -90 <= la <= 90 and -180 <= lo <= 180 and not (la == 0 and lo == 0):
        return la, lo
    return None


def _tm_coord(x: str | None, y: str | None) -> tuple[float, float] | None:
    """LOCALDATA TM 좌표(X=동, Y=북) → (위도, 경도). 빈 값/한반도 밖이면 None."""
    try:
        lng, lat = _TM_TO_WGS84.transform(float(x), float(y))  # type: ignore[arg-type]
    except (TypeError, ValueError):
        return None
    if 33 <= lat <= 39 and 124 <= lng <= 132:
        return lat, lng
    return None


def _region_from_address(addr: str) -> tuple[str, str]:
    """주소 첫 두 토큰 = (시도, 시군구). vet CSV엔 행정구역 컬럼이 없어 주소에서 파싱."""
    tokens = (addr or "").split()
    sido = tokens[0] if tokens else ""
    sigungu = tokens[1] if len(tokens) > 1 else ""
    return sido, sigungu


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


def _ingest_gocamping(dim: "DimensionBuilder", facility_rows: list[dict],
                      policy_rows: list[dict], size_rows: list[dict], start_fid: int) -> int:
    """고캠핑(15101933) → facility. 반려동물 동반 가능 캠핑장만, 예약 URL 보관."""
    fid = start_fid
    count = 0
    for it in _kto_items(_GOCAMPING_URL, {}):
        animal = (it.get("animalCmgCl") or "").strip()
        if not animal or "불가" in animal or "가능" not in animal:
            continue
        c = _coord(it.get("mapY"), it.get("mapX"))
        name = (it.get("facltNm") or "").strip()
        if c is None or not name:
            continue
        sido, sigungu = _region_from_address(it.get("addr1", ""))
        fid += 1
        count += 1
        facility_rows.append({
            "id": fid, "name": name, "latitude": c[0], "longitude": c[1],
            "region_id": dim.region_id(sido, sigungu),
            "category_id": dim.category_id("캠핑", (it.get("induty") or "").strip(), ""),
            "road_address": (it.get("addr1") or "").strip() or None,
            "jibun_address": None,
            "phone": (it.get("tel") or "").strip() or None,
            "operating_hours": None,
            "homepage": (it.get("resveUrl") or it.get("homepage") or "").strip() or None,
        })
        policy_rows.append({
            "facility_id": fid, "companion_allowed": True,
            "restriction": animal if "가능(" in animal else None,
            "extra_fee": None, "indoor": False, "outdoor": True,
        })
        for sz in PetSize.parse_allowed(animal):
            size_rows.append({"facility_id": fid, "pet_size": sz.value})
    print(f"고캠핑: facility={count} (반려동물 가능만)")
    return fid


def _ingest_pettour(dim: "DimensionBuilder", facility_rows: list[dict],
                    policy_rows: list[dict], size_rows: list[dict], start_fid: int) -> int:
    """반려동물 동반여행(KorService2). 동반등록 콘텐츠(detailPetTour2)와 전국 숙박을 조인."""
    pet_info = {it["contentid"]: it for it in _kto_items(_PETTOUR_URL, {}) if it.get("contentid")}
    fid = start_fid
    count = 0
    for it in _kto_items(_AREA_BASED_URL, {"contentTypeId": 32}):
        info = pet_info.get(it.get("contentid"))
        if info is None:
            continue  # 반려동물 동반 미등록 숙소 제외
        c = _coord(it.get("mapy"), it.get("mapx"))
        name = (it.get("title") or "").strip()
        if c is None or not name:
            continue
        sido, sigungu = _region_from_address(it.get("addr1", ""))
        fid += 1
        count += 1
        restriction = " / ".join(p for p in (
            (info.get("acmpyTypeCd") or "").strip(),
            (info.get("acmpyNeedMtr") or "").strip(),
            (info.get("etcAcmpyInfo") or "").strip(),
        ) if p) or None
        facility_rows.append({
            "id": fid, "name": name, "latitude": c[0], "longitude": c[1],
            "region_id": dim.region_id(sido, sigungu),
            "category_id": dim.category_id("숙박", "", ""),
            "road_address": (it.get("addr1") or "").strip() or None,
            "jibun_address": None,
            "phone": (it.get("tel") or "").strip() or None,
            "operating_hours": None,
            "homepage": None,
        })
        policy_rows.append({
            "facility_id": fid, "companion_allowed": True,
            "restriction": restriction, "extra_fee": None,
            "indoor": True, "outdoor": False,
        })
        for sz in PetSize.parse_allowed(info.get("acmpyPsblCpam")):
            size_rows.append({"facility_id": fid, "pet_size": sz.value})
    print(f"반려동물 동반여행 숙박: facility={count} (동반등록 매칭)")
    return fid


class DimensionBuilder:
    """region / category 차원을 lazy 생성하며 leaf id를 돌려준다 (자기참조 계층)."""

    def __init__(self) -> None:
        self.region_rows: list[dict] = []
        self.category_rows: list[dict] = []
        self._region: dict[tuple, int] = {}
        self._category: dict[tuple, int] = {}
        self._rid = 0
        self._cid = 0

    def _node(self, rows: list[dict], cache: dict, counter_attr: str, key: tuple, name: str, level: int, parent: int | None) -> int:
        if key in cache:
            return cache[key]
        nid = getattr(self, counter_attr) + 1
        setattr(self, counter_attr, nid)
        rows.append({"id": nid, "name": name, "level": level, "parent_id": parent})
        cache[key] = nid
        return nid

    def region_id(self, sido: str, sigungu: str) -> int | None:
        sido = (sido or "").strip()
        sigungu = (sigungu or "").strip()
        if not sido:
            return None
        sido_id = self._node(self.region_rows, self._region, "_rid", ("1", sido), sido, 1, None)
        if not sigungu:
            return sido_id
        return self._node(self.region_rows, self._region, "_rid", ("2", sido, sigungu), sigungu, 2, sido_id)

    def category_id(self, c1: str, c2: str, c3: str) -> int | None:
        levels = [(c1 or "").strip(), (c2 or "").strip(), (c3 or "").strip()]
        parent: int | None = None
        leaf: int | None = None
        path: tuple = ()
        for lvl, name in enumerate(levels, start=1):
            if not name:
                break
            path = path + (name,)
            leaf = self._node(self.category_rows, self._category, "_cid", path, name, lvl, parent)
            parent = leaf
        return leaf


def _confirm_drop() -> None:
    """drop_all은 전 테이블을 삭제하므로, 대상 DB를 보여주고 확인받는다(`--yes`로 우회)."""
    if "--yes" in sys.argv or "-y" in sys.argv:
        return
    host = urlparse(DATABASE_URL.replace("+psycopg", "")).hostname or "?"
    ans = input(f"⚠️  '{host}' 의 모든 테이블을 DROP 후 재적재합니다. 계속하려면 'yes' 입력: ")
    if ans.strip().lower() != "yes":
        raise SystemExit("취소됨.")


def ingest() -> None:
    if not DATABASE_URL:
        raise SystemExit("DATABASE_URL 미설정")
    _confirm_drop()
    engine = create_engine(DATABASE_URL, echo=False)
    print("테이블 재생성...")
    Base.metadata.drop_all(engine)
    Base.metadata.create_all(engine)

    dim = DimensionBuilder()
    facility_rows: list[dict] = []
    policy_rows: list[dict] = []
    size_rows: list[dict] = []
    bf_rows: list[dict] = []
    feat_rows: list[dict] = []

    # ── pet_place (15111389) ──
    fid = 0
    with open(PET_CSV, encoding="utf-8-sig", newline="") as f:
        for r in csv.DictReader(f):
            c = _coord(r.get("위도"), r.get("경도"))
            if c is None or not (r.get("시설명") or "").strip():
                continue
            fid += 1
            facility_rows.append({
                "id": fid, "name": r["시설명"].strip(), "latitude": c[0], "longitude": c[1],
                "region_id": dim.region_id(r.get("시도 명칭", ""), r.get("시군구 명칭", "")),
                "category_id": dim.category_id(r.get("카테고리1", ""), r.get("카테고리2", ""), r.get("카테고리3", "")),
                "road_address": (r.get("도로명주소") or "").strip() or None,
                "jibun_address": (r.get("지번주소") or "").strip() or None,
                "phone": (r.get("전화번호") or "").strip() or None,
                "operating_hours": (r.get("운영시간") or "").strip() or None,
                "homepage": (r.get("홈페이지") or "").strip() or None,
            })
            policy_rows.append({
                "facility_id": fid,
                "companion_allowed": _truthy(r.get("반려동물 동반 가능정보")),
                "restriction": (r.get("반려동물 제한사항") or "").strip() or None,
                "extra_fee": (r.get("애견 동반 추가 요금") or "").strip() or None,
                "indoor": _truthy(r.get("장소(실내) 여부")),
                "outdoor": _truthy(r.get("장소(실외)여부")),
            })
            for sz in PetSize.parse_allowed(r.get("입장 가능 동물 크기")):
                size_rows.append({"facility_id": fid, "pet_size": sz.value})
    print(f"pet_place: facility={len(facility_rows)} sizes={len(size_rows)}")

    # ── 동물병원 (LOCALDATA) → 같은 facility 테이블, category=동물병원 ──
    vet_cat = dim.category_id("동물병원", "", "")
    vet_count = 0
    with open(VET_CSV, encoding="cp949", newline="") as f:
        for r in csv.DictReader(f):
            if not (r.get("영업상태명") or "").strip().startswith("영업"):
                continue  # 폐업/말소 제외
            c = _tm_coord(r.get("좌표정보(X)"), r.get("좌표정보(Y)"))
            name = (r.get("사업장명") or "").strip()
            if c is None or not name:
                continue
            road = (r.get("도로명주소") or "").strip()
            jibun = (r.get("지번주소") or "").strip()
            sido, sigungu = _region_from_address(road or jibun)
            fid += 1
            vet_count += 1
            facility_rows.append({
                "id": fid, "name": name, "latitude": c[0], "longitude": c[1],
                "region_id": dim.region_id(sido, sigungu),
                "category_id": vet_cat,
                "road_address": road or None,
                "jibun_address": jibun or None,
                "phone": (r.get("전화번호") or "").strip() or None,
                "operating_hours": None,
                "homepage": None,
            })
            policy_rows.append({
                "facility_id": fid, "companion_allowed": True, "restriction": None,
                "extra_fee": None, "indoor": True, "outdoor": False,
            })
            for sz in PetSize.all_sizes():
                size_rows.append({"facility_id": fid, "pet_size": sz.value})
    print(f"동물병원: facility={vet_count} (영업중만)")

    # ── 고캠핑 + 반려동물 동반여행 숙박 (KTO 실시간 API) ──
    if DATA_GO_KR_SERVICE_KEY:
        fid = _ingest_gocamping(dim, facility_rows, policy_rows, size_rows, fid)
        fid = _ingest_pettour(dim, facility_rows, policy_rows, size_rows, fid)
    else:
        print("DATA_GO_KR_SERVICE_KEY 미설정 → 고캠핑/반려동물동반여행 적재 생략")

    # ── barrier_free (15111386) ──
    bid = 0
    feature_map = {
        "휠체어 대여 가능 여부": "wheelchair",
        "장애인 전용 주차장 여부": "parking",
        "점자 가이드 여부": "braille",
        "장애인 화장실 유무": "restroom",
    }
    with open(BF_CSV, encoding="utf-8-sig", newline="") as f:
        for r in csv.DictReader(f):
            c = _coord(r.get("위도"), r.get("경도"))
            if c is None or not (r.get("시설명") or "").strip():
                continue
            bid += 1
            bf_rows.append({
                "id": bid, "name": r["시설명"].strip(), "latitude": c[0], "longitude": c[1],
                "region_id": dim.region_id(r.get("시도 명칭", ""), r.get("시군구 명칭", "")),
                "category_id": dim.category_id(r.get("카테고리1", ""), r.get("카테고리2", ""), r.get("카테고리3", "")),
                "road_address": (r.get("도로명주소") or "").strip() or None,
            })
            for col, code in feature_map.items():
                if _truthy(r.get(col)):
                    feat_rows.append({"facility_id": bid, "feature_code": code})
    print(f"barrier_free: facility={len(bf_rows)} features={len(feat_rows)}")

    # ── 벌크 적재 ──
    with Session(engine) as s:
        if dim.region_rows:
            s.execute(insert(Region), dim.region_rows)
        if dim.category_rows:
            s.execute(insert(Category), dim.category_rows)
        for table, rows in [
            (Facility, facility_rows), (FacilityPetPolicy, policy_rows),
            (FacilityAllowedPetSize, size_rows),
            (BarrierFreeFacility, bf_rows), (BarrierFreeFeature, feat_rows),
        ]:
            for i in range(0, len(rows), 5000):
                s.execute(insert(table), rows[i:i + 5000])
        s.commit()
    print(f"적재 완료: region={len(dim.region_rows)} category={len(dim.category_rows)}")


if __name__ == "__main__":
    ingest()
