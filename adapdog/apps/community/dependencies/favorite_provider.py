from __future__ import annotations

import logging

# favorite_orm을 임포트해 Base.metadata에 등록 → create_all_tables가 테이블 생성.
from community.adapter.outbound.orm.favorite_orm import FavoriteOrm  # noqa: F401
from community.adapter.outbound.repositories.favorite_repository import MockFavoriteRepository
from community.app.ports.input.favorite_use_case import FavoriteUseCase
from community.app.ports.output.favorite_port import FavoritePort
from community.app.use_cases.favorite_interactor import FavoriteInteractor

logger = logging.getLogger(__name__)


def get_favorite_repository() -> FavoritePort:
    """즐겨찾기 DB 미연동 단계 → mock repository."""
    logger.info("[provider] favorite: mock 데이터 사용")
    return MockFavoriteRepository()


def get_favorite_use_case() -> FavoriteUseCase:
    return FavoriteInteractor(repository=get_favorite_repository())
