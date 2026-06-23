from __future__ import annotations

from typing import Optional

from trips.app.ports.output.itinerary_port import ItineraryPort
from trips.domain.entities.itinerary_entity import Itinerary, ItineraryStop


class MockItineraryRepository(ItineraryPort):
    """데이터 없는 단계의 mock 저장 코스 — 체리의 전주 데모 시나리오용.

    DB 시드로 전환 시 DbItineraryRepository로 교체하면 도메인/인터랙터는 무수정(OCP).
    """

    _DATA = (
        Itinerary(
            id=1,
            pet_id=1,
            title="체리랑 전주 한옥마을 반나절",
            region="전주",
            prompt_text="전주 한옥마을에서 체리랑 반나절 산책하기 좋은 코스 짜줘",
            is_saved=True,
            created_at="2026-06-10",
            stops=[
                ItineraryStop(1, "한옥마을 펫카페", "cafe", 35.8150, 127.1530),
                ItineraryStop(2, "자만벽화마을", "sightseeing", 35.8138, 127.1561),
                ItineraryStop(3, "오목대", "sightseeing", 35.8160, 127.1545),
            ],
        ),
        Itinerary(
            id=2,
            pet_id=1,
            title="전주 그늘 산책 코스",
            region="전주",
            prompt_text="더운 날 체리랑 그늘 많은 곳 위주로 전주 산책 코스",
            is_saved=True,
            created_at="2026-06-18",
            stops=[
                ItineraryStop(1, "덕진공원 연화정", "park", 35.8470, 127.1310),
                ItineraryStop(2, "전북대 후문 가로수길", "walk", 35.8460, 127.1290),
                ItineraryStop(3, "건지산 편백숲길", "trail", 35.8540, 127.1360),
                ItineraryStop(4, "송천동 반려견 운동장", "park", 35.8600, 127.1280),
            ],
        ),
    )

    async def find_itineraries(self, pet_id: Optional[int]) -> list[Itinerary]:
        if pet_id is not None:
            return [it for it in self._DATA if it.pet_id == pet_id]
        return list(self._DATA)
