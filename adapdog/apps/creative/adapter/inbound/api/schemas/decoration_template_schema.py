from __future__ import annotations

from pydantic import BaseModel

from creative.app.dtos.decoration_template_dto import DecorationTemplateDto


class DecorationTemplateResponseSchema(BaseModel):
    """템플릿 응답 스키마 (adapter 계층 — API 표현). DTO와 분리해 계층 경계를 지킨다."""

    id: int
    name: str
    theme: str
    thumbnail_url: str
    source: str

    @classmethod
    def from_dto(cls, dto: DecorationTemplateDto) -> "DecorationTemplateResponseSchema":
        return cls(
            id=dto.id,
            name=dto.name,
            theme=dto.theme,
            thumbnail_url=dto.thumbnail_url,
            source=dto.source,
        )
