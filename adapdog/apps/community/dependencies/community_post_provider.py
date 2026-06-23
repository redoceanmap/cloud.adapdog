from __future__ import annotations

import logging

# community_post_orm을 임포트해 Base.metadata에 등록 → create_all_tables가 테이블 생성.
from community.adapter.outbound.orm.community_post_orm import CommunityPostOrm, PostLikeOrm  # noqa: F401
from community.adapter.outbound.repositories.community_post_repository import MockCommunityPostRepository
from community.app.ports.input.community_post_use_case import CommunityPostUseCase
from community.app.ports.output.community_post_port import CommunityPostPort
from community.app.use_cases.community_post_interactor import CommunityPostInteractor

logger = logging.getLogger(__name__)


def get_community_post_repository() -> CommunityPostPort:
    """코스 후기 DB 미연동 단계 → mock repository."""
    logger.info("[provider] community_post: mock 데이터 사용")
    return MockCommunityPostRepository()


def get_community_post_use_case() -> CommunityPostUseCase:
    return CommunityPostInteractor(repository=get_community_post_repository())
