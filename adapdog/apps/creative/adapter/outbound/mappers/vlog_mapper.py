from __future__ import annotations

from creative.domain.entities.vlog_entity import Vlog, VlogClip


class VlogMapper:
    """VlogOrm + VlogClipOrm Row → Vlog 엔티티(클립 포함) (DB repository용).

    현재는 mock repository를 쓰지만, DB 시드로 전환 시 이 매퍼로 vlog와 vlog_clip 행을
    도메인 엔티티로 옮긴다. 도메인은 ORM을 모른다(의존성 역전).
    """

    @staticmethod
    def to_entity(orm, clip_orms=()) -> Vlog:
        return Vlog(
            id=orm.id,
            pet_id=orm.pet_id,
            itinerary_id=orm.itinerary_id,
            tone=orm.tone,
            video_url=orm.video_url,
            created_at=orm.created_at,
            clips=[
                VlogClip(seq=c.seq, source_type=c.source_type, media_url=c.media_url)
                for c in clip_orms
            ],
        )
