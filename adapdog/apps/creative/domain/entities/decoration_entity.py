from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class Decoration:
    """꾸미기 결과 — 반려동물 사진에 템플릿을 적용한 산출물(F3/F8).

    pet 종속(pet_id). template_id는 적용한 꾸미기 템플릿. 데이터는 mock 시드.
    """

    id: int
    pet_id: int
    template_id: int
    result_image_url: str
    model3d_url: str
    created_at: str  # ISO yyyy-mm-dd
