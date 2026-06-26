from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class CareReminder:
    """케어 알림 — 여행 진행(D2) 중 반려동물 돌봄 리마인더 한 항목.

    pet_id는 users 앱(pet)을 가리키는 cross-context 참조라 도메인은 정수 식별자만 안다.
    type은 feed/water/rest. label은 화면 표시용 문구.
    """

    id: int
    pet_id: int
    type: str  # feed / water / rest
    label: str
    interval_min: int
    scheduled_time: str
    enabled: bool
