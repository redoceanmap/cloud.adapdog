from __future__ import annotations

from users.adapter.outbound.orm.pet_activity_orm import PetActivityOrm
from users.domain.entities.pet_activity_entity import PetActivity
from users.domain.value_objects.pet_activity_vo import ActionType


class PetActivityMapper:
    """PetActivityOrm ↔ PetActivity 엔티티."""

    @staticmethod
    def to_entity(row: PetActivityOrm) -> PetActivity:
        return PetActivity(
            id=row.id,
            pet_id=row.pet_id,
            facility_id=row.facility_id,
            action_type=ActionType(row.action_type)
            if row.action_type in ActionType._value2member_map_
            else ActionType.VISIT,
            occurred_at=row.occurred_at,
        )

    @staticmethod
    def to_orm(activity: PetActivity) -> PetActivityOrm:
        return PetActivityOrm(
            pet_id=activity.pet_id,
            facility_id=activity.facility_id,
            action_type=activity.action_type.value,
        )
