from __future__ import annotations

from typing import Optional

from community.app.ports.output.year_summary_port import YearSummaryPort
from community.domain.entities.year_summary_entity import YearSummary


class MockYearSummaryRepository(YearSummaryPort):
    """데이터 없는 단계의 mock 연말 결산 — 전주 데모 시나리오용.

    DB 시드로 전환 시 DbYearSummaryRepository로 교체하면 도메인/인터랙터는 무수정(OCP).
    """

    _DATA = (
        YearSummary(
            1, 1, 2026, 42.5, 23,
            "올해 체리는 전주 곳곳을 누볐어요. 한옥마을부터 덕진공원까지, "
            "총 42.5km를 함께 걸으며 23곳을 다녀왔답니다.",
            "2026-12-31",
        ),
    )

    async def find_summaries(self, pet_id: Optional[int]) -> list[YearSummary]:
        if pet_id is not None:
            return [s for s in self._DATA if s.pet_id == pet_id]
        return list(self._DATA)
