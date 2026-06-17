from __future__ import annotations

import logging
from collections import defaultdict

from sqlalchemy import or_, select
from sqlalchemy.orm import aliased

from core.database import session as dbs
from map.adapter.outbound.mappers.inclusive_filter_mapper import InclusiveFilterMapper
from map.adapter.outbound.orm.inclusive_filter_orm import BarrierFreeFacility, BarrierFreeFeature
from map.adapter.outbound.orm.pet_place_orm import Region
from map.app.ports.output.inclusive_filter_port import BarrierFreePlacePort
from map.domain.entities.inclusive_filter_entity import BarrierFreePlace
from map.domain.value_objects.inclusive_filter_vo import AccessibilityFeature
from map.domain.value_objects.pet_place_vo import Coordinate

logger = logging.getLogger(__name__)

_F = AccessibilityFeature
_MOCK_BARRIER_FREE: dict[str, list[BarrierFreePlace]] = {
    "강릉": [
        BarrierFreePlace(1, "경포해변 무장애 탐방로", Coordinate(37.7951, 128.9101),
                         frozenset({_F.WHEELCHAIR, _F.ACCESSIBLE_PARKING, _F.ACCESSIBLE_RESTROOM})),
        BarrierFreePlace(2, "안목해변 배리어프리 산책로", Coordinate(37.7711, 128.9473),
                         frozenset({_F.WHEELCHAIR, _F.ACCESSIBLE_RESTROOM})),
        BarrierFreePlace(3, "강릉시립미술관(무장애)", Coordinate(37.7530, 128.8800),
                         frozenset({_F.WHEELCHAIR, _F.BRAILLE, _F.ACCESSIBLE_PARKING})),
    ],
}


class MockBarrierFreePlaceRepository(BarrierFreePlacePort):
    """무장애 시설 조회 포트의 목 구현."""

    async def find_barrier_free(self, region: str) -> list[BarrierFreePlace]:
        places = _MOCK_BARRIER_FREE.get(region.strip(), [])
        logger.info("[MockBarrierFreePlaceRepository] region=%s hit=%d", region, len(places))
        return places


class DbBarrierFreePlaceRepository(BarrierFreePlacePort):
    """3NF Postgres DB에서 무장애 시설을 조회."""

    async def find_barrier_free(self, region: str) -> list[BarrierFreePlace]:
        factory = dbs.async_session_factory
        if factory is None:
            dbs.init_engine()
            factory = dbs.async_session_factory
        if factory is None:
            return []

        q = f"%{region.strip()}%"
        sigungu = aliased(Region)
        sido = aliased(Region)
        async with factory() as s:
            facs = (await s.execute(
                select(BarrierFreeFacility)
                .join(sigungu, BarrierFreeFacility.region_id == sigungu.id)
                .outerjoin(sido, sigungu.parent_id == sido.id)
                .where(or_(sigungu.name.like(q), sido.name.like(q)))
            )).scalars().all()
            if not facs:
                return []
            ids = [f.id for f in facs]
            feats: dict[int, set[str]] = defaultdict(set)
            for fid, code in (await s.execute(
                select(BarrierFreeFeature.facility_id, BarrierFreeFeature.feature_code)
                .where(BarrierFreeFeature.facility_id.in_(ids))
            )).all():
                feats[fid].add(code)

        places = [InclusiveFilterMapper.to_entity(f, feats[f.id]) for f in facs]
        logger.info("[DbBarrierFreePlaceRepository] region=%s matched=%d", region, len(places))
        return places
