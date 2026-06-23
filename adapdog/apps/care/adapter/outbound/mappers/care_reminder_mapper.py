from __future__ import annotations

from care.domain.entities.care_reminder_entity import CareReminder


class CareReminderMapper:
    """CareReminderOrm Row → CareReminder 엔티티 (DbCareReminderRepository용).

    현재는 mock repository를 쓰지만, DB 시드로 전환 시 이 매퍼로 Row를 도메인 엔티티로
    옮긴다. label은 ORM에 없는 표시용 값이라 매핑 시 주입한다. 도메인은 ORM을 모른다(의존성 역전).
    """

    @staticmethod
    def to_entity(orm, label: str = "") -> CareReminder:
        return CareReminder(
            id=orm.id,
            pet_id=orm.pet_id,
            type=orm.type,
            label=label,
            interval_min=orm.interval_min,
            scheduled_time=orm.scheduled_time,
            enabled=orm.enabled,
        )
