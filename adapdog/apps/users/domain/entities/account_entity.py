from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime
from typing import Optional


@dataclass
class Account:
    """회원(사람). 반려동물의 소유자이며, 인증의 주체.

    사람 정보는 최소화한다(이메일·닉네임). 비밀번호는 평문을 보관하지 않고
    해시(password_hash)만 가진다.
    """

    id: Optional[int]
    email: str
    password_hash: str
    nickname: str
    created_at: Optional[datetime] = None
