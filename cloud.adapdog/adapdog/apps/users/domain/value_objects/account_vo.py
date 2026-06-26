from __future__ import annotations

import re
from dataclasses import dataclass

_EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


@dataclass(frozen=True)
class Email:
    """이메일 VO. 형식을 보장한다. (순수 도메인 — 인프라 의존 없음)"""

    value: str

    def __post_init__(self) -> None:
        if not _EMAIL_RE.match(self.value):
            raise ValueError(f"이메일 형식이 올바르지 않습니다: {self.value}")
