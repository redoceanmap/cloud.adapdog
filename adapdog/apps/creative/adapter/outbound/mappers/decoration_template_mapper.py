from __future__ import annotations

from creative.domain.entities.decoration_template_entity import DecorationTemplate


class DecorationTemplateMapper:
    """DecorationTemplateOrm Row → DecorationTemplate 엔티티 (DB repository용).

    현재는 mock repository를 쓰지만, DB 시드로 전환 시 이 매퍼로 Row를 도메인 엔티티로
    옮긴다. 도메인은 ORM을 모른다(의존성 역전).
    """

    @staticmethod
    def to_entity(orm) -> DecorationTemplate:
        return DecorationTemplate(
            id=orm.id,
            name=orm.name,
            theme=orm.theme,
            thumbnail_url=orm.thumbnail_url,
            source=orm.source,
        )
