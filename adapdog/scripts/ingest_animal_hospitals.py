"""행안부 동물병원 표준데이터 CSV → animal_hospital 테이블 적재 (비파괴 additive).

ingest_trails.py 패턴: animal_hospital 한 테이블만 비우고 재적재한다. 좌표는
EPSG:2097(중부원점 TM, Bessel) → WGS84로 변환해 저장(레포의 _to_wgs84와 동일 변환).
region 공유 차원은 주소→시군구/시도 룩업.

실행: adapdog/ 에서  python scripts/ingest_animal_hospitals.py
재실행 시 animal_hospital만 전체 재적재(idempotent).
"""
from __future__ import annotations

import csv
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(os.path.dirname(__file__)), "apps"))
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from pyproj import Transformer
from sqlalchemy import create_engine, delete, select
from sqlalchemy.orm import Session

from core.config import ANIMAL_HOSPITAL_CSV_PATH, DATABASE_URL
from core.database.base import Base
from map.adapter.outbound.orm.animal_hospital_orm import AnimalHospitalOrm
from map.adapter.outbound.orm.pet_place_orm import Region  # noqa: F401 — 공유 차원

_TM_TO_WGS84 = Transformer.from_crs(2097, 4326, always_xy=True)


def _to_wgs84(x_raw: str, y_raw: str) -> tuple[float, float] | None:
    try:
        x, y = float(x_raw), float(y_raw)
    except (TypeError, ValueError):
        return None
    if x == 0 or y == 0:
        return None
    lng, lat = _TM_TO_WGS84.transform(x, y)
    if not (33.0 <= lat <= 39.5 and 124.0 <= lng <= 132.0):  # 한반도 밖이면 폐기
        return None
    return lat, lng


def _region_tokens(addr: str) -> tuple[str, str]:
    toks = (addr or "").split()
    return (toks[0] if toks else ""), (toks[1] if len(toks) > 1 else "")


def main() -> None:
    if not DATABASE_URL:
        raise SystemExit("DATABASE_URL 미설정")

    engine = create_engine(DATABASE_URL, echo=False)
    AnimalHospitalOrm.__table__.drop(engine, checkfirst=True)
    Base.metadata.create_all(engine)

    with Session(engine) as s:
        sigungu_lut: dict[str, int] = {}
        sido_lut: dict[str, int] = {}
        for rid, name, level in s.execute(select(Region.id, Region.name, Region.level)).all():
            if level == 2:
                sigungu_lut.setdefault(name, rid)
            elif level == 1:
                sido_lut.setdefault(name, rid)

        s.execute(delete(AnimalHospitalOrm))

        inserted = 0
        matched_region = 0
        with open(ANIMAL_HOSPITAL_CSV_PATH, encoding="cp949", newline="") as f:
            for r in csv.DictReader(f):
                name = (r.get("사업장명") or "").strip()
                if not name:
                    continue
                coord = _to_wgs84(r.get("좌표정보(X)", ""), r.get("좌표정보(Y)", ""))
                if coord is None:
                    continue
                lat, lng = coord
                road = (r.get("도로명주소") or "").strip()
                jibun = (r.get("지번주소") or "").strip()
                sido, sigungu = _region_tokens(road or jibun)
                region_id = sigungu_lut.get(sigungu) or sido_lut.get(sido)
                if region_id is not None:
                    matched_region += 1
                status = (r.get("영업상태명") or "").strip()
                s.add(AnimalHospitalOrm(
                    name=name,
                    latitude=lat,
                    longitude=lng,
                    region_id=region_id,
                    phone=(r.get("전화번호") or "").strip() or None,
                    road_address=(road or jibun) or None,
                    is_open=status in ("영업/정상", "영업"),
                ))
                inserted += 1
        s.commit()

    print(f"animal_hospital 적재 완료: {inserted}건 (region 매칭 {matched_region}건)")


if __name__ == "__main__":
    main()
