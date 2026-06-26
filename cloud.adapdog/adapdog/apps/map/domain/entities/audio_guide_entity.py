from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class AudioGuide:
    """관광지 오디오 가이드 — 둘러보기(D4) 시설 음성 해설 한 항목.

    원천: 시설별 해설 스크립트(현재는 mock). facility_id로 시설과 연결된다.
    """

    id: int
    facility_id: int
    language: str
    script_text: str
    audio_url: str
