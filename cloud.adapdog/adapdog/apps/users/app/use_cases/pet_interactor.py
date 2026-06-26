from __future__ import annotations

import logging
from typing import Optional

from core.introduction import Introduction
from users.app.ports.input.breed_catalog_use_case import BreedCatalogUseCase
from users.app.ports.input.pet_use_case import PetUseCase
from users.app.ports.output.pet_port import PetPort
from users.domain.entities.pet_entity import Pet
from users.domain.value_objects.pet_vo import Gender

logger = logging.getLogger(__name__)


class PetInteractor(PetUseCase):
    """반려동물 등록 인터랙터.

    등록의 핵심: 견종명만으로 BreedCatalogUseCase를 호출해 크기·체질·기질을
    자동완성한다. 견종 카탈로그가 목인지 DB인지는 알지 못한다(DIP).
    """

    def __init__(self, repository: PetPort, breed_catalog: BreedCatalogUseCase) -> None:
        self.repository = repository
        self.breed_catalog = breed_catalog

    async def register(
        self,
        account_id: int,
        name: str,
        breed: str,
        photo_url: str,
        birth_year: Optional[int] = None,
        gender: Optional[str] = None,
        features: Optional[str] = None,
    ) -> Pet:
        profile = await self.breed_catalog.lookup(breed)
        pet = Pet(
            id=None,
            account_id=account_id,
            name=name,
            breed=profile.breed,           # 카탈로그의 정식 견종명으로 정규화
            photo_url=photo_url,
            size=profile.size,             # 자동완성
            traits=profile.traits,         # 자동완성
            temperament=profile.temperament,  # 자동완성
            birth_year=birth_year,
            gender=Gender.from_raw(gender),
            features=features,
        )
        saved = await self.repository.save(pet)
        logger.info(
            "[PetInteractor] register | account=%s name=%s breed=%s size=%s",
            account_id, name, profile.breed, profile.size.value,
        )
        return saved

    async def list_by_account(self, account_id: int) -> list[Pet]:
        return await self.repository.find_by_account(account_id)

    async def update_profile(
        self,
        account_id: int,
        pet_id: int,
        *,
        name: str | None = None,
        breed: str | None = None,
        photo_url: str | None = None,
        features: str | None = None,
        birth_year: int | None = None,
    ) -> Pet:
        pet = await self.repository.find_by_id(pet_id)
        if pet is None or pet.account_id != account_id:
            raise LookupError(f"pet {pet_id} not found")

        if name is not None:
            pet.name = name.strip() or pet.name
        if photo_url is not None:
            pet.photo_url = photo_url
        if features is not None:
            pet.features = features
        if birth_year is not None:
            pet.birth_year = birth_year
        if breed is not None:
            profile = await self.breed_catalog.lookup(breed)
            pet.breed = profile.breed
            pet.size = profile.size
            pet.traits = profile.traits
            pet.temperament = profile.temperament

        saved = await self.repository.update(pet)
        logger.info(
            "[PetInteractor] update_profile | account=%s pet_id=%s",
            account_id,
            pet_id,
        )
        return saved

    async def introduce_myself(self) -> Introduction:
        intro = await self.repository.introduce_myself()
        intro.trail.append("interactor")
        return intro
