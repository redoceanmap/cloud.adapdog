from __future__ import annotations

from dataclasses import dataclass, field
from typing import Optional

from map.domain.value_objects.pet_place_vo import PetSize
from map.domain.value_objects.route_planner_vo import TransportMode


@dataclass(frozen=True)
class TrailDto:
    """추천 둘레길(좌표 없는 코스) 응답 항목."""

    name: str
    intro: str
    length_km: Optional[float]
    duration: str
    start_point: str
    waypoints: str


@dataclass(frozen=True)
class CourseBrief:
    """동선 생성 요청 (인터랙터 → 에이전트, 인바운드 스키마와 분리)."""

    region: str
    days: int
    pet_size: PetSize
    pet_breed: Optional[str]
    transport: TransportMode = TransportMode.UNSET  # 이동수단 — 코스 후보·순서 차별화에 사용


@dataclass(frozen=True)
class PlannedStop:
    """에이전트가 정한 한 정류장."""

    id: int
    name: str
    category: str
    latitude: float
    longitude: float


@dataclass(frozen=True)
class CourseStopRef:
    """추천 분석용 현재 코스의 한 정류장 참조(좌표 불필요, 이름·카테고리만)."""

    name: str
    category: str


@dataclass(frozen=True)
class AgentCoursePlan:
    """에이전트의 동선 생성 결과 (순서 있는 정류장 + 설명 + 추천 둘레길)."""

    stops: list[PlannedStop]
    narrative: str
    trails: list[TrailDto] = field(default_factory=list)


@dataclass(frozen=True)
class CourseBuckets:
    """리듬 채움용 후보 풀 — 업종별 분류(카페/야외/문화). 식사는 RestaurantPort가 별도.

    코드가 하루 리듬(아침 산책→점심→카페→오후 명소→저녁)을 채울 때, 슬롯 성격에 맞는
    실제 시설을 여기서 근접순으로 고른다(LLM이 안 고른 카페·공원도 확보).
    """

    cafe: list["PlannedStop"] = field(default_factory=list)
    outdoor: list["PlannedStop"] = field(default_factory=list)
    culture: list["PlannedStop"] = field(default_factory=list)


@dataclass(frozen=True)
class ConversationTurn:
    """LLM 주도 대화 결과 — 자연스러운 답변 + 추출한 슬롯(빈 것만 채움) + 빠른 선택칩.

    slots는 {destination, transport, departure_time, nights, lodging, lodging_pref, interests}
    중 새로 파악된 키만 담는다(인터랙터가 빈 슬롯에만 머지). reply가 비면 결정형 폴백으로.
    """

    reply: str = ""
    slots: dict = field(default_factory=dict)
    suggestions: list[str] = field(default_factory=list)


@dataclass(frozen=True)
class ChatMessage:
    """대화 한 턴 (인터랙터 → 에이전트). role은 'user' | 'assistant'."""

    role: str
    content: str


@dataclass(frozen=True)
class ChatTurn:
    """에이전트의 대화 응답 — 답변 텍스트 + (코스 확정 시) 동선 계획.

    plan이 None이면 아직 대화 단계(코스 미확정). region은 응답 코스 라벨용.
    """

    reply: str
    region: Optional[str] = None
    plan: Optional[AgentCoursePlan] = None


@dataclass(frozen=True)
class RouteStopDto:
    order: int
    name: str
    category: str
    latitude: float
    longitude: float
    distance_from_prev_km: float = 0.0
    similarity: int = 0  # 닮은친구% — 같은 크기 코호트의 방문 인기도
    reason: str = ""     # 왜 이 장소 — 규칙 기반 한 줄(반려견 특징 반영)
    source: str = ""     # 출처 태그(예: 한국문화정보원 펫동반 문화시설)
    day: int = 1                          # 며칠째(1부터)
    time_slot: str = "morning"            # 시간대 블록(morning/lunch/dinner)
    clock: str = ""                       # 기준 시각 "HH:MM"
    is_meal: bool = False                 # 식사(음식점) 정류장 여부
    is_mock: bool = False                 # 목업(MVP 데모용 예시) 정류장 여부
    image_url: Optional[str] = None       # 음식점 썸네일 URL(있을 때)
    phone: Optional[str] = None           # 음식점 대표 전화
    address: Optional[str] = None         # 음식점 주소


@dataclass(frozen=True)
class LodgingDto:
    """목적지 펫 동반 숙소(숙박 계획 시 자동 추천)."""

    name: str
    category: str
    latitude: float
    longitude: float
    source: str = ""


@dataclass(frozen=True)
class StopoverDto:
    """자차 이동 시 출발→목적지 경로상의 경유지(펫 동반 명소·휴게)."""

    name: str
    category: str
    latitude: float
    longitude: float
    reason: str = ""
    source: str = ""


@dataclass(frozen=True)
class RoutePlanResponse:
    region: str
    pet_size: str
    stop_count: int
    total_distance_km: float
    summary: str
    stops: list[RouteStopDto]
    recommended_trails: list[TrailDto] = field(default_factory=list)
    lodging: list[LodgingDto] = field(default_factory=list)         # 숙박 계획 시 추천 숙소
    stopovers: list[StopoverDto] = field(default_factory=list)      # 자차 경유지(서울→전주)


@dataclass(frozen=True)
class TripPlanDto:
    """대화형 플래너의 누적 상태(요청·응답 왕복용). 도메인 TripPlan의 직렬화 표현."""

    origin: str
    destination: Optional[str]
    transport: str   # TransportMode 값(ktx/bus/car/unset)
    departure_time: Optional[str]  # 서울 출발시각 "HH:MM"(미정이면 None)
    lodging: str     # LodgingOption 값(overnight/daytrip/unset)
    nights: int      # 묵는 박 수(0=당일치기)
    stage: str       # PlannerStage 값(다음에 채울 단계)
    lodging_pref: Optional[str] = None   # 숙소 취향·위치(선택)
    interests: Optional[str] = None      # 여행 스타일(선택)
    pet_mobility: Optional[str] = None   # 이동 성향(선택)


@dataclass(frozen=True)
class RouteChatResponse:
    """대화형 동선 플래너 응답 — AI 답변 + 누적 상태 + 빠른 선택칩 + (확정 시) 추천 코스."""

    reply: str
    plan: TripPlanDto
    suggestions: list[str] = field(default_factory=list)
    course: Optional[RoutePlanResponse] = None


@dataclass(frozen=True)
class AlternativeDto:
    """정류장 스왑 대안 — 같은 종류의 다른 펫동반 장소(좌표·이유·대상과의 거리)."""

    name: str
    category: str
    latitude: float
    longitude: float
    reason: str
    distance_km: float


@dataclass(frozen=True)
class SwapAlternativesResponse:
    """정류장 스왑 응답 — 대상 자리에 갈 같은 종류 대안들(거리순) + 더 멀리 페이지 안내."""

    reply: str
    target_name: str
    alternatives: list[AlternativeDto] = field(default_factory=list)
    next_offset: int = 0
    has_more: bool = False
