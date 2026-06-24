from __future__ import annotations

from typing import Optional

from pydantic import BaseModel, Field


class RoutePlannerSchema(BaseModel):
    """AI 펫 동선 플래너 요청."""

    region: str = Field(..., description="여행 지역 (예: 강릉)")
    days: int = Field(1, ge=1, le=14, description="여행 일수")
    pet_size: str = Field("medium", description="반려견 크기 (small / medium / large)")
    pet_breed: Optional[str] = Field(None, description="견종 (선택)")

    model_config = {
        "json_schema_extra": {
            "example": {
                "region": "강릉",
                "days": 2,
                "pet_size": "small",
                "pet_breed": "말티즈",
            }
        }
    }


class ChatMessageSchema(BaseModel):
    """대화 한 턴."""

    role: str = Field(..., description="user | assistant")
    content: str = Field(..., description="메시지 본문")


class RouteChatSchema(BaseModel):
    """대화형 AI 펫 동선 플래너 요청 — 멀티턴(서버 무상태, 클라이언트가 기록 전달)."""

    messages: list[ChatMessageSchema] = Field(..., description="대화 기록(시간순). 마지막이 최신 사용자 메시지")
    pet_size: str = Field("medium", description="반려견 크기 (small / medium / large)")
    pet_breed: Optional[str] = Field(None, description="견종 (선택)")

    model_config = {
        "json_schema_extra": {
            "example": {
                "messages": [{"role": "user", "content": "체리랑 전주 한옥마을 반나절 코스 짜줘"}],
                "pet_size": "large",
                "pet_breed": "골든 리트리버",
            }
        }
    }
