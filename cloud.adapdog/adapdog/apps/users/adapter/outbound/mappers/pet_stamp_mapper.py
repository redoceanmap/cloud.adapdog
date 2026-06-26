from __future__ import annotations

from users.domain.entities.pet_stamp_entity import PetStamp


class PetStampMapper:
    """PetStampOrm Row → PetStamp 엔티티 (DbPetStampRepository용).

    현재는 mock repository를 쓰지만, DB 시드로 전환 시 이 매퍼로 스팟 JOIN 결과를
    도메인 엔티티로 옮긴다(spot_name은 스팟 차원에서). 도메인은 ORM을 모른다(의존성 역전).
    """

    @staticmethod
    def to_entity(orm, spot_name: str = "") -> PetStamp:
        return PetStamp(
            pet_id=orm.pet_id,
            stamp_spot_id=orm.stamp_spot_id,
            spot_name=spot_name,
            collected_at=orm.collected_at,
        )
