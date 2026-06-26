from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class BadgeItem:
    code: str
    label: str


@dataclass(frozen=True)
class PolicyCardResponse:
    source_text: str
    badges: list[BadgeItem]
