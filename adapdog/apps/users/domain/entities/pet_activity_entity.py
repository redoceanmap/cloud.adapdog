from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime
from typing import Optional

from users.domain.value_objects.pet_activity_vo import ActionType


@dataclass
class PetActivity:
    """반려동물 행동 로그(도메인). 코호트 추천의 행동 신호.

    pet_id 단위로 기록한다 — 한 계정의 여러 반려동물은 서로 다른 특징 코호트라
    account가 아니라 pet에 묶는다. facility_id는 map 컨텍스트 시설의 논리 참조다.
    """

    id: Optional[int]
    pet_id: int
    facility_id: int
    action_type: ActionType
    occurred_at: Optional[datetime] = None
