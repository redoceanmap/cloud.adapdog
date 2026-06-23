from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class DecorationTemplateDto:
    """꾸미기 템플릿 응답 항목 (use case 경계 밖으로 나가는 DTO)."""

    id: int
    name: str
    theme: str
    thumbnail_url: str
    source: str
