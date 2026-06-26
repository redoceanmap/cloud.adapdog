from __future__ import annotations

from typing import Optional

from sqlalchemy import func, select

from core.database import session as dbs
from map.adapter.outbound.mappers.cohort_recommendation_mapper import CohortRecommendationMapper
from map.adapter.outbound.orm.pet_place_orm import Category, Facility
from map.app.ports.output.cohort_recommendation_port import CohortRecommendationPort
from map.domain.entities.cohort_recommendation_entity import RecommendedFacility
from map.domain.value_objects.cohort_recommendation_vo import Cohort
from users.adapter.outbound.orm.pet_activity_orm import PetActivityOrm
from users.adapter.outbound.orm.pet_orm import PetOrm, PetTraitOrm


class EmptyCohortRecommendationRepository(CohortRecommendationPort):
    """DB 없이 부팅할 때: 누적 행동 데이터가 없으므로 빈 추천."""

    async def top_facilities(
        self, cohort: Cohort, action_type: Optional[str], limit: int
    ) -> list[RecommendedFacility]:
        return []


class DbCohortRecommendationRepository(CohortRecommendationPort):
    """CQRS read 모델 — 코호트가 쌓은 pet_activity를 시설별로 집계.

    pet_activity(users) ⋈ pet/pet_trait(users) ⋈ facility(map)를 한 쿼리로 조인한다.
    cross-context 조인은 이 read 어댑터에 국한되고, 도메인/인터랙터는 포트로 격리된다.
    """

    async def top_facilities(
        self, cohort: Cohort, action_type: Optional[str], limit: int
    ) -> list[RecommendedFacility]:
        score = func.count(PetActivityOrm.id).label("score")
        conditions = [PetOrm.size == cohort.size.value]
        if action_type:
            conditions.append(PetActivityOrm.action_type == action_type)
        if cohort.traits:
            trait_values = [t.value for t in cohort.traits]
            # 코호트의 체질을 '모두' 가진 반려동물만 (교집합 코호트)
            matching_pets = (
                select(PetTraitOrm.pet_id)
                .where(PetTraitOrm.trait.in_(trait_values))
                .group_by(PetTraitOrm.pet_id)
                .having(func.count(func.distinct(PetTraitOrm.trait)) == len(trait_values))
            )
            conditions.append(PetOrm.id.in_(matching_pets))

        stmt = (
            select(
                Facility.id, Facility.name, Category.name.label("category"),
                Facility.latitude, Facility.longitude, Facility.road_address, score,
            )
            .select_from(PetActivityOrm)
            .join(PetOrm, PetOrm.id == PetActivityOrm.pet_id)
            .join(Facility, Facility.id == PetActivityOrm.facility_id)
            .outerjoin(Category, Category.id == Facility.category_id)
            .where(*conditions)
            .group_by(Facility.id, Category.name)
            .order_by(score.desc())
            .limit(limit)
        )
        async with dbs.get_session_factory()() as s:
            rows = (await s.execute(stmt)).all()
        return [CohortRecommendationMapper.to_entity(r) for r in rows]
