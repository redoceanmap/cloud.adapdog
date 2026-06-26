from __future__ import annotations

import pytest

from map.domain.value_objects.pet_place_vo import PetSize
from map.domain.value_objects.safety_alert_vo import BreedTrait
from users.adapter.outbound.repositories.account_repository import (
    BcryptPasswordHasher,
    InMemoryAccountRepository,
    JwtTokenService,
)
from users.adapter.outbound.repositories.breed_catalog_repository import MockBreedCatalogRepository
from users.adapter.outbound.repositories.pet_repository import InMemoryPetRepository
from users.app.use_cases.account_interactor import (
    AccountInteractor,
    EmailAlreadyExistsError,
    InvalidCredentialsError,
)
from users.app.use_cases.breed_catalog_interactor import BreedCatalogInteractor
from users.app.use_cases.pet_interactor import PetInteractor
from users.domain.value_objects.pet_vo import Gender

pytestmark = pytest.mark.asyncio


def _breed_catalog() -> BreedCatalogInteractor:
    return BreedCatalogInteractor(repository=MockBreedCatalogRepository())


def _pet_interactor() -> PetInteractor:
    return PetInteractor(repository=InMemoryPetRepository(), breed_catalog=_breed_catalog())


def _account_interactor() -> AccountInteractor:
    return AccountInteractor(
        repository=InMemoryAccountRepository(),
        hasher=BcryptPasswordHasher(),
        token_service=JwtTokenService("test-secret", "HS256", 60),
    )


# ── breed_catalog 자동완성 ────────────────────────────────────────────────────
async def test_breed_lookup_brachycephalic():
    """시츄는 소형 + 단두종으로 자동완성된다."""
    profile = await _breed_catalog().lookup("시츄")
    assert profile.size is PetSize.SMALL
    assert BreedTrait.BRACHYCEPHALIC in profile.traits
    assert profile.temperament


async def test_breed_lookup_normalizes_spacing():
    """'골든 리트리버'(공백)도 카탈로그 정식명으로 정규화된다."""
    profile = await _breed_catalog().lookup("골든 리트리버")
    assert profile.breed == "골든리트리버"
    assert profile.size is PetSize.LARGE


async def test_breed_lookup_unknown_returns_default():
    """미등록 견종은 기본값(UNKNOWN)으로 반환되어 등록이 끊기지 않는다."""
    profile = await _breed_catalog().lookup("없는견종123")
    assert profile.size is PetSize.UNKNOWN
    assert profile.temperament == "정보 없음"


# ── pet 등록 자동완성 병합 ────────────────────────────────────────────────────
async def test_pet_register_autofills_from_breed():
    """유저는 이름·종·사진만 줘도 크기·체질·기질이 채워지고, 선택값은 보존된다."""
    pet = await _pet_interactor().register(
        account_id=1, name="콩이", breed="시츄", photo_url="http://x/k.jpg",
        birth_year=2021, gender="female", features="낯가림",
    )
    assert pet.id is not None
    assert pet.size is PetSize.SMALL
    assert BreedTrait.BRACHYCEPHALIC in pet.traits
    assert pet.temperament
    assert pet.birth_year == 2021
    assert pet.gender is Gender.FEMALE
    assert pet.features == "낯가림"


async def test_pet_register_optional_fields_default():
    """선택 입력을 생략하면 성별 UNKNOWN, 생년/특징은 None."""
    pet = await _pet_interactor().register(
        account_id=1, name="보리", breed="웰시코기", photo_url="http://x/b.jpg",
    )
    assert pet.size is PetSize.MEDIUM
    assert pet.gender is Gender.UNKNOWN
    assert pet.birth_year is None and pet.features is None


# ── account 인증 ──────────────────────────────────────────────────────────────
async def test_signup_login_and_authenticate():
    uc = _account_interactor()
    account, token = await uc.signup("a@b.com", "secret123", "닉네임")
    assert account.id is not None
    # 발급한 토큰으로 본인 인증
    me = await uc.authenticate(token)
    assert me.id == account.id
    # 로그인도 토큰을 발급
    login_account, login_token = await uc.login("a@b.com", "secret123")
    assert login_token
    assert login_account.nickname == "닉네임"


async def test_signup_duplicate_email_rejected():
    uc = _account_interactor()
    await uc.signup("a@b.com", "secret123", "닉네임")
    with pytest.raises(EmailAlreadyExistsError):
        await uc.signup("a@b.com", "other", "다른닉")


async def test_login_wrong_password_rejected():
    uc = _account_interactor()
    await uc.signup("a@b.com", "secret123", "닉네임")
    with pytest.raises(InvalidCredentialsError):
        await uc.login("a@b.com", "wrong")


async def test_authenticate_invalid_token_rejected():
    with pytest.raises(InvalidCredentialsError):
        await _account_interactor().authenticate("garbage.token")


async def test_signup_invalid_email_rejected():
    with pytest.raises(ValueError):
        await _account_interactor().signup("not-an-email", "secret123", "닉")
