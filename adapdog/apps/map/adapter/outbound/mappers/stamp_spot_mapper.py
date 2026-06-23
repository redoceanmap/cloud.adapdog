from __future__ import annotations

from map.domain.entities.stamp_spot_entity import StampSpot


class StampSpotMapper:
    """StampSpotOrm Row → StampSpot 엔티티 (DbStampSpotRepository용).

    DB 시드 전환 시 region JOIN 결과를 도메인 엔티티로 옮긴다. 도메인은 ORM을 모른다.
    """

    @staticmethod
    def to_entity(orm, region_name: str = "") -> StampSpot:
        return StampSpot(
            id=orm.id,
            name=orm.name,
            region=region_name,
            theme=orm.theme,
        )
