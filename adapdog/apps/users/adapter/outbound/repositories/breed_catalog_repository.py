from __future__ import annotations

from collections import defaultdict
from typing import Optional

from sqlalchemy import select

from core.database import session as dbs
from map.domain.value_objects.pet_place_vo import PetSize
from map.domain.value_objects.safety_alert_vo import BreedTrait
from users.adapter.outbound.mappers.breed_catalog_mapper import BreedCatalogMapper
from users.adapter.outbound.orm.breed_catalog_orm import BreedCatalog, BreedCatalogTrait
from users.app.ports.output.breed_catalog_port import BreedCatalogPort
from users.domain.entities.breed_catalog_entity import BreedProfile
from users.domain.value_objects.breed_catalog_vo import normalize_breed


# ── 큐레이션 카탈로그 (목 데이터원) ───────────────────────────────────────────
# 정식 견종명 → (표준 크기, 기질). 체질(단두종 등)은 BreedTrait.from_breed로 파생해
# 시설/안전 슬라이스와 동일한 판정 로직을 공유한다.
_CATALOG: dict[str, tuple[PetSize, str]] = {
    "푸들": (PetSize.SMALL, "영리하고 활발하며 훈련을 잘 받아들인다"),
    "말티즈": (PetSize.SMALL, "애교가 많고 사람을 잘 따른다"),
    "포메라니안": (PetSize.SMALL, "호기심 많고 경계심이 강하다"),
    "치와와": (PetSize.SMALL, "용감하고 주인에게 충성스럽다"),
    "닥스훈트": (PetSize.SMALL, "호기심 많고 끈기가 있다"),
    "시츄": (PetSize.SMALL, "온순하고 사람을 좋아한다"),
    "퍼그": (PetSize.SMALL, "장난기 많고 느긋하다"),
    "프렌치불독": (PetSize.SMALL, "차분하고 사람과의 교감을 좋아한다"),
    "웰시코기": (PetSize.MEDIUM, "활동적이고 영리하며 무리 본능이 강하다"),
    "비글": (PetSize.MEDIUM, "후각이 발달했고 호기심과 에너지가 넘친다"),
    "보더콜리": (PetSize.MEDIUM, "지능이 매우 높고 활동량이 많다"),
    "시바견": (PetSize.MEDIUM, "독립적이고 깔끔한 성격이다"),
    "진돗개": (PetSize.MEDIUM, "주인에 대한 충성심과 귀소 본능이 강하다"),
    "골든리트리버": (PetSize.LARGE, "온순하고 친화적이며 사람을 잘 따른다"),
    "래브라도리트리버": (PetSize.LARGE, "활발하고 사교적이며 훈련성이 좋다"),
}
# 정규화 키 → 정식 견종명 (입력 표기 차이 흡수)
_NORMALIZED_INDEX: dict[str, str] = {normalize_breed(name): name for name in _CATALOG}


class MockBreedCatalogRepository(BreedCatalogPort):
    """큐레이션 딕셔너리 기반 목 구현. DB 없이 자동완성을 제공한다."""

    async def lookup(self, breed: str) -> Optional[BreedProfile]:
        name = _NORMALIZED_INDEX.get(normalize_breed(breed))
        if name is None:
            return None
        size, temperament = _CATALOG[name]
        return BreedProfile(
            breed=name,
            size=size,
            traits=BreedTrait.from_breed(name),
            temperament=temperament,
        )


class DbBreedCatalogRepository(BreedCatalogPort):
    """breed_catalog 테이블에서 표준정보를 조회 (3NF: 체질은 별도 테이블)."""

    async def lookup(self, breed: str) -> Optional[BreedProfile]:
        key = normalize_breed(breed)
        async with dbs.get_session_factory()() as s:
            row = (await s.execute(
                select(BreedCatalog).where(BreedCatalog.breed == key)
            )).scalar_one_or_none()
            if row is None:
                return None
            traits = defaultdict(set)
            for b, t in (await s.execute(
                select(BreedCatalogTrait.breed, BreedCatalogTrait.trait)
                .where(BreedCatalogTrait.breed == key)
            )).all():
                traits[b].add(t)

        return BreedCatalogMapper.to_entity(row, traits[key])
