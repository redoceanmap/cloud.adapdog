from __future__ import annotations

from fastapi import APIRouter, Depends

from community.adapter.inbound.api.schemas.community_post_schema import CommunityPostResponseSchema
from community.app.ports.input.community_post_use_case import CommunityPostUseCase
from community.dependencies.community_post_provider import get_community_post_use_case

community_post_router = APIRouter(prefix="/community-post", tags=["community-post"])


@community_post_router.get("")
async def list_posts(
    use_case: CommunityPostUseCase = Depends(get_community_post_use_case),
) -> list[CommunityPostResponseSchema]:
    """H1/H2 코스 후기 피드 — 전체 조회."""
    posts = await use_case.list_posts()
    return [CommunityPostResponseSchema.from_dto(p) for p in posts]
