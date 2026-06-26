"""전국 도시공원 표준데이터 CSV → city_park 테이블 적재 (비파괴 additive).

ingest_animal_hospitals.py 패턴: city_park 한 테이블만 비우고 재적재한다. 좌표는
표준데이터에 WGS84(위도/경도)로 들어있어 변환 없이 저장. region 공유 차원은 주소→시군구/시도 룩업.
산책 부적합한 어린이공원은 적재에서 제외한다(전국의 약 절반).

실행: adapdog/ 에서  python scripts/ingest_city_parks.py
재실행 시 city_park만 전체 재적재(idempotent).
"""
from __future__ import annotations

import csv
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(os.path.dirname(__file__)), "apps"))
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from sqlalchemy import create_engine, delete, select
from sqlalchemy.orm import Session

from core.config import CITY_PARK_CSV_PATH, DATABASE_URL
from core.database.base import Base
from map.adapter.outbound.orm.city_park_orm import CityParkOrm
from map.adapter.outbound.orm.pet_place_orm import Region  # noqa: F401 — 공유 차원

_EXCLUDED_PARK_TYPES = ("어린이공원",)  # 놀이터성 — 산책 코스 후보에서 제외


def _region_tokens(addr: str) -> tuple[str, str]:
    toks = (addr or "").split()
    return (toks[0] if toks else ""), (toks[1] if len(toks) > 1 else "")


def main() -> None:
    if not DATABASE_URL:
        raise SystemExit("DATABASE_URL 미설정")

    engine = create_engine(DATABASE_URL, echo=False)
    CityParkOrm.__table__.drop(engine, checkfirst=True)
    Base.metadata.create_all(engine)

    with Session(engine) as s:
        sigungu_lut: dict[str, int] = {}
        sido_lut: dict[str, int] = {}
        for rid, name, level in s.execute(select(Region.id, Region.name, Region.level)).all():
            if level == 2:
                sigungu_lut.setdefault(name, rid)
            elif level == 1:
                sido_lut.setdefault(name, rid)

        s.execute(delete(CityParkOrm))

        inserted = 0
        matched_region = 0
        with open(CITY_PARK_CSV_PATH, encoding="cp949", newline="") as f:
            for r in csv.DictReader(f):
                ptype = (r.get("공원구분") or "").strip()
                if ptype in _EXCLUDED_PARK_TYPES:
                    continue
                name = (r.get("공원명") or "").strip()
                lat_s = (r.get("위도") or "").strip()
                lng_s = (r.get("경도") or "").strip()
                if not (name and lat_s and lng_s):
                    continue
                try:
                    lat, lng = float(lat_s), float(lng_s)
                except (ValueError, TypeError):
                    continue
                if lat == 0 or lng == 0:
                    continue
                road = (r.get("소재지도로명주소") or "").strip()
                jibun = (r.get("소재지지번주소") or "").strip()
                sido, sigungu = _region_tokens(road or jibun)
                region_id = sigungu_lut.get(sigungu) or sido_lut.get(sido)
                if region_id is not None:
                    matched_region += 1
                s.add(CityParkOrm(
                    name=name,
                    park_type=ptype or None,
                    latitude=lat,
                    longitude=lng,
                    region_id=region_id,
                    road_address=road or None,
                    jibun_address=jibun or None,
                    phone=(r.get("전화번호") or "").strip() or None,
                ))
                inserted += 1
        s.commit()

    print(f"city_park 적재 완료: {inserted}건 (region 매칭 {matched_region}건, 어린이공원 제외)")


if __name__ == "__main__":
    main()
