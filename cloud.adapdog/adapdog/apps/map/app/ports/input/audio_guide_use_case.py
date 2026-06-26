from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Optional

from map.app.dtos.audio_guide_dto import AudioGuideDto


class AudioGuideUseCase(ABC):
    """오디오 가이드 조회 입력 포트."""

    @abstractmethod
    async def list_guides(self, facility_id: Optional[int] = None) -> list[AudioGuideDto]:
        """시설(선택)로 오디오 가이드를 조회한다. facility_id가 없으면 전체."""
        ...
