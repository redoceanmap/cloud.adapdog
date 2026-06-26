from __future__ import annotations

from fastapi import APIRouter, Depends

from core.introduction import IntroductionSchema
from map.adapter.inbound.api.schemas.animal_hospital_schema import AnimalHospitalSchema
from map.app.dtos.animal_hospital_dto import AnimalHospitalListResponse
from map.app.ports.input.animal_hospital_use_case import AnimalHospitalUseCase
from map.dependencies.animal_hospital_provider import get_animal_hospital_use_case

animal_hospital_router = APIRouter(prefix="/animal-hospital", tags=["animal-hospital"])


@animal_hospital_router.post("/nearby")
async def nearby_hospitals(
    schema: AnimalHospitalSchema,
    use_case: AnimalHospitalUseCase = Depends(get_animal_hospital_use_case),
) -> AnimalHospitalListResponse:
    """현재 위치 기준 가까운(영업 중) 동물병원을 거리순으로 안내한다(응급)."""
    return await use_case.nearby(schema)


@animal_hospital_router.get("/myself", tags=["자기소개 (연동 검증)"])
async def introduce_myself(
    use_case: AnimalHospitalUseCase = Depends(get_animal_hospital_use_case),
) -> IntroductionSchema:
    intro = await use_case.introduce_myself()
    intro.trail.append("router")
    return IntroductionSchema.from_entity(intro)
