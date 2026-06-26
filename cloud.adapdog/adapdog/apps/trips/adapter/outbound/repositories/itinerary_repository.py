from __future__ import annotations

from datetime import date
from typing import Optional

from trips.app.dtos.itinerary_dto import SaveItineraryInput
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

    _next_id = 100
    _saved: list[Itinerary] = []
    _deleted_ids: set[int] = set()

    def _rows_by_id(self) -> dict[int, Itinerary]:
        by_id: dict[int, Itinerary] = {}
        for it in self._DATA:
            if it.id not in MockItineraryRepository._deleted_ids:
                by_id[it.id] = it
        for it in MockItineraryRepository._saved:
            by_id[it.id] = it
        return by_id

    def _build_row(self, itinerary_id: int, data: SaveItineraryInput, created_at: str | None = None) -> Itinerary:
        stops = [
            ItineraryStop(
                order=s.order,
                name=s.name,
                category=s.category,
                latitude=s.latitude,
                longitude=s.longitude,
            )
            for s in data.stops
        ]
        return Itinerary(
            id=itinerary_id,
            pet_id=data.pet_id,
            title=data.title,
            region=data.region,
            prompt_text=data.prompt_text,
            is_saved=True,
            created_at=created_at or date.today().isoformat(),
            stops=stops,
        )

    async def find_itineraries(self, pet_id: Optional[int]) -> list[Itinerary]:
        rows = list(self._rows_by_id().values())
        if pet_id is not None:
            return [it for it in rows if it.pet_id == pet_id]
        return rows

    async def save_itinerary(self, data: SaveItineraryInput) -> Itinerary:
        MockItineraryRepository._next_id += 1
        row = self._build_row(MockItineraryRepository._next_id, data)
        MockItineraryRepository._saved.append(row)
        return row

    async def update_itinerary(self, itinerary_id: int, data: SaveItineraryInput) -> Itinerary | None:
        existing = self._rows_by_id().get(itinerary_id)
        if existing is None:
            return None
        row = self._build_row(itinerary_id, data, created_at=existing.created_at)
        for i, saved in enumerate(MockItineraryRepository._saved):
            if saved.id == itinerary_id:
                MockItineraryRepository._saved[i] = row
                return row
        MockItineraryRepository._saved.append(row)
        return row

    async def delete_itinerary(self, itinerary_id: int) -> bool:
        if itinerary_id not in self._rows_by_id():
            return False
        MockItineraryRepository._saved = [
            row for row in MockItineraryRepository._saved if row.id != itinerary_id
        ]
        MockItineraryRepository._deleted_ids.add(itinerary_id)
        return True
