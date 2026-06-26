from __future__ import annotations

from typing import Optional

from pydantic import BaseModel, Field


class PetRegisterSchema(BaseModel):
    """반려동물 등록 요청. 유저는 사진·종·이름만 필수로 입력한다."""

    name: str = Field(..., description="반려동물 이름")
    breed: str = Field(..., description="견종 (예: 시츄). 크기·체질·기질이 자동완성된다)")
    photo_url: str = Field(..., description="반려동물 사진 URL")
    birth_year: Optional[int] = Field(None, description="(선택) 출생 연도")
    gender: Optional[str] = Field(None, description="(선택) 성별: male/female")
    features: Optional[str] = Field(None, description="(선택) 자유 특징")

    model_config = {
        "json_schema_extra": {
            "example": {
                "name": "콩이",
                "breed": "시츄",
                "photo_url": "https://example.com/kong.jpg",
                "birth_year": 2021,
                "gender": "female",
                "features": "낯가림이 조금 있어요",
            }
        }
    }


class PetUpdateSchema(BaseModel):
    """반려동물 프로필 수정 요청(부분 갱신)."""

    name: Optional[str] = None
    breed: Optional[str] = None
    photo_url: Optional[str] = None
    birth_year: Optional[int] = None
    features: Optional[str] = None


class PetSchema(BaseModel):
    """반려동물 응답(자동완성된 크기·체질·기질 포함)."""

    id: int
    account_id: int
    name: str
    breed: str
    photo_url: str
    size: str
    traits: list[str]
    temperament: str
    birth_year: Optional[int] = None
    gender: str
    features: Optional[str] = None

    @classmethod
    def from_entity(cls, pet) -> "PetSchema":
        """Pet 도메인 엔티티를 응답 스키마로 변환(라우터·회원가입 공용)."""
        return cls(
            id=pet.id,
            account_id=pet.account_id,
            name=pet.name,
            breed=pet.breed,
            photo_url=pet.photo_url,
            size=pet.size.value,
            traits=sorted(t.value for t in pet.traits),
            temperament=pet.temperament,
            birth_year=pet.birth_year,
            gender=pet.gender.value,
            features=pet.features,
        )
