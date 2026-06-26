from __future__ import annotations

from typing import Optional

from fastapi import APIRouter, Depends, Query

from core.introduction import IntroductionSchema
from map.adapter.inbound.api.schemas.cohort_recommendation_schema import RecommendedFacilitySchema
from map.app.ports.input.cohort_recommendation_use_case import CohortRecommendationUseCase
from map.dependencies.cohort_recommendation_provider import get_cohort_recommendation_use_case
from map.domain.value_objects.cohort_recommendation_vo import Cohort
from map.domain.value_objects.pet_place_vo import PetSize
from map.domain.value_objects.safety_alert_vo import BreedTrait

cohort_recommendation_router = APIRouter(
    prefix="/cohort-recommendation", tags=["cohort-recommendation"]
)


@cohort_recommendation_router.get("")
async def recommend_for_cohort(
    size: str = Query(..., description="반려동물 크기: small/medium/large"),
    traits: list[str] = Query(default=[], description="견종 체질 필터(예: brachycephalic). 모두 만족하는 코호트만"),
    action_type: Optional[str] = Query(None, description="visit/save (생략 시 전체 행동)"),
    limit: int = Query(10, ge=1, le=50, description="추천 개수"),
    use_case: CohortRecommendationUseCase = Depends(get_cohort_recommendation_use_case),
) -> list[RecommendedFacilitySchema]:
    """같은 특징(코호트)의 반려동물들이 많이 방문/저장한 시설을 인기순으로 추천한다."""
    cohort = Cohort(
        size=PetSize.from_raw(size),
        traits=frozenset(
            BreedTrait(t) for t in traits if t in BreedTrait._value2member_map_
        ),
    )
    results = await use_case.recommend(cohort, action_type, limit)
    return [RecommendedFacilitySchema.from_entity(r) for r in results]


@cohort_recommendation_router.get("/myself", tags=["자기소개 (연동 검증)"])
async def introduce_myself(
    use_case: CohortRecommendationUseCase = Depends(get_cohort_recommendation_use_case),
) -> IntroductionSchema:
    """연동 검증용 자기소개 — router→use case→interactor→port→repository 전 계층 확인."""
    intro = await use_case.introduce_myself()
    intro.trail.append("router")
    return IntroductionSchema.from_entity(intro)
