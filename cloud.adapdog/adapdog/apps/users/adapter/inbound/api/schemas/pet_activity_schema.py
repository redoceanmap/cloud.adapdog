from __future__ import annotations

from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field


class PetActivityRecordSchema(BaseModel):
    """반려동물 행동 기록 요청. 사용자가 '방문했어요/저장' 버튼으로 남긴다."""

    pet_id: int = Field(..., description="행동 주체 반려동물 ID")
    facility_id: int = Field(..., description="대상 시설 ID")
    action_type: Literal["visit", "save"] = Field(
        "visit", description="행동 유형: visit(방문)/save(저장)"
    )

    model_config = {
        "json_schema_extra": {
            "example": {"pet_id": 1, "facility_id": 42, "action_type": "visit"}
        }
    }


class PetActivitySchema(BaseModel):
    """반려동물 행동 응답."""

    id: int
    pet_id: int
    facility_id: int
    action_type: str
    occurred_at: datetime

    @classmethod
    def from_entity(cls, activity) -> "PetActivitySchema":
        return cls(
            id=activity.id,
            pet_id=activity.pet_id,
            facility_id=activity.facility_id,
            action_type=activity.action_type.value,
            occurred_at=activity.occurred_at,
        )
