from __future__ import annotations

from community.domain.entities.review_entity import Review


class ReviewMapper:
    """ReviewOrm Row → Review 엔티티 (DbReviewRepository용).

    현재는 mock repository를 쓰지만, DB 시드로 전환 시 이 매퍼로 facility JOIN
    결과(facility_name)를 합쳐 도메인 엔티티로 옮긴다. 도메인은 ORM을 모른다(의존성 역전).
    """

    @staticmethod
    def to_entity(orm, facility_name: str = "") -> Review:
        return Review(
            id=orm.id,
            account_id=orm.account_id,
            facility_id=orm.facility_id,
            facility_name=facility_name,
            rating=orm.rating,
            comment=orm.comment,
            created_at=orm.created_at,
        )
