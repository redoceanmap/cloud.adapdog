from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class EntryVerdictResponse:
    place_name: str
    pet_name: str
    verdict: str
    conditions: list[str]
    message: str
