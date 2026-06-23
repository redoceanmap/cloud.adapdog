from __future__ import annotations

from map.domain.entities.audio_guide_entity import AudioGuide


class AudioGuideMapper:
    """AudioGuideOrm Row → AudioGuide 엔티티 (DbAudioGuideRepository용).

    현재는 mock repository를 쓰지만, DB 시드로 전환 시 이 매퍼로 row를
    도메인 엔티티로 옮긴다. 도메인은 ORM을 모른다(의존성 역전).
    """

    @staticmethod
    def to_entity(orm) -> AudioGuide:
        return AudioGuide(
            id=orm.id,
            facility_id=orm.facility_id,
            language=orm.language,
            script_text=orm.script_text,
            audio_url=orm.audio_url,
        )
