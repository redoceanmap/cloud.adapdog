from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Optional

from map.domain.entities.audio_guide_entity import AudioGuide


class AudioGuidePort(ABC):
    """오디오 가이드 데이터 조회 출력 포트. 구현체(mock/DB)는 repository에 둔다."""

    @abstractmethod
    async def find_guides(self, facility_id: Optional[int]) -> list[AudioGuide]:
        """시설(선택)로 오디오 가이드 도메인 엔티티를 조회한다."""
        ...
