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


class OptimizeStopSchema(BaseModel):
    """최적 경로 요청의 한 정류장(사용자가 추천 동선에서 선택한 곳)."""

    name: str
    category: str = ""
    latitude: float
    longitude: float


class RouteOptimizeSchema(BaseModel):
    """사용자가 고른 N곳을 출발점 기준 최적 순서로 재배열하는 요청."""

    region: str = Field("전주", description="코스 지역 라벨")
    pet_size: str = Field("medium", description="반려견 크기 (small / medium / large)")
    start_lat: Optional[float] = Field(None, description="출발점 위도(내 위치). 없으면 첫 정류장에서 시작")
    start_lng: Optional[float] = Field(None, description="출발점 경도")
    stops: list[OptimizeStopSchema] = Field(..., description="선택한 정류장들(순서 무관)")


class TripPlanSchema(BaseModel):
    """대화형 플래너의 누적 상태 — 클라이언트가 직전 응답의 plan을 그대로 다시 보낸다(서버 무상태)."""

    origin: str = Field("서울", description="출발지(데모 고정: 서울)")
    destination: Optional[str] = Field(None, description="목적지(예: 전주). 미정이면 null")
    transport: str = Field("unset", description="이동수단 ktx / bus / car / unset")
    departure_time: Optional[str] = Field(None, description="서울 출발시각 'HH:MM'(미정이면 null)")
    lodging: str = Field("unset", description="숙박 overnight / daytrip / unset")
    nights: int = Field(0, ge=0, le=14, description="묵는 박 수(0=당일치기)")
    lodging_pref: Optional[str] = Field(None, description="숙소 취향·위치(예: 한옥마을 근처/전주역 근처/예약 숙소명). 선택")
    interests: Optional[str] = Field(None, description="여행 스타일(예: 맛집·카페/문화·역사/자연·힐링/혼합). 선택")
    pet_mobility: Optional[str] = Field(None, description="이동 성향(예: 도보 위주/광역 OK). 동선 여유·범위 조정. 선택")


class RouteChatSchema(BaseModel):
    """대화형 AI 펫 동선 플래너 요청 — 멀티턴(서버 무상태, 클라이언트가 기록+상태 전달)."""

    messages: list[ChatMessageSchema] = Field(..., description="대화 기록(시간순). 마지막이 최신 사용자 메시지")
    plan: Optional[TripPlanSchema] = Field(None, description="직전 응답의 누적 상태(없으면 신규 대화)")
    pet_size: str = Field("medium", description="반려견 크기 (small / medium / large)")
    pet_breed: Optional[str] = Field(None, description="견종 (선택)")
    pet_traits: Optional[str] = Field(None, description="반려견 특징 요약(활동성향·사회성·체질) — AI가 기억해 추천에 반영")

    model_config = {
        "json_schema_extra": {
            "example": {
                "messages": [{"role": "user", "content": "체리랑 전주 한옥마을 반나절 코스 짜줘"}],
                "pet_size": "large",
                "pet_breed": "골든 리트리버",
            }
        }
    }


class CurrentStopSchema(BaseModel):
    """추천 분석용 현재 코스의 한 정류장(이름·카테고리만 있으면 됨)."""

    name: str
    category: str = ""
    latitude: float = 0.0
    longitude: float = 0.0


class SwapStopSchema(BaseModel):
    """정류장 스왑 요청 — 특정 정류장을 같은 종류의 다른 펫동반 장소로 교체할 후보를 받는다."""

    region: str = Field("전주", description="코스 지역")
    stop_name: str = Field(..., description="교체 대상 정류장명(예: 1723 카페)")
    stop_category: str = Field("", description="대상 카테고리(kind 추정용)")
    stop_lat: float = Field(..., description="대상 정류장 위도(거리 기준점)")
    stop_lng: float = Field(..., description="대상 정류장 경도")
    kind: Optional[str] = Field(None, description="cafe/culture/outdoor 중 하나(미지정이면 카테고리로 추정)")
    exclude_names: list[str] = Field(default_factory=list, description="이미 코스에 있는 정류장명(중복 제외)")
    offset: int = Field(0, ge=0, description="거리순 페이지 시작(더 멀리는 offset 증가)")
    pet_size: str = Field("medium", description="반려견 크기 (small / medium / large)")
    pet_breed: Optional[str] = Field(None, description="견종 (선택)")
    pet_traits: Optional[str] = Field(None, description="반려견 특징 요약")

    model_config = {
        "json_schema_extra": {
            "example": {
                "region": "전주", "stop_name": "1723 카페", "stop_category": "카페",
                "stop_lat": 35.8126, "stop_lng": 127.1517, "exclude_names": ["교동미술관", "교동떡갈비"],
                "offset": 0, "pet_size": "large", "pet_breed": "골든 리트리버",
            }
        }
    }


class RouteRecommendSchema(BaseModel):
    """코스 인지형 대화 추천 요청 — 현재 코스를 분석해 대안을 칩으로 제안(코스 재생성 X)."""

    messages: list[ChatMessageSchema] = Field(..., description="대화 기록(시간순). 마지막이 최신 사용자 메시지")
    current_course: list[CurrentStopSchema] = Field(default_factory=list, description="사용자가 편집 중인 현재 코스")
    plan: Optional[TripPlanSchema] = Field(None, description="누적 상태(지역·이동수단). 코스 echo·지역 추정용")
    pet_size: str = Field("medium", description="반려견 크기 (small / medium / large)")
    pet_breed: Optional[str] = Field(None, description="견종 (선택)")
    pet_traits: Optional[str] = Field(None, description="반려견 특징 요약(활동성향·사회성·체질)")

    model_config = {
        "json_schema_extra": {
            "example": {
                "messages": [{"role": "user", "content": "박물관이 너무 많은데 카페나 공원 추천해줘"}],
                "current_course": [{"name": "전주전통술박물관", "category": "박물관"}],
                "pet_size": "large",
                "pet_breed": "골든 리트리버",
            }
        }
    }
