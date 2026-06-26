from __future__ import annotations

from users.domain.entities.pet_persona_entity import PetPersona


class PetPersonaMapper:
    """PetPersonaOrm Row → PetPersona 엔티티 (DbPetPersonaRepository용).

    현재는 mock repository를 쓰지만, DB 시드로 전환 시 이 매퍼로 row를
    도메인 엔티티로 옮긴다. 도메인은 ORM을 모른다(의존성 역전).
    """

    @staticmethod
    def to_entity(orm) -> PetPersona:
        return PetPersona(
            pet_id=orm.pet_id,
            intro_text=orm.intro_text,
            hero_image_url=orm.hero_image_url,
            mascot_image_url=orm.mascot_image_url,
            tone=orm.tone,
            created_at=orm.created_at,
        )
