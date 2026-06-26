from __future__ import annotations

from pydantic import BaseModel, Field


class PolicyCardSchema(BaseModel):
    """AI 정책 카드 요청 — 지저분한 규정 텍스트."""

    text: str = Field(..., description="시설 입장 규정 원문")

    model_config = {
        "json_schema_extra": {
            "example": {"text": "소형견에 한해 안고 입장 가능, 케이지(이동장) 지참 권장. 실내 동반 가능하나 목줄 필수."}
        }
    }
