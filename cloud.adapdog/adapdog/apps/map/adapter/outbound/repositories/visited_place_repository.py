from __future__ import annotations

from sqlalchemy import func, select

from core.database import session as dbs
from map.adapter.outbound.mappers.visited_place_mapper import VisitedPlaceMapper
from map.adapter.outbound.orm.pet_place_orm import Category, Facility, Region
from map.app.ports.output.visited_place_port import VisitedPlacePort
from map.domain.entities.visited_place_entity import VisitedPlace
from users.adapter.outbound.orm.pet_activity_orm import PetActivityOrm

_VISIT = "visit"


class EmptyVisitedPlaceRepository(VisitedPlacePort):
    """DB 없이 부팅할 때: 방문 데이터가 없으므로 빈 발자국."""

    async def list_visited(self, pet_id: int, limit: int) -> list[VisitedPlace]:
        return []


class DbVisitedPlaceRepository(VisitedPlacePort):
    """CQRS read 모델 — 한 반려동물의 pet_activity(방문)를 시설별로 집계.

    pet_activity(users) ⋈ facility/category/region(map)을 한 쿼리로 조인한다.
    cross-context 조인은 이 read 어댑터에 국한되고, 도메인/인터랙터는 포트로 격리된다.
    """

    async def list_visited(self, pet_id: int, limit: int) -> list[VisitedPlace]:
        visit_count = func.count(PetActivityOrm.id).label("visit_count")
        first_visited = func.min(PetActivityOrm.occurred_at).label("first_visited_at")
        stmt = (
            select(
                Facility.id,
                Facility.name,
                Category.name.label("category"),
                Facility.latitude,
                Facility.longitude,
                Region.name.label("region"),
                Facility.road_address,
                visit_count,
                first_visited,
            )
            .select_from(PetActivityOrm)
            .join(Facility, Facility.id == PetActivityOrm.facility_id)
            .outerjoin(Category, Category.id == Facility.category_id)
            .outerjoin(Region, Region.id == Facility.region_id)
            .where(PetActivityOrm.pet_id == pet_id, PetActivityOrm.action_type == _VISIT)
            .group_by(Facility.id, Category.name, Region.name)
            .order_by(first_visited)
            .limit(limit)
        )
        async with dbs.get_session_factory()() as s:
            rows = (await s.execute(stmt)).all()
        return [VisitedPlaceMapper.to_entity(r) for r in rows]
