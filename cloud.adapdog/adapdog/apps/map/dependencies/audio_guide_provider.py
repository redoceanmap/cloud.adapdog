from __future__ import annotations

import logging

# audio_guide_orm을 임포트해 Base.metadata에 등록 → create_all_tables가 테이블 생성.
from map.adapter.outbound.orm.audio_guide_orm import AudioGuideOrm  # noqa: F401
from map.adapter.outbound.repositories.audio_guide_repository import MockAudioGuideRepository
from map.app.ports.input.audio_guide_use_case import AudioGuideUseCase
from map.app.ports.output.audio_guide_port import AudioGuidePort
from map.app.use_cases.audio_guide_interactor import AudioGuideInteractor

logger = logging.getLogger(__name__)


def get_audio_guide_repository() -> AudioGuidePort:
    """오디오 가이드 데이터 미연동 단계 → mock repository."""
    logger.info("[provider] audio_guide: mock 데이터 사용")
    return MockAudioGuideRepository()


def get_audio_guide_use_case() -> AudioGuideUseCase:
    return AudioGuideInteractor(repository=get_audio_guide_repository())
