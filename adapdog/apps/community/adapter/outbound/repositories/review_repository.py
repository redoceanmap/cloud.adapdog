from __future__ import annotations

from typing import Optional

from community.app.ports.output.review_port import ReviewPort
from community.domain.entities.review_entity import Review


class MockReviewRepository(ReviewPort):
    """데이터 없는 단계의 mock 리뷰 — 전주 데모 시나리오용.

    DB 시드로 전환 시 DbReviewRepository로 교체하면 도메인/인터랙터는 무수정(OCP).
    """

    _DATA = (
        Review(1, 101, 201, "한옥마을 펫카페", 5,
               "강아지 동반 좌석이 넓고 직원분들이 친절했어요.", "2026-06-08"),
        Review(2, 102, 202, "덕진공원", 4,
               "산책하기 좋고 그늘도 많아요. 주차가 조금 아쉬웠습니다.", "2026-06-10"),
        Review(3, 103, 203, "그늘 산책로", 5,
               "여름에도 시원해서 우리 아이가 정말 좋아했어요.", "2026-06-12"),
    )

    async def find_reviews(self, facility_id: Optional[int]) -> list[Review]:
        if facility_id is not None:
            return [r for r in self._DATA if r.facility_id == facility_id]
        return list(self._DATA)
