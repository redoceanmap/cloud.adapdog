from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class CommunityPost:
    """코스 후기 게시글 — 커뮤니티(H1/H2)의 한 항목.

    완성한 여행 동선(itinerary)을 후기로 공유한다. post_like는 독립 슬라이스가
    아니라 like_count(좋아요 수) 집계로 표현한다.
    """

    id: int
    account_id: int
    pet_id: int
    itinerary_id: int
    title: str
    body: str
    created_at: str  # ISO yyyy-mm-dd
    like_count: int
