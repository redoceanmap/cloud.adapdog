from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status

from core.introduction import IntroductionSchema
from users.adapter.inbound.api.schemas.account_schema import (
    AccountSchema,
    LoginResponse,
    LoginSchema,
    SignupResponse,
    SignupSchema,
)
from users.adapter.inbound.api.schemas.pet_schema import PetSchema
from users.app.ports.input.account_use_case import AccountUseCase
from users.app.ports.input.pet_use_case import PetUseCase
from users.app.use_cases.account_interactor import (
    EmailAlreadyExistsError,
    InvalidCredentialsError,
)
from users.dependencies.account_provider import get_account_use_case, get_current_account
from users.dependencies.pet_provider import get_pet_use_case
from users.domain.entities.account_entity import Account

account_router = APIRouter(prefix="/account", tags=["account"])


@account_router.post("/signup")
async def signup(
    body: SignupSchema,
    account_use_case: AccountUseCase = Depends(get_account_use_case),
    pet_use_case: PetUseCase = Depends(get_pet_use_case),
) -> SignupResponse:
    """회원 + 반려동물 동시 등록. 견종으로 크기·체질·기질이 자동완성된다.

    인바운드 어댑터가 두 use case를 조율한다(인터랙터 간 결합 회피).
    """
    try:
        account, token = await account_use_case.signup(body.email, body.password, body.nickname)
    except ValueError as e:  # 이메일 형식 오류
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except EmailAlreadyExistsError:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="이미 가입된 이메일입니다")

    pet = await pet_use_case.register(
        account_id=account.id,
        name=body.pet.name,
        breed=body.pet.breed,
        photo_url=body.pet.photo_url,
        birth_year=body.pet.birth_year,
        gender=body.pet.gender,
        features=body.pet.features,
    )
    return SignupResponse(
        access_token=token,
        account=AccountSchema(id=account.id, email=account.email, nickname=account.nickname),
        pet=PetSchema.from_entity(pet),
    )


@account_router.post("/login")
async def login(
    body: LoginSchema,
    account_use_case: AccountUseCase = Depends(get_account_use_case),
) -> LoginResponse:
    """이메일·비밀번호로 로그인하고 access token과 회원 정보를 발급한다."""
    try:
        account, token = await account_use_case.login(body.email, body.password)
    except InvalidCredentialsError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="이메일 또는 비밀번호가 올바르지 않습니다"
        )
    return LoginResponse(
        access_token=token,
        account=AccountSchema(id=account.id, email=account.email, nickname=account.nickname),
    )


@account_router.get("/me")
async def get_me(account: Account = Depends(get_current_account)) -> AccountSchema:
    """현재 로그인한 회원 정보(닉네임 포함)."""
    return AccountSchema(id=account.id, email=account.email, nickname=account.nickname)


@account_router.get("/myself", tags=["자기소개 (연동 검증)"])
async def introduce_myself(
    account_use_case: AccountUseCase = Depends(get_account_use_case),
) -> IntroductionSchema:
    """연동 검증용 자기소개 — router→use case→interactor→port→repository 전 계층 확인."""
    intro = await account_use_case.introduce_myself()
    intro.trail.append("router")
    return IntroductionSchema.from_entity(intro)
