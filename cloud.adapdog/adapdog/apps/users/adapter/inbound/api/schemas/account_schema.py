from __future__ import annotations

from pydantic import BaseModel, Field

from users.adapter.inbound.api.schemas.pet_schema import PetRegisterSchema, PetSchema


class LoginSchema(BaseModel):
    """로그인 요청."""

    email: str = Field(..., description="가입 이메일")
    password: str = Field(..., description="비밀번호")


class TokenSchema(BaseModel):
    """JWT 발급 응답."""

    access_token: str
    token_type: str = "bearer"


class AccountSchema(BaseModel):
    """회원 정보 응답(비밀번호 제외)."""

    id: int
    email: str
    nickname: str


class SignupSchema(BaseModel):
    """회원가입 요청. 사람 정보는 최소화하고, 반려동물을 함께 등록한다."""

    email: str = Field(..., description="이메일")
    password: str = Field(..., description="비밀번호")
    nickname: str = Field(..., description="닉네임")
    pet: PetRegisterSchema = Field(..., description="반려동물 정보(사진·종·이름 필수)")


class SignupResponse(BaseModel):
    """회원가입 응답: 토큰 + 회원 + (자동완성된) 반려동물."""

    access_token: str
    token_type: str = "bearer"
    account: AccountSchema
    pet: PetSchema
