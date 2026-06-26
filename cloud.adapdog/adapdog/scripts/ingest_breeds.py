"""TheDogAPI 견종 데이터 → breed_catalog 테이블 적재 (한글 시드).

- 견종명/기질: scripts/breeds_ko.py 의 사람이 작성한 한글 사전으로 번역.
- 크기: TheDogAPI 체중(kg)에서 소/중/대 자동 분류.
- 체질: 한글 견종명에서 BreedTrait.from_breed 로 파생(단두종 등).

breed_catalog / breed_catalog_trait 두 테이블만 비우고 다시 채운다.
다른 테이블(account/pet/facility 등)은 절대 건드리지 않는다(drop_all 안 함).

원본: scripts/_breeds_raw.json (TheDogAPI /v1/breeds 덤프). 없으면 DOG_API_KEY로 재수집.
실행: adapdog/ 에서
    python scripts/ingest_breeds.py --dry-run   # DB 미접속, 매핑/통계만 출력
    python scripts/ingest_breeds.py             # breed_catalog 적재
"""
from __future__ import annotations

import argparse
import json
import os
import re
import sys
import urllib.request

sys.path.insert(0, os.path.join(os.path.dirname(os.path.dirname(__file__)), "apps"))
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
sys.path.insert(0, os.path.dirname(__file__))

from sqlalchemy import create_engine, delete, insert
from sqlalchemy.orm import Session

from breeds_ko import ADJ_KO, ALIASES, NAME_KO, SIZE_OVERRIDES
from core.config import DATABASE_URL, DOG_API_ENDPOINT, DOG_API_KEY
from core.database.base import Base
from map.domain.value_objects.pet_place_vo import PetSize
from map.domain.value_objects.safety_alert_vo import BreedTrait
from users.adapter.outbound.orm.breed_catalog_orm import BreedCatalog, BreedCatalogTrait
from users.domain.value_objects.breed_catalog_vo import normalize_breed

RAW_PATH = os.path.join(os.path.dirname(__file__), "_breeds_raw.json")


def _load_raw() -> list[dict]:
    """원본 덤프를 읽거나, 없으면 TheDogAPI에서 재수집한다."""
    if os.path.exists(RAW_PATH):
        with open(RAW_PATH, encoding="utf-8") as f:
            return json.load(f)
    if not DOG_API_KEY:
        sys.exit("원본 덤프도 없고 DOG_API_KEY도 없습니다. .env에 DOG_API_KEY를 설정하세요.")
    breeds, page = [], 0
    while True:
        req = urllib.request.Request(
            f"{DOG_API_ENDPOINT}?limit=100&page={page}", headers={"x-api-key": DOG_API_KEY}
        )
        with urllib.request.urlopen(req, timeout=30) as r:  # noqa: S310
            data = json.loads(r.read().decode("utf-8"))
        if not data:
            break
        breeds.extend(data)
        page += 1
        if page > 12:
            break
    return [
        {
            "name": b.get("name"),
            "weight_metric": (b.get("weight") or {}).get("metric"),
            "temperament": b.get("temperament"),
        }
        for b in breeds
    ]


def _size_from_weight(metric: str | None) -> PetSize:
    """체중 범위(kg)의 상한으로 크기 분류. 소형<=10, 중형<=25, 그 외 대형."""
    if not metric:
        return PetSize.UNKNOWN
    nums = [float(n) for n in re.findall(r"[\d.]+", metric)]
    if not nums or max(nums) <= 0:
        return PetSize.UNKNOWN
    upper = max(nums)
    if upper <= 10:
        return PetSize.SMALL
    if upper <= 25:
        return PetSize.MEDIUM
    return PetSize.LARGE


def _temperament_ko(en: str | None, unmapped: set[str]) -> str:
    """영문 기질(쉼표 구분) → 한글. 사전에 없는 형용사는 unmapped에 모아 보고."""
    out = []
    for raw in (en or "").split(","):
        token = raw.strip()
        if not token:
            continue
        ko = ADJ_KO.get(token.lower())
        if ko:
            out.append(ko)
        else:
            unmapped.add(token)
    return ", ".join(out)


