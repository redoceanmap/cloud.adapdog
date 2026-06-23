from __future__ import annotations

# creative_router는 main.py에서 처음 접근할 때 지연 생성된다 (PEP 562).
# schemas/* 서브모듈 임포트 시 라우터 체인이 즉시 로드되지 않도록 한다.

_creative_router = None


def __getattr__(name: str):
    global _creative_router

    if name == "creative_router":
        if _creative_router is None:
            _creative_router = _build_creative_router()
        return _creative_router

    raise AttributeError(f"module {__name__!r} has no attribute {name!r}")


def _build_creative_router():
    from fastapi import APIRouter

    from creative.adapter.inbound.api.v1.decoration_router import decoration_router
    from creative.adapter.inbound.api.v1.decoration_template_router import decoration_template_router
    from creative.adapter.inbound.api.v1.goods_order_router import goods_order_router
    from creative.adapter.inbound.api.v1.vlog_router import vlog_router

    router = APIRouter(prefix="/creative", tags=["creative"])
    router.include_router(decoration_template_router)
    router.include_router(decoration_router)
    router.include_router(goods_order_router)
    router.include_router(vlog_router)
    return router
