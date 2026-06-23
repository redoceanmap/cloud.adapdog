from __future__ import annotations

from abc import ABC, abstractmethod

from community.domain.entities.community_post_entity import CommunityPost


class CommunityPostPort(ABC):
    """코스 후기 데이터 조회 출력 포트. 구현체(mock/DB)는 repository에 둔다."""

    @abstractmethod
    async def find_posts(self) -> list[CommunityPost]:
        """코스 후기 도메인 엔티티 전체를 조회한다."""
        ...
