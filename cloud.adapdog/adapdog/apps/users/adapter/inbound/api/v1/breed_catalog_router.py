from __future__ import annotations

from fastapi import APIRouter, Depends

from core.introduction import IntroductionSchema
from users.adapter.inbound.api.schemas.breed_catalog_schema import BreedProfileSchema
from users.app.ports.input.breed_catalog_use_case import BreedCatalogUseCase
from users.dependencies.breed_catalog_provider import get_breed_catalog_use_case

breed_catalog_router = APIRouter(prefix="/breed-catalog", tags=["breed-catalog"])


@breed_catalog_router.get("/myself", tags=["자기소개 (연동 검증)"])
async def introduce_myself(
    use_case: BreedCatalogUseCase = Depends(get_breed_catalog_use_case),
) -> IntroductionSchema:
    """연동 검증용 자기소개 — router→use case→interactor→port→repository 전 계층 확인.

    경로 변수 라우트(/{breed})보다 먼저 등록해야 /myself가 가로채이지 않는다.
    """
    intro = await use_case.introduce_myself()
    intro.trail.append("router")
    return IntroductionSchema.from_entity(intro)


@breed_catalog_router.get("/{breed}")
async def preview_breed(
    breed: str,
    use_case: BreedCatalogUseCase = Depends(get_breed_catalog_use_case),
) -> BreedProfileSchema:
    """견종명으로 자동완성될 표준정보를 미리 본다(프론트 입력 보조용)."""
    profile = await use_case.lookup(breed)
    return BreedProfileSchema(
        breed=profile.breed,
        size=profile.size.value,
        traits=sorted(t.value for t in profile.traits),
        temperament=profile.temperament,
    )
