from __future__ import annotations

from creative.domain.entities.decoration_entity import Decoration


class DecorationMapper:
    """DecorationOrm Row → Decoration 엔티티 (DB repository용).

    현재는 mock repository를 쓰지만, DB 시드로 전환 시 이 매퍼로 Row를 도메인 엔티티로
    옮긴다. 도메인은 ORM을 모른다(의존성 역전).
    """

    @staticmethod
    def to_entity(orm) -> Decoration:
        return Decoration(
            id=orm.id,
            pet_id=orm.pet_id,
            template_id=orm.template_id,
            result_image_url=orm.result_image_url,
            model3d_url=orm.model3d_url,
            created_at=orm.created_at,
        )
