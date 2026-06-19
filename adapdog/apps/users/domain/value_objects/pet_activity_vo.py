from __future__ import annotations

from enum import Enum
from typing import Optional


class ActionType(str, Enum):
    """반려동물 행동 유형. 코호트 추천의 신호 종류."""

    VISIT = "visit"   # 방문했어요
    SAVE = "save"     # 저장(가고 싶어요)

    @classmethod
    def from_raw(cls, raw: Optional[str]) -> "ActionType":
        mapping = {
            "visit": cls.VISIT, "방문": cls.VISIT,
            "save": cls.SAVE, "저장": cls.SAVE, "찜": cls.SAVE,
        }
        action = mapping.get((raw or "").strip().lower())
        if action is None:
            raise ValueError(f"알 수 없는 행동 유형: {raw!r}")
        return action
