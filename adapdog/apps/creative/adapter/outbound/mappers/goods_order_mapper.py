from __future__ import annotations

from creative.domain.entities.goods_order_entity import GoodsOrder


class GoodsOrderMapper:
    """GoodsOrderOrm Row → GoodsOrder 엔티티 (DB repository용).

    현재는 mock repository를 쓰지만, DB 시드로 전환 시 이 매퍼로 Row를 도메인 엔티티로
    옮긴다. 도메인은 ORM을 모른다(의존성 역전).
    """

    @staticmethod
    def to_entity(orm) -> GoodsOrder:
        return GoodsOrder(
            id=orm.id,
            decoration_id=orm.decoration_id,
            pet_id=orm.pet_id,
            product_type=orm.product_type,
            status=orm.status,
            ordered_at=orm.ordered_at,
        )
