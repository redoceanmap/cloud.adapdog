from __future__ import annotations

# community_router는 main.py에서 처음 접근할 때 지연 생성된다 (PEP 562).
# schemas/* 서브모듈 임포트 시 라우터 체인이 즉시 로드되지 않도록 한다.

_community_router = None


def __getattr__(name: str):
    global _community_router

    if name == "community_router":
        if _community_router is None:
            _community_router = _build_community_router()
        return _community_router

    raise AttributeError(f"module {__name__!r} has no attribute {name!r}")


def _build_community_router():
    from fastapi import APIRouter

    from community.adapter.inbound.api.v1.community_post_router import community_post_router
    from community.adapter.inbound.api.v1.favorite_router import favorite_router
    from community.adapter.inbound.api.v1.review_router import review_router
    from community.adapter.inbound.api.v1.year_summary_router import year_summary_router

    router = APIRouter(prefix="/community", tags=["community"])
    router.include_router(community_post_router)
    router.include_router(year_summary_router)
    router.include_router(favorite_router)
    router.include_router(review_router)
    return router
