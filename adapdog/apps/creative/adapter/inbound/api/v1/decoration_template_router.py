from __future__ import annotations

from typing import Optional

from fastapi import APIRouter, Depends

from creative.adapter.inbound.api.schemas.decoration_template_schema import DecorationTemplateResponseSchema
from creative.app.ports.input.decoration_template_use_case import DecorationTemplateUseCase
from creative.dependencies.decoration_template_provider import get_decoration_template_use_case

decoration_template_router = APIRouter(prefix="/decoration-template", tags=["decoration-template"])


@decoration_template_router.get("")
async def list_templates(
    theme: Optional[str] = None,
    use_case: DecorationTemplateUseCase = Depends(get_decoration_template_use_case),
) -> list[DecorationTemplateResponseSchema]:
    """F1/F4 꾸미기 템플릿 갤러리 — 테마(선택)로 조회."""
    templates = await use_case.list_templates(theme)
    return [DecorationTemplateResponseSchema.from_dto(t) for t in templates]
