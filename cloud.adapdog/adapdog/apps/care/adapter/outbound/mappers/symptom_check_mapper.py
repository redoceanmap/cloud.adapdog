from __future__ import annotations

from care.domain.entities.symptom_check_entity import SymptomCheck


class SymptomCheckMapper:
    """SymptomCheckOrm Row → SymptomCheck 엔티티 (DbSymptomCheckRepository용).

    현재는 mock repository를 쓰지만, DB 시드로 전환 시 이 매퍼로 Row를 도메인 엔티티로
    옮긴다. 가드레일: is_diagnostic은 항상 False로 강제한다. 도메인은 ORM을 모른다(의존성 역전).
    """

    @staticmethod
    def to_entity(orm) -> SymptomCheck:
        return SymptomCheck(
            id=orm.id,
            pet_id=orm.pet_id,
            symptom_text=orm.symptom_text,
            ai_result_text=orm.ai_result_text,
            severity=orm.severity,
            is_diagnostic=False,  # 가드레일: 진단 아님
            created_at=orm.created_at,
        )
