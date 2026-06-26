from __future__ import annotations

from typing import Optional

from fastapi import APIRouter, Depends

from map.adapter.inbound.api.schemas.audio_guide_schema import AudioGuideResponseSchema
from map.app.ports.input.audio_guide_use_case import AudioGuideUseCase
from map.dependencies.audio_guide_provider import get_audio_guide_use_case

audio_guide_router = APIRouter(prefix="/audio-guide", tags=["audio_guide"])


@audio_guide_router.get("")
async def list_guides(
    facility_id: Optional[int] = None,
    use_case: AudioGuideUseCase = Depends(get_audio_guide_use_case),
) -> list[AudioGuideResponseSchema]:
    """D4 관광지 오디오 가이드 — 시설(선택)로 조회."""
    guides = await use_case.list_guides(facility_id)
    return [AudioGuideResponseSchema.from_dto(g) for g in guides]
