from __future__ import annotations

from pydantic import BaseModel


class BreedProfileSchema(BaseModel):
    """견종 자동완성 프리뷰 응답."""

    breed: str
    size: str
    traits: list[str]
    temperament: str
