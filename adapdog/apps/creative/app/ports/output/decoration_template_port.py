from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Optional

from creative.domain.entities.decoration_template_entity import DecorationTemplate


class DecorationTemplatePort(ABC):
    """템플릿 데이터 조회 출력 포트. 구현체(mock/DB)는 repository에 둔다."""

    @abstractmethod
    async def find_templates(self, theme: Optional[str]) -> list[DecorationTemplate]:
        """테마(선택)로 템플릿 도메인 엔티티를 조회한다."""
        ...
