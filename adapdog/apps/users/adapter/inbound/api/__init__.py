from __future__ import annotations

# users_router는 main.py에서 처음 접근할 때 지연 생성된다 (PEP 562).
# map 컨텍스트의 __init__.py와 동일 구조 — 라우터 임포트 체인을 통해
# ORM 모델이 Base.metadata에 등록되어 create_all_tables가 테이블을 만든다.

_users_router = None


def __getattr__(name: str):
    global _users_router

    if name == "users_router":
        if _users_router is None:
            _users_router = _build_users_router()
        return _users_router

    raise AttributeError(f"module {__name__!r} has no attribute {name!r}")


def _build_users_router():
    from fastapi import APIRouter

    from users.adapter.inbound.api.v1.account_router import account_router
    from users.adapter.inbound.api.v1.breed_catalog_router import breed_catalog_router
    from users.adapter.inbound.api.v1.pet_activity_router import pet_activity_router
    from users.adapter.inbound.api.v1.pet_router import pet_router

    router = APIRouter(prefix="/users", tags=["users"])
    router.include_router(account_router)
    router.include_router(pet_router)
    router.include_router(pet_activity_router)
    router.include_router(breed_catalog_router)
    return router
