from __future__ import annotations

from enum import Enum


class VerdictType(str, Enum):
    """입장 판정 결과."""

    ALLOWED = "allowed"          # 입장 가능
    CONDITIONAL = "conditional"  # 조건부 가능 (이동장 등)
    DENIED = "denied"            # 입장 불가
