from __future__ import annotations

from abc import ABC, abstractmethod

from community.app.dtos.community_post_dto import CommunityPostDto


class CommunityPostUseCase(ABC):
    """코스 후기 조회 입력 포트."""

    @abstractmethod
    async def list_posts(self) -> list[CommunityPostDto]:
        """코스 후기 전체를 조회한다."""
        ...
