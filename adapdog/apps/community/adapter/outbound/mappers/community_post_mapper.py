from __future__ import annotations

from community.domain.entities.community_post_entity import CommunityPost


class CommunityPostMapper:
    """CommunityPostOrm Row → CommunityPost 엔티티 (DbCommunityPostRepository용).

    현재는 mock repository를 쓰지만, DB 시드로 전환 시 이 매퍼로 post_like 집계
    결과(like_count)를 합쳐 도메인 엔티티로 옮긴다. 도메인은 ORM을 모른다(의존성 역전).
    """

    @staticmethod
    def to_entity(orm, like_count: int = 0) -> CommunityPost:
        return CommunityPost(
            id=orm.id,
            account_id=orm.account_id,
            pet_id=orm.pet_id,
            itinerary_id=orm.itinerary_id,
            title=orm.title,
            body=orm.body,
            created_at=orm.created_at,
            like_count=like_count,
        )
