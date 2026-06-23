from __future__ import annotations

from community.domain.entities.year_summary_entity import YearSummary


class YearSummaryMapper:
    """YearSummaryOrm Row → YearSummary 엔티티 (DbYearSummaryRepository용).

    현재는 mock repository를 쓰지만, DB 시드로 전환 시 이 매퍼로 결산 row를
    도메인 엔티티로 옮긴다. 도메인은 ORM을 모른다(의존성 역전).
    """

    @staticmethod
    def to_entity(orm) -> YearSummary:
        return YearSummary(
            id=orm.id,
            pet_id=orm.pet_id,
            year=orm.year,
            total_distance_km=orm.total_distance_km,
            places_count=orm.places_count,
            story_text=orm.story_text,
            created_at=orm.created_at,
        )
