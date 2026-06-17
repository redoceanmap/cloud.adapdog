from __future__ import annotations

from typing import AsyncGenerator

from sqlalchemy.ext.asyncio import (
    AsyncEngine,
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)

from core.config import DATABASE_URL
from core.database.base import Base

engine: AsyncEngine | None = None
async_session_factory: async_sessionmaker[AsyncSession] | None = None


def init_engine() -> None:
    """비동기 엔진/세션 팩토리 초기화. DATABASE_URL이 없으면 DB 없이 부팅."""
    global engine, async_session_factory
    if not DATABASE_URL:
        return
    if engine is not None:
        return

    engine = create_async_engine(DATABASE_URL, pool_pre_ping=True)
    async_session_factory = async_sessionmaker(
        bind=engine,
        expire_on_commit=False,
        autoflush=False,
    )


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    if async_session_factory is None:
        init_engine()
    if async_session_factory is None:
        raise RuntimeError("데이터베이스 엔진이 초기화되지 않았습니다. DATABASE_URL을 확인하세요.")

    async with async_session_factory() as session:
        yield session


async def create_all_tables() -> None:
    if engine is None:
        init_engine()
    if engine is not None:
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)


async def dispose_engine() -> None:
    global engine, async_session_factory
    if engine is not None:
        await engine.dispose()
    engine = None
    async_session_factory = None
