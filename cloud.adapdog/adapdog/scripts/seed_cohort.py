"""C12 닮은친구(코호트) 데모용 pet_activity 시드 — 전주 데모 시설 기준.

cohort-recommendation은 pet_activity ⋈ pet ⋈ facility 집계라, 누적 행동 데이터가
없으면 빈 추천을 준다. 데모를 위해 size=large 코호트가 전주의 카페·여행지·박물관 등을
차등 방문한 로그를 쌓는다. 멱등: 재실행하면 이전 시드를 정리하고 다시 만든다.
"""
from __future__ import annotations

import asyncio
import os
import sys
from datetime import datetime, timezone

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, ".."))
sys.path.insert(0, os.path.join(HERE, "..", "apps"))

from sqlalchemy import delete, select  # noqa: E402

from core.database.session import get_session_factory, init_engine  # noqa: E402
from map.adapter.outbound.orm.pet_place_orm import Category, Facility, Region  # noqa: E402
from users.adapter.outbound.orm.account_orm import AccountOrm  # noqa: E402
from users.adapter.outbound.orm.pet_activity_orm import PetActivityOrm  # noqa: E402
from users.adapter.outbound.orm.pet_orm import PetOrm  # noqa: E402

SEED_EMAIL = "cohort_seed@adapdog.dev"
DEMO_CATEGORIES = ["여행지", "카페", "박물관", "미술관", "펜션"]


async def main() -> None:
    init_engine()
    factory = get_session_factory()
    async with factory() as db:
        # 1) 이전 시드 정리 (멱등)
        seed_acc = await db.scalar(select(AccountOrm).where(AccountOrm.email == SEED_EMAIL))
        if seed_acc:
            pet_ids = (await db.scalars(select(PetOrm.id).where(PetOrm.account_id == seed_acc.id))).all()
            if pet_ids:
                await db.execute(delete(PetActivityOrm).where(PetActivityOrm.pet_id.in_(pet_ids)))
                await db.execute(delete(PetOrm).where(PetOrm.id.in_(pet_ids)))
            await db.execute(delete(AccountOrm).where(AccountOrm.id == seed_acc.id))
            await db.flush()

        # 2) 전주 데모 시설 6곳 (카페·여행지·박물관 등 다양하게)
        jeonju_region_ids = (
            await db.scalars(select(Region.id).where(Region.name.like("%전주%")))
        ).all()
        rows: list = []
        for cat in DEMO_CATEGORIES:  # 카테고리별로 고르게 섞는다
            picked = (
                await db.execute(
                    select(Facility.id, Facility.name, Category.name)
                    .join(Category, Category.id == Facility.category_id)
                    .where(Facility.region_id.in_(jeonju_region_ids), Category.name == cat)
                    .order_by(Facility.id)
                    .limit(2)
                )
            ).all()
            rows.extend(picked)
        rows = rows[:6]
        if not rows:
            print("전주 데모 시설을 찾지 못했어요 — region/category 데이터 확인 필요")
            return

        now = datetime.now(timezone.utc)
        account = AccountOrm(
            email=SEED_EMAIL, password_hash="seed", nickname="코호트 시드", created_at=now,
        )
        db.add(account)
        await db.flush()

        pets = [
            PetOrm(
                account_id=account.id, name=f"대형견 친구{i}", breed="골든 리트리버",
                photo_url="", size="large", temperament="사교형",
                birth_year=2021, gender="unknown", features=None,
            )
            for i in range(6)
        ]
        db.add_all(pets)
        await db.flush()

        # 앞쪽 시설일수록 인기(방문 수 큼) → 닮은친구 추천 순위
        weights = [6, 5, 4, 3, 2, 1]
        for (fid, _name, _cat), weight in zip(rows, weights):
            for pet in pets[:weight]:
                db.add(PetActivityOrm(
                    pet_id=pet.id, facility_id=fid, action_type="visit", occurred_at=now,
                ))

        await db.commit()
        print("시드 완료 — 전주 데모 시설:")
        for (fid, name, cat), w in zip(rows, weights):
            print(f"  [{w}회] {name} ({cat})")


if __name__ == "__main__":
    asyncio.run(main())
