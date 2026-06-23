from __future__ import annotations

from typing import Optional

from users.app.ports.output.pet_stamp_port import PetStampPort
from users.domain.entities.pet_stamp_entity import PetStamp


class MockPetStampRepository(PetStampPort):
    """데이터 없는 단계의 mock 수집 스탬프 — 체리 데모 시나리오용.

    스탬프 적립 파이프라인 연동 전까지 사용. DB 시드로 전환 시
    DbPetStampRepository로 교체하면 도메인/인터랙터는 무수정(OCP).
    """

    _DATA = (
        PetStamp(1, 1, "경기전", "2026-06-21"),
        PetStamp(1, 2, "전동성당", "2026-06-21"),
        PetStamp(1, 3, "오목대", "2026-06-22"),
    )

    async def find_stamps(self, pet_id: Optional[int]) -> list[PetStamp]:
        if pet_id is not None:
            return [s for s in self._DATA if s.pet_id == pet_id]
        return list(self._DATA)
