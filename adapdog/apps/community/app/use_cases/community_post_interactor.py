from __future__ import annotations

import logging

from community.app.dtos.community_post_dto import CommunityPostDto
from community.app.ports.input.community_post_use_case import CommunityPostUseCase
from community.app.ports.output.community_post_port import CommunityPostPort

logger = logging.getLogger(__name__)


class CommunityPostInteractor(CommunityPostUseCase):
    """코스 후기 인터랙터 — 조회를 포트에 위임(DIP)하고 DTO로 매핑한다."""

    def __init__(self, repository: CommunityPostPort) -> None:
        self.repository = repository

    async def list_posts(self) -> list[CommunityPostDto]:
        posts = await self.repository.find_posts()
        logger.info("[CommunityPostInteractor] list_posts → %d건", len(posts))
        return [
            CommunityPostDto(
                id=p.id, account_id=p.account_id, pet_id=p.pet_id,
                itinerary_id=p.itinerary_id, title=p.title, body=p.body,
                created_at=p.created_at, like_count=p.like_count,
            )
            for p in posts
        ]
