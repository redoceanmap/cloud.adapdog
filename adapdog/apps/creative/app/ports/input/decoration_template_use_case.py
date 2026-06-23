from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Optional

from creative.app.dtos.decoration_template_dto import DecorationTemplateDto


class DecorationTemplateUseCase(ABC):
    """꾸미기 템플릿 조회 입력 포트."""

    @abstractmethod
    async def list_templates(self, theme: Optional[str] = None) -> list[DecorationTemplateDto]:
        """테마(선택)로 템플릿을 조회한다. theme이 없으면 전체."""
        ...
