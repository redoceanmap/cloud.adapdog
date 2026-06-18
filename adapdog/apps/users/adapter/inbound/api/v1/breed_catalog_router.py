from __future__ import annotations

from fastapi import APIRouter, Depends

from users.adapter.inbound.api.schemas.breed_catalog_schema import BreedProfileSchema
from users.app.ports.input.breed_catalog_use_case import BreedCatalogUseCase
from users.dependencies.breed_catalog_provider import get_breed_catalog_use_case

breed_catalog_router = APIRouter(prefix="/breed-catalog", tags=["breed-catalog"])


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
