from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class DecorationDto:
    """꾸미기 결과 응답 항목 (use case 경계 밖으로 나가는 DTO)."""

    id: int
    pet_id: int
    template_id: int
    result_image_url: str
    model3d_url: str
    created_at: str
