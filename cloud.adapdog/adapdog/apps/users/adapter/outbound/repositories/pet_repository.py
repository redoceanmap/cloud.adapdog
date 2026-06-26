from __future__ import annotations

from collections import defaultdict

from sqlalchemy import select

from core.database import session as dbs
from users.adapter.outbound.mappers.pet_mapper import PetMapper
from users.adapter.outbound.orm.pet_orm import PetOrm, PetTraitOrm
from users.app.ports.output.pet_port import PetPort
from users.domain.entities.pet_entity import Pet


class InMemoryPetRepository(PetPort):
    """DB 없이 부팅할 때 쓰는 인메모리 구현(개발/데모)."""

    def __init__(self) -> None:
        self._by_id: dict[int, Pet] = {}
        self._seq = 0

    async def save(self, pet: Pet) -> Pet:
        self._seq += 1
        pet.id = self._seq
        self._by_id[self._seq] = pet
        return pet

    async def find_by_account(self, account_id: int) -> list[Pet]:
        return [p for p in self._by_id.values() if p.account_id == account_id]

    async def find_by_id(self, pet_id: int) -> Pet | None:
        return self._by_id.get(pet_id)

    async def update(self, pet: Pet) -> Pet:
        if pet.id is None or pet.id not in self._by_id:
            raise KeyError(f"pet {pet.id} not found")
        self._by_id[pet.id] = pet
        return pet


class DbPetRepository(PetPort):
    """pet 테이블 기반 구현 (3NF: 체질은 pet_trait에 분리 저장)."""

    async def save(self, pet: Pet) -> Pet:
        async with dbs.get_session_factory()() as s:
            row = PetMapper.to_orm(pet)
            s.add(row)
            await s.flush()
            for t in pet.traits:
                s.add(PetTraitOrm(pet_id=row.id, trait=t.value))
            await s.commit()
            await s.refresh(row)
            pet.id = row.id
        return pet

    async def find_by_account(self, account_id: int) -> list[Pet]:
        async with dbs.get_session_factory()() as s:
            rows = (await s.execute(
                select(PetOrm).where(PetOrm.account_id == account_id)
            )).scalars().all()
            if not rows:
                return []
            ids = [r.id for r in rows]
            traits: dict[int, set[str]] = defaultdict(set)
            for pid, t in (await s.execute(
                select(PetTraitOrm.pet_id, PetTraitOrm.trait).where(PetTraitOrm.pet_id.in_(ids))
            )).all():
                traits[pid].add(t)
        return [PetMapper.to_entity(r, traits[r.id]) for r in rows]

    async def find_by_id(self, pet_id: int) -> Pet | None:
        async with dbs.get_session_factory()() as s:
            row = await s.get(PetOrm, pet_id)
            if row is None:
                return None
            trait_rows = (await s.execute(
                select(PetTraitOrm.trait).where(PetTraitOrm.pet_id == pet_id)
            )).scalars().all()
        return PetMapper.to_entity(row, set(trait_rows))

    async def update(self, pet: Pet) -> Pet:
        if pet.id is None:
            raise ValueError("pet id is required for update")
        async with dbs.get_session_factory()() as s:
            row = await s.get(PetOrm, pet.id)
            if row is None:
                raise KeyError(f"pet {pet.id} not found")
            row.name = pet.name
            row.breed = pet.breed
            row.photo_url = pet.photo_url
            row.size = pet.size.value
            row.temperament = pet.temperament
            row.birth_year = pet.birth_year
            row.gender = pet.gender.value
            row.features = pet.features
            await s.commit()
            await s.refresh(row)
        return pet
