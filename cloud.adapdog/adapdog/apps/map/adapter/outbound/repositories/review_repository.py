from __future__ import annotations

from typing import Optional

from map.app.ports.output.review_port import ReviewPort
from map.domain.entities.review_entity import Review

_SOURCE = "보호자 리뷰 기반(mock)"


class MockReviewRepository(ReviewPort):
    """데이터 없는 단계의 mock 후기 — 전주 펫 동반 시설 데모.

    실 후기 데이터 연동 전까지 사용. DbReviewRepository로 교체 시
    도메인/인터랙터는 무수정(OCP). 안전·규정과 무관한 참고용 후기다.
    """

    _DATA = (
        Review(1, 101, "전주 한옥마을 펫카페", "대형견도 환영이에요",
               "그늘이 많아 더위 걱정 없이 체리랑 다녀왔어요. 출처 태그가 있어 믿음이 가요.",
               4.8, "체리 보호자", _SOURCE),
        Review(2, 101, "전주 한옥마을 펫카페", "동반석이 편했어요",
               "목줄 필수라 안내가 명확했고, 직원분이 물그릇도 챙겨주셨어요.",
               4.6, "보리 보호자", _SOURCE),
        Review(3, 102, "전주 자만벽화마을", "산책하기 좋아요",
               "평지가 많아 관절 약한 아이도 무리 없이 걸었어요. 사진 포인트가 많아요.",
               4.5, "콩이 보호자", _SOURCE),
        Review(4, 103, "전주 덕진공원", "그늘과 물가가 시원해요",
               "더위 타는 우리 아이도 연못 옆에서 쉬어가며 즐겼어요.",
               4.7, "초코 보호자", _SOURCE),
    )

    async def find_reviews(
        self, facility_id: Optional[int], place_name: Optional[str]
    ) -> list[Review]:
        if facility_id is not None:
            matched = [r for r in self._DATA if r.facility_id == facility_id]
        elif place_name:
            matched = [r for r in self._DATA if place_name in r.place_name or r.place_name in place_name]
        else:
            matched = list(self._DATA)
        # 데모 안정 — 식별자가 시드와 안 맞아도 후기 탭이 비지 않게 일부를 보여준다.
        return matched or list(self._DATA[:2])
