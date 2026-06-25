from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class Review:
    """시설 후기 — 시설상세(둘러보기/플래너)의 '후기' 탭 한 항목.

    원천: 보호자 리뷰 기반(현재는 mock). 안전·규정 판정과 무관한 참고용 후기다.
    """

    id: int
    facility_id: int
    place_name: str
    title: str        # 한 줄 요지 (예: "대형견도 환영이에요")
    body: str         # 후기 본문
    rating: float     # 평점 (0.0~5.0)
    author: str       # 작성자 (예: "체리 보호자")
    source: str       # 출처 태그 (예: "보호자 리뷰 기반")
