from __future__ import annotations

import logging
from typing import Optional

from sqlalchemy import or_, select
from sqlalchemy.orm import aliased

from core.database import session as dbs
from map.adapter.outbound.mappers.walking_trail_mapper import WalkingTrailMapper
from map.adapter.outbound.orm.pet_place_orm import Region
from map.adapter.outbound.orm.walking_trail_orm import WalkingTrailOrm
from map.app.ports.output.walking_trail_port import WalkingTrailPort
from map.domain.entities.walking_trail_entity import WalkingTrail

logger = logging.getLogger(__name__)

_SOURCE = "두루누비(전국길관광정보) 데이터(mock)"


class MockWalkingTrailRepository(WalkingTrailPort):
    """데이터 없는 단계의 mock 둘레길 — 전주 데모 시나리오용.

    두루누비 CSV/공공데이터 연동 전까지 사용. DbWalkingTrailRepository로 교체 시
    도메인/인터랙터는 무수정(OCP).
    """

    _DATA = (
        WalkingTrail(1, "전주천 물길 따라 산책로", "전주", 3.2, "쉬움", "약 50분",
                     "전주천을 따라 그늘이 많아 더위에 약한 강아지도 걷기 좋은 평지 코스.",
                     "전주천 산책로 입구→ 한벽교 → 남천교 → 전주천 둔치"),
        WalkingTrail(2, "한옥마을 골목 둘레길", "전주", 2.1, "쉬움", "약 35분",
                     "경기전·전동성당을 잇는 돌담길. 사람이 많아 사회성 좋은 강아지에게 추천.",
                     "경기전→ 전동성당 → 향교길 → 자만벽화마을"),
        WalkingTrail(3, "덕진공원 연꽃 산책로", "전주", 1.8, "쉬움", "약 30분",
                     "연못을 한 바퀴 도는 데크길. 물그릇 비치 쉼터가 곳곳에 있음.",
                     "덕진공원 정문→ 연화정 → 현수교 → 덕진연못 둘레"),
        WalkingTrail(4, "완산칠봉 숲길", "전주", 4.5, "보통", "약 90분",
                     "오르막이 있는 숲길. 체력 좋은 대형견과 함께하기 좋은 그늘 코스.",
                     "완산공원 입구→ 칠봉약수터 → 전망대 → 꽃동산"),
    )

    async def find_trails(self, region: Optional[str]) -> list[WalkingTrail]:
        if region:
            return [t for t in self._DATA if region in t.region]
        return list(self._DATA)


class DbWalkingTrailRepository(WalkingTrailPort):
    """3NF Postgres DB에서 둘레길을 조회. ingest_trails(전국길관광정보 CSV) 결과를 읽는다.

    pet_place와 동일하게 region 공유 차원(시군구↔시도 자기참조)을 JOIN해 지역 필터링한다.
    """

    async def find_trails(self, region: Optional[str]) -> list[WalkingTrail]:
        factory = dbs.async_session_factory
        if factory is None:
            dbs.init_engine()
            factory = dbs.async_session_factory
        if factory is None:
            logger.warning("[DbWalkingTrailRepository] DB 미초기화 → 빈 결과")
            return []

        sigungu = aliased(Region)
        sido = aliased(Region)
        stmt = (
            select(WalkingTrailOrm, sigungu.name)
            .outerjoin(sigungu, WalkingTrailOrm.region_id == sigungu.id)
            .outerjoin(sido, sigungu.parent_id == sido.id)
        )
        if region:
            q = f"%{region.strip()}%"
            stmt = stmt.where(or_(sigungu.name.like(q), sido.name.like(q)))
        async with factory() as s:
            rows = (await s.execute(stmt)).all()

        trails = [WalkingTrailMapper.to_entity(orm, region_name or "") for orm, region_name in rows]
        logger.info("[DbWalkingTrailRepository] region=%s matched=%d", region, len(trails))
        return trails