def build_rows() -> tuple[list[dict], list[dict], list[str], set[str]]:
    """원본 → breed_catalog/trait 행 + (미매핑 견종명, 미매핑 형용사) 보고."""
    raw = _load_raw()
    unmapped_names: list[str] = []
    unmapped_adj: set[str] = set()
    seen: set[str] = set()
    catalog_rows: list[dict] = []
    trait_rows: list[dict] = []

    by_en: dict[str, dict] = {}  # 별칭이 참조할 원본 영문명 → 행
    for b in raw:
        name_en = b["name"]
        ko = NAME_KO.get(name_en)
        if not ko:
            unmapped_names.append(name_en)
            ko = name_en  # 폴백: 영문명 그대로 (시드는 되도록)
        key = normalize_breed(ko)
        if not key or key in seen:
            continue
        seen.add(key)
        row = {
            "breed": key,
            "display_name": ko,
            "size": SIZE_OVERRIDES.get(ko, _size_from_weight(b["weight_metric"]).value),
            "temperament": _temperament_ko(b["temperament"], unmapped_adj),
        }
        catalog_rows.append(row)
        by_en[name_en] = row
        for trait in BreedTrait.from_breed(ko):
            trait_rows.append({"breed": key, "trait": trait.value})

    # 흔한 약칭/별칭: 원본 종의 데이터를 복사해 별칭 키로도 적재
    for alias_ko, source_en in ALIASES.items():
        key = normalize_breed(alias_ko)
        src = by_en.get(source_en)
        if key in seen or src is None:
            continue
        seen.add(key)
        catalog_rows.append({"breed": key, "display_name": alias_ko, "size": src["size"], "temperament": src["temperament"]})
        for trait in BreedTrait.from_breed(alias_ko):
            trait_rows.append({"breed": key, "trait": trait.value})

    return catalog_rows, trait_rows, unmapped_names, unmapped_adj


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true", help="DB 미접속, 매핑/통계만 출력")
    args = parser.parse_args()

    catalog_rows, trait_rows, unmapped_names, unmapped_adj = build_rows()

    print(f"적재 대상: 견종 {len(catalog_rows)}종, 체질 {len(trait_rows)}건")
    from collections import Counter
    size_dist = Counter(r["size"] for r in catalog_rows)
    print("크기 분포:", dict(size_dist))
    if unmapped_names:
        print(f"⚠ 미매핑 견종명 {len(unmapped_names)}개(영문 폴백):", unmapped_names[:20])
    if unmapped_adj:
        print(f"⚠ 미매핑 기질 형용사:", sorted(unmapped_adj))
    # 샘플 몇 종
    sample_keys = {normalize_breed(k) for k in ("시츄", "골든 리트리버", "퍼그", "프렌치 불독", "진돗개")}
    for r in catalog_rows:
        if r["breed"] in sample_keys:
            tr = [t["trait"] for t in trait_rows if t["breed"] == r["breed"]]
            print(f"  샘플 {r['breed']}: size={r['size']} traits={tr} temperament={r['temperament']}")

    if args.dry_run:
        print("[dry-run] DB 적재 생략.")
        return

    if not DATABASE_URL:
        sys.exit("DATABASE_URL이 없습니다. .env를 확인하세요(적재하려면 DB 필요).")

    engine = create_engine(DATABASE_URL)
    # breed_catalog 두 테이블만 (없으면) 생성 — 다른 테이블은 metadata에 없으므로 영향 없음.
    Base.metadata.create_all(engine, tables=[BreedCatalog.__table__, BreedCatalogTrait.__table__])
    with Session(engine) as s:
        # 기존 시드만 제거 후 재적재
        s.execute(delete(BreedCatalogTrait))
        s.execute(delete(BreedCatalog))
        s.execute(insert(BreedCatalog), catalog_rows)
        if trait_rows:
            s.execute(insert(BreedCatalogTrait), trait_rows)
        s.commit()
    print(f"✅ 적재 완료: breed_catalog {len(catalog_rows)}행, breed_catalog_trait {len(trait_rows)}행")


if __name__ == "__main__":
    main()
