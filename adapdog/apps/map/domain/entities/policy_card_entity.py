from __future__ import annotations

from dataclasses import dataclass, field

from map.domain.value_objects.policy_card_vo import BadgeType


@dataclass
class PolicyCard:
    """지저분한 규정 텍스트를 표준 배지 집합으로 정리한 정책 카드."""

    source_text: str
    badges: list[BadgeType] = field(default_factory=list)

    def add(self, badge: BadgeType) -> None:
        if badge not in self.badges:
            self.badges.append(badge)
