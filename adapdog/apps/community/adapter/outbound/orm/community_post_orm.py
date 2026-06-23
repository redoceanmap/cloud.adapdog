from __future__ import annotations

from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from core.database.base import Base


class CommunityPostOrm(Base):
    """코스 후기 (ERD: community_post). 데이터는 mock 시드.

    like_count는 도메인 표현용 집계값이라 ORM에는 컬럼으로 두지 않고,
    post_like 테이블의 row 수로 산출한다(현재는 mock).
    """

    __tablename__ = "community_post"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    account_id: Mapped[int] = mapped_column(Integer, index=True)
    pet_id: Mapped[int] = mapped_column(Integer)
    itinerary_id: Mapped[int] = mapped_column(Integer)
    title: Mapped[str] = mapped_column(String)
    body: Mapped[str] = mapped_column(String)
    created_at: Mapped[str] = mapped_column(String)


class PostLikeOrm(Base):
    """코스 후기 좋아요 (ERD: post_like). post_id + account_id 복합 PK.

    독립 슬라이스가 아니라 community_post.like_count 집계의 원천 테이블이다.
    """

    __tablename__ = "post_like"

    post_id: Mapped[int] = mapped_column(Integer, primary_key=True)
    account_id: Mapped[int] = mapped_column(Integer, primary_key=True)
