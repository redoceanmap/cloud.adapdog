"""체리(pet_id=1) 발자국 데모 시드 — 전주 일대 방문기록(pet_activity).

visited-place 슬라이스는 pet_activity(action_type=visit) ⋈ facility 집계라, 데모 펫의
방문 로그가 없으면 빈 발자국을 준다. 여기서는 체리가 전주의 카페·여행지·박물관 등을
한 해에 걸쳐 다녀온 로그를 쌓는다(날짜 분산). 멱등: 재실행하면 체리 방문을 정리하고 다시 만든다.
"""
from __future__ import annotations

import asyncio
import os
import sys
from datetime import datetime, timedelta, timezone

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, ".."))
sys.path.insert(0, os.path.join(HERE, "..", "apps"))

from sqlalchemy import delete, select  # noqa: E402

from core.database.session import get_session_factory, init_engine  # noqa: E402
from map.adapter.outbound.orm.pet_place_orm import Category, Facility, Region  # noqa: E402
from users.adapter.outbound.orm.pet_activity_orm import PetActivityOrm  # noqa: E402
from users.adapter.outbound.orm.pet_orm import PetOrm  # noqa: E402

DEMO_PET_ID = 1
# 다양한 카테고리에서 고르게 — '발자국'이 여러 종류의 장소를 도는 인상.
DEMO_CATEGORIES = ["여행지", "카페", "박물관", "미술관", "문화·예술", "공원"]
PER_CATEGORY = 3
TARGET = 14  # 데모 발자국 개수 상한


async def main() -> None:
    init_engine()
    factory = get_session_factory()
    async with factory() as db:
        pet = await db.scalar(select(PetOrm).where(PetOrm.id == DEMO_PET_ID))
        if not pet:
            print(f"pet_id={DEMO_PET_ID} 가 없어요 — 온보딩으로 데모 펫을 먼저 만들어 주세요.")
            return

        # 1) 멱등: 체리의 기존 방문 로그 정리
        await db.execute(
            delete(PetActivityOrm).where(PetActivityOrm.pet_id == DEMO_PET_ID)
        )

        # 2) 전주 시설을 카테고리별로 고르게 수집
        jeonju_region_ids = (
            await db.scalars(select(Region.id).where(Region.name.like("%전주%")))
        ).all()
        if not jeonju_region_ids:
            print("전주 region 을 찾지 못했어요 — region 데이터 확인 필요")
            return

        rows: list = []
        seen: set[int] = set()
        for cat in DEMO_CATEGORIES:
            picked = (
                await db.execute(
                    select(Facility.id, Facility.name, Category.name)
                    .join(Category, Category.id == Facility.category_id)
                    .where(
                        Facility.region_id.in_(jeonju_region_ids),
                        Category.name == cat,
                        Facility.latitude.isnot(None),
                        Facility.longitude.isnot(None),
                    )
                    .order_by(Facility.id)
                    .limit(PER_CATEGORY)
                )
            ).all()
            for r in picked:
                if r[0] not in seen:
                    seen.add(r[0])
                    rows.append(r)
        rows = rows[:TARGET]
        if not rows:
            print("전주 데모 시설을 찾지 못했어요 — region/category 데이터 확인 필요")
            return

        # 3) 한 해에 걸쳐 방문 — 첫 방문일을 분산(약 24일 간격), 일부는 재방문(2회)
        base = datetime(2025, 3, 14, tzinfo=timezone.utc)
        for i, (fid, _name, _cat) in enumerate(rows):
            first = base + timedelta(days=i * 24)
            db.add(PetActivityOrm(
                pet_id=DEMO_PET_ID, facility_id=fid, action_type="visit", occurred_at=first,
            ))
            if i % 3 == 0:  # 3곳마다 한 번은 재방문
                db.add(PetActivityOrm(
                    pet_id=DEMO_PET_ID, facility_id=fid, action_type="visit",
                    occurred_at=first + timedelta(days=40),
                ))

        await db.commit()
        print(f"시드 완료 — 체리(pet_id={DEMO_PET_ID}) 발자국 {len(rows)}곳:")
        for (fid, name, cat) in rows:
            print(f"  · {name} ({cat})")


if __name__ == "__main__":
    asyncio.run(main())
