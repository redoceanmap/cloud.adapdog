from __future__ import annotations

from typing import Optional

from map.app.ports.output.audio_guide_port import AudioGuidePort
from map.domain.entities.audio_guide_entity import AudioGuide

_GUIDE_KYEONGGIJEON = (
    "강아지 목소리로 듣는 경기전 이야기... 멍! 여기는 조선을 세운 태조 이성계의 "
    "초상화를 모신 경기전이야. 울창한 숲길은 우리 산책하기에도 딱이지!"
)
_GUIDE_JEONDONG = (
    "멍멍! 여기는 전동성당이야. 1914년에 지어진 로마네스크 양식 성당인데, "
    "붉은 벽돌이 정말 멋지지? 마당에서 함께 사진 찍기 좋은 곳이야."
)


class MockAudioGuideRepository(AudioGuidePort):
    """데이터 없는 단계의 mock 오디오 가이드 — 전주 데모 시나리오용.

    시설별 해설 스크립트 연동 전까지 사용. DB 시드로 전환 시
    DbAudioGuideRepository로 교체하면 도메인/인터랙터는 무수정(OCP).
    """

    _DATA = (
        AudioGuide(1, 1, "ko", _GUIDE_KYEONGGIJEON, "https://cdn.adapdog.example/audio/gyeonggijeon.mp3"),
        AudioGuide(2, 2, "ko", _GUIDE_JEONDONG, "https://cdn.adapdog.example/audio/jeondong.mp3"),
    )

    async def find_guides(self, facility_id: Optional[int]) -> list[AudioGuide]:
        if facility_id is not None:
            return [g for g in self._DATA if g.facility_id == facility_id]
        return list(self._DATA)
