from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class CommunityPostDto:
    """코스 후기 응답 항목 (use case 경계 밖으로 나가는 DTO)."""

    id: int
    account_id: int
    pet_id: int
    itinerary_id: int
    title: str
    body: str
    created_at: str
    like_count: int
