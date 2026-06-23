from __future__ import annotations

from community.app.ports.output.community_post_port import CommunityPostPort
from community.domain.entities.community_post_entity import CommunityPost


class MockCommunityPostRepository(CommunityPostPort):
    """데이터 없는 단계의 mock 코스 후기 — 전주 데모 시나리오용.

    DB 시드로 전환 시 DbCommunityPostRepository로 교체하면 도메인/인터랙터는
    무수정(OCP). like_count는 그때 post_like 집계로 채운다.
    """

    _DATA = (
        CommunityPost(
            1, 101, 11, 1001,
            "한옥마을 펫카페 코스 최고",
            "전주 한옥마을 펫카페 코스 다녀왔어요. 체리가 너무 좋아했네요!",
            "2026-06-10", 24,
        ),
        CommunityPost(
            2, 102, 12, 1002,
            "그늘 산책 코스 더위 걱정 없음",
            "한여름에도 그늘이 많은 산책 코스라 더위 걱정 없이 걸었습니다.",
            "2026-06-12", 18,
        ),
        CommunityPost(
            3, 103, 13, 1003,
            "닮은 친구 추천 따라가봄",
            "우리 아이랑 닮은 친구가 추천한 코스를 따라가봤는데 만족스러웠어요.",
            "2026-06-15", 12,
        ),
    )

    async def find_posts(self) -> list[CommunityPost]:
        return list(self._DATA)
