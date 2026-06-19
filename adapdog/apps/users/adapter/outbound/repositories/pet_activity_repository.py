from __future__ import annotations

from datetime import datetime, timezone

from sqlalchemy import select

from core.database import session as dbs
from users.adapter.outbound.mappers.pet_activity_mapper import PetActivityMapper
from users.adapter.outbound.orm.pet_activity_orm import PetActivityOrm
from users.app.ports.output.pet_activity_port import PetActivityPort
from users.domain.entities.pet_activity_entity import PetActivity


class InMemoryPetActivityRepository(PetActivityPort):
    """DB 없이 부팅할 때 쓰는 인메모리 구현(개발/데모)."""

    def __init__(self) -> None:
        self._items: list[PetActivity] = []
        self._seq = 0

    async def save(self, activity: PetActivity) -> PetActivity:
        self._seq += 1
        activity.id = self._seq
        if activity.occurred_at is None:
            activity.occurred_at = datetime.now(timezone.utc)
        self._items.append(activity)
        return activity

    async def find_by_pet(self, pet_id: int) -> list[PetActivity]:
        return [a for a in self._items if a.pet_id == pet_id]


class DbPetActivityRepository(PetActivityPort):
    """pet_activity 테이블 기반 구현."""

    async def save(self, activity: PetActivity) -> PetActivity:
        async with dbs.get_session_factory()() as s:
            row = PetActivityMapper.to_orm(activity)
            s.add(row)
            await s.commit()
            await s.refresh(row)
        return PetActivityMapper.to_entity(row)

    async def find_by_pet(self, pet_id: int) -> list[PetActivity]:
        async with dbs.get_session_factory()() as s:
            rows = (await s.execute(
                select(PetActivityOrm)
                .where(PetActivityOrm.pet_id == pet_id)
                .order_by(PetActivityOrm.occurred_at.desc())
            )).scalars().all()
        return [PetActivityMapper.to_entity(r) for r in rows]
