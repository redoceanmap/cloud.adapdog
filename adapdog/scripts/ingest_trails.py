"""전국길관광정보 표준데이터 CSV → walking_trail 테이블 적재 (비파괴 additive).

ingest_facilities.py와 달리 drop_all을 하지 않는다. walking_trail 한 테이블만
비우고 다시 채우므로 pet_place/region 등 기존 시드를 보존한다. region 공유 차원은
이미 적재돼 있다고 가정하고(없으면 region_id=NULL), 주소→시군구/시도 이름으로 매칭한다.

실행: adapdog/ 에서  python scripts/ingest_trails.py
재실행 시 walking_trail만 전체 재적재(idempotent).
"""
from __future__ import annotations

import csv
import io
import os
import re
import sys

sys.path.insert(0, os.path.join(os.path.dirname(os.path.dirname(__file__)), "apps"))
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from sqlalchemy import create_engine, delete, select
from sqlalchemy.orm import Session

from core.config import DATABASE_URL
from core.database.base import Base
from map.adapter.outbound.orm.pet_place_orm import Region  # noqa: F401 — region 차원
from map.adapter.outbound.orm.walking_trail_orm import WalkingTrailOrm

CSV_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "csv")
TRAIL_CSV = os.path.join(CSV_DIR, "전국길관광정보표준데이터.csv")

# CSV 컬럼 인덱스 (헤더: 길명·길소개·총길이·총소요시간·시작지점명·시작지점도로명주소·시작지점소재지지번주소·종료지점명·…·경로정보)
C_NAME, C_DESC, C_LENGTH, C_DURATION = 0, 1, 2, 3
C_START_ROAD, C_START_JIBUN = 5, 6
C_ROUTE = 10  # 경로정보("A→B→C")


def _read_rows() -> list[list[str]]:
    raw = open(TRAIL_CSV, "rb").read()
    txt = raw.decode("cp949", errors="replace")
    return list(csv.reader(io.StringIO(txt)))


def _float(s: str) -> float:
    m = re.search(r"\d+(?:\.\d+)?", s or "")
    return float(m.group()) if m else 0.0


def _difficulty(km: float) -> str:
    if km < 3:
        return "쉬움"
    if km < 6:
        return "보통"
    return "어려움"


def _region_tokens(addr: str) -> tuple[str, str]:
    """주소 첫 두 토큰 = (시도, 시군구). ingest_facilities._region_from_address와 동일 규칙."""
    toks = (addr or "").split()
    return (toks[0] if toks else ""), (toks[1] if len(toks) > 1 else "")


def main() -> None:
    if not DATABASE_URL:
        raise SystemExit("DATABASE_URL 미설정")

    engine = create_engine(DATABASE_URL, echo=False)
    # 비파괴: walking_trail 한 테이블만 drop→recreate(스키마 변경 반영). 다른 테이블은 건드리지 않는다.
    WalkingTrailOrm.__table__.drop(engine, checkfirst=True)
    Base.metadata.create_all(engine)

    rows = _read_rows()[1:]  # 헤더 제외
    with Session(engine) as s:
        # 기존 region 차원 룩업 (시군구=level2, 시도=level1)
        sigungu_lut: dict[str, int] = {}
        sido_lut: dict[str, int] = {}
        for rid, name, level in s.execute(select(Region.id, Region.name, Region.level)).all():
            if level == 2:
                sigungu_lut.setdefault(name, rid)
            elif level == 1:
                sido_lut.setdefault(name, rid)

        # walking_trail만 비우고 재적재
        s.execute(delete(WalkingTrailOrm))

        inserted = 0
        matched = 0
        for r in rows:
            if len(r) <= C_DURATION:
                continue
            name = (r[C_NAME] or "").strip()
            if not name:
                continue
            km = _float(r[C_LENGTH])
            addr = (r[C_START_ROAD] if len(r) > C_START_ROAD else "").strip() \
                or (r[C_START_JIBUN] if len(r) > C_START_JIBUN else "").strip()
            sido, sigungu = _region_tokens(addr)
            region_id = sigungu_lut.get(sigungu) or sido_lut.get(sido)
            if region_id is not None:
                matched += 1
            s.add(WalkingTrailOrm(
                region_id=region_id,
                name=name,
                distance_km=km,
                difficulty=_difficulty(km),
                duration=(r[C_DURATION] or "").strip(),
                path_geojson="",
                route_info=(r[C_ROUTE] if len(r) > C_ROUTE else "").strip(),
                description=(r[C_DESC] or "").strip(),
            ))
            inserted += 1
        s.commit()

    print(f"walking_trail 적재 완료: {inserted}건 (region 매칭 {matched}건 / NULL {inserted - matched}건)")


if __name__ == "__main__":
    main()
