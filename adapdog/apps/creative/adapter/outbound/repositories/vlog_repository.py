from __future__ import annotations

from typing import Optional

from creative.app.ports.output.vlog_port import VlogPort
from creative.domain.entities.vlog_entity import Vlog, VlogClip


class MockVlogRepository(VlogPort):
    """데이터 없는 단계의 mock 브이로그 — 체리 데모 시나리오용.

    영상 자동 편집 연동 전까지 사용. DB 시드로 전환 시 DbVlogRepository로
    교체하면 도메인/인터랙터는 무수정(OCP). pet_id=1은 체리.
    """

    _DATA = (
        Vlog(
            id=1,
            pet_id=1,
            itinerary_id=1,
            tone="따뜻한",
            video_url="https://cdn.adapdog.mock/vlog/cherry-jeonju.mp4",
            created_at="2026-06-22",
            clips=[
                VlogClip(1, "photo", "https://cdn.adapdog.mock/vlog/cherry-hanok-1.jpg"),
                VlogClip(2, "video", "https://cdn.adapdog.mock/vlog/cherry-walk-2.mp4"),
                VlogClip(3, "photo", "https://cdn.adapdog.mock/vlog/cherry-bibimbap-3.jpg"),
            ],
        ),
    )

    async def find_vlogs(self, pet_id: Optional[int]) -> list[Vlog]:
        if pet_id is not None:
            return [v for v in self._DATA if v.pet_id == pet_id]
        return list(self._DATA)
