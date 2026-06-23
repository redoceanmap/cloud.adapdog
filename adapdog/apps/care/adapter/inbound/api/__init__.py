from __future__ import annotations

# care_router는 main.py에서 처음 접근할 때 지연 생성된다 (PEP 562).
# schemas/* 서브모듈 임포트 시 라우터 체인이 즉시 로드되지 않도록 한다.

_care_router = None


def __getattr__(name: str):
    global _care_router

    if name == "care_router":
        if _care_router is None:
            _care_router = _build_care_router()
        return _care_router

    raise AttributeError(f"module {__name__!r} has no attribute {name!r}")


def _build_care_router():
    from fastapi import APIRouter

    from care.adapter.inbound.api.v1.care_reminder_router import care_reminder_router
    from care.adapter.inbound.api.v1.symptom_check_router import symptom_check_router

    router = APIRouter(prefix="/care", tags=["care"])
    router.include_router(care_reminder_router)
    router.include_router(symptom_check_router)
    return router
