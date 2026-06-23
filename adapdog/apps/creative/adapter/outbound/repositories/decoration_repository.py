from __future__ import annotations

from typing import Optional

from creative.app.ports.output.decoration_port import DecorationPort
from creative.domain.entities.decoration_entity import Decoration


class MockDecorationRepository(DecorationPort):
    """데이터 없는 단계의 mock 꾸미기 결과 — 체리 데모 시나리오용.

    꾸미기 산출 연동 전까지 사용. DB 시드로 전환 시 DbDecorationRepository로
    교체하면 도메인/인터랙터는 무수정(OCP). pet_id=1은 체리.
    """

    _DATA = (
        Decoration(
            1, 1, 1,
            "https://cdn.adapdog.mock/decoration/cherry-hanbok.png",
            "",
            "2026-06-21",
        ),
        Decoration(
            2, 1, 3,
            "https://cdn.adapdog.mock/decoration/cherry-figure.png",
            "https://cdn.adapdog.mock/decoration/cherry-figure.glb",
            "2026-06-22",
        ),
    )

    async def find_decorations(self, pet_id: Optional[int]) -> list[Decoration]:
        if pet_id is not None:
            return [d for d in self._DATA if d.pet_id == pet_id]
        return list(self._DATA)
