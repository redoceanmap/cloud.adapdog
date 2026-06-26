from __future__ import annotations

# map_router는 main.py에서 처음 접근할 때 지연 생성된다 (PEP 562).
# schemas/* 서브모듈 임포트 시 라우터 체인이 즉시 로드되지 않도록 한다.

_map_router = None


def __getattr__(name: str):
    global _map_router

    if name == "map_router":
        if _map_router is None:
            _map_router = _build_map_router()
        return _map_router

    raise AttributeError(f"module {__name__!r} has no attribute {name!r}")


def _build_map_router():
    from fastapi import APIRouter

    from map.adapter.inbound.api.v1.animal_hospital_router import animal_hospital_router
    from map.adapter.inbound.api.v1.audio_guide_router import audio_guide_router
    from map.adapter.inbound.api.v1.cohort_recommendation_router import cohort_recommendation_router
    from map.adapter.inbound.api.v1.entry_verdict_router import entry_verdict_router
    from map.adapter.inbound.api.v1.inclusive_filter_router import inclusive_filter_router
    from map.adapter.inbound.api.v1.festival_router import festival_router
    from map.adapter.inbound.api.v1.pet_place_router import pet_place_router
    from map.adapter.inbound.api.v1.policy_card_router import policy_card_router
    from map.adapter.inbound.api.v1.review_router import review_router
    from map.adapter.inbound.api.v1.route_planner_router import route_planner_router
    from map.adapter.inbound.api.v1.safety_alert_router import safety_alert_router
    from map.adapter.inbound.api.v1.stamp_spot_router import stamp_spot_router
    from map.adapter.inbound.api.v1.visited_place_router import visited_place_router
    from map.adapter.inbound.api.v1.walking_trail_router import walking_trail_router

    router = APIRouter(prefix="/map", tags=["map"])
    router.include_router(pet_place_router)
    router.include_router(route_planner_router)
    router.include_router(inclusive_filter_router)
    router.include_router(entry_verdict_router)
    router.include_router(policy_card_router)
    router.include_router(safety_alert_router)
    router.include_router(cohort_recommendation_router)
    router.include_router(festival_router)
    router.include_router(audio_guide_router)
    router.include_router(walking_trail_router)
    router.include_router(stamp_spot_router)
    router.include_router(visited_place_router)
    router.include_router(review_router)
    router.include_router(animal_hospital_router)
    return router
