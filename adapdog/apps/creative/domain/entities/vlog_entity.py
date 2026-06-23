from __future__ import annotations

from dataclasses import dataclass, field


@dataclass(frozen=True)
class VlogClip:
    """브이로그 구성 클립 — vlog 도메인에 포함되는 종속 값(독립 슬라이스 아님).

    seq는 클립 순서, source_type은 photo/video, media_url은 원본 미디어.
    """

    seq: int
    source_type: str  # photo | video
    media_url: str


@dataclass(frozen=True)
class Vlog:
    """강아지 시점 브이로그 — 여행 일정 기반 자동 편집 영상(G).

    pet 종속(pet_id), itinerary_id로 여행 일정 참조. clips는 구성 클립 목록.
    데이터는 mock 시드.
    """

    id: int
    pet_id: int
    itinerary_id: int
    tone: str
    video_url: str
    created_at: str  # ISO yyyy-mm-dd
    clips: list[VlogClip] = field(default_factory=list)
