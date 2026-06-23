from __future__ import annotations

# trips_router는 main.py에서 처음 접근할 때 지연 생성된다 (PEP 562).
# schemas/* 서브모듈 임포트 시 라우터 체인이 즉시 로드되지 않도록 한다.

_trips_router = None


def __getattr__(name: str):
    global _trips_router

    if name == "trips_router":
        if _trips_router is None:
            _trips_router = _build_trips_router()
        return _trips_router

    raise AttributeError(f"module {__name__!r} has no attribute {name!r}")


def _build_trips_router():
    from fastapi import APIRouter

    from trips.adapter.inbound.api.v1.itinerary_router import itinerary_router
    from trips.adapter.inbound.api.v1.reservation_router import reservation_router

    router = APIRouter(prefix="/trips", tags=["trips"])
    router.include_router(itinerary_router)
    router.include_router(reservation_router)
    return router
