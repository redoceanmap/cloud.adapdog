from __future__ import annotations

import re
from enum import Enum
from typing import Optional, Sequence

from map.domain.value_objects.pet_place_vo import Coordinate

# 좌표(Coordinate)·크기(PetSize) VO는 pet_place 슬라이스에서 재사용한다.


class TransportMode(str, Enum):
    """서울→전주 이동수단. 직행(KTX·고속버스)이면 전주 도착 후 코스만, 자차면 경유지를 더한다.

    전주는 공항이 없어 비행기는 없다(KTX·고속버스·자차만).
    """

    KTX = "ktx"
    BUS = "bus"        # 고속버스
    CAR = "car"        # 자차
    UNSET = "unset"

    @classmethod
    def from_raw(cls, raw: Optional[str]) -> "TransportMode":
        """대화 문장에서 이동수단을 추출. 못 찾으면 UNSET(다시 물어봄)."""
        if not raw:
            return cls.UNSET
        text = raw.strip().lower()
        # '기차'가 '차'와 충돌하므로 KTX(기차)를 먼저 판정한다.
        if any(k in text for k in ("ktx", "케이티엑스", "기차", "케티엑스")):
            return cls.KTX
        if "버스" in text:
            return cls.BUS
        if any(k in text for k in ("자차", "자가용", "자가", "운전", "드라이브")):
            return cls.CAR
        return cls.UNSET

    @property
    def is_direct(self) -> bool:
        """직행(목적지로 바로) 여부 — KTX·고속버스. 자차는 경유지가 있다."""
        return self in (TransportMode.KTX, TransportMode.BUS)

    @property
    def label(self) -> str:
        return {TransportMode.KTX: "KTX", TransportMode.BUS: "고속버스",
                TransportMode.CAR: "자차", TransportMode.UNSET: "미정"}[self]


class LodgingOption(str, Enum):
    """숙박 계획. OVERNIGHT면 목적지 펫 동반 숙소를 자동 추천한다."""

    OVERNIGHT = "overnight"  # 1박 이상
    DAYTRIP = "daytrip"      # 당일치기
    UNSET = "unset"

    @classmethod
    def nights_from_raw(cls, raw: Optional[str]) -> Optional[int]:
        """대화 문장에서 묵는 박 수를 추출. 당일치기=0, "N박"=N, 일반 숙박 표현=1,
        결정 못 하면 None(다시 물어봄). '박'은 '박물관'과 충돌하므로 숫자+박만 본다."""
        if not raw:
            return None
        text = raw.strip().lower()
        if any(k in text for k in ("당일", "당일치기", "안 자", "안자", "데이트립", "하루만")):
            return 0
        m = re.search(r"(\d+)\s*박", text)
        if m:
            return max(0, int(m.group(1)))
        if any(k in text for k in ("숙박", "자고", "잘래", "잘 거", "잘거", "묵", "하룻밤", "오버나잇")):
            return 1
        return None

    @classmethod
    def from_raw(cls, raw: Optional[str]) -> "LodgingOption":
        """대화 문장에서 숙박 여부를 추출. 못 찾으면 UNSET(다시 물어봄)."""
        nights = cls.nights_from_raw(raw)
        if nights is None:
            return cls.UNSET
        return cls.DAYTRIP if nights == 0 else cls.OVERNIGHT

    @property
    def label(self) -> str:
        return {LodgingOption.OVERNIGHT: "1박 이상", LodgingOption.DAYTRIP: "당일치기",
                LodgingOption.UNSET: "미정"}[self]


class PlannerStage(str, Enum):
    """대화 핑퐁 단계 — 다음에 채울 슬롯. TripPlan.next_stage()가 결정한다."""

    ASK_DESTINATION = "ask_destination"
    ASK_TRANSPORT = "ask_transport"
    ASK_DEPARTURE_TIME = "ask_departure_time"
    ASK_LODGING = "ask_lodging"
    READY = "ready"


def departure_time_from_raw(raw: Optional[str]) -> Optional[str]:
    """대화 문장에서 서울 출발시각을 "HH:MM"으로 추출. 못 찾으면 None(다시 물어봄).

    "오전 7시", "9시 반", "07:00", "오후 2시", "아침 일찍" 등을 처리한다.
    """
    if not raw:
        return None
    text = raw.strip()
    m = re.search(r"(\d{1,2})\s*:\s*(\d{2})", text)
    if m:
        h, mm = int(m.group(1)), int(m.group(2))
        if 0 <= h <= 23 and 0 <= mm <= 59:
            return f"{h:02d}:{mm:02d}"
    m = re.search(r"(\d{1,2})\s*시\s*(반)?", text)
    if m:
        h = int(m.group(1))
        mm = 30 if m.group(2) else 0
        # 오후/저녁/밤이면 12시간 보정(12시 제외).
        if any(k in text for k in ("오후", "저녁", "밤")) and h < 12:
            h += 12
        if 0 <= h <= 23:
            return f"{h:02d}:{mm:02d}"
    if any(k in text for k in ("새벽", "아침 일찍", "일찍", "이른")):
        return "07:00"
    return None


class TimeSlot(str, Enum):
    """하루를 나누는 시간대 블록 — 여정을 아침/점심/오후/저녁으로 묶는다."""

    MORNING = "morning"
    LUNCH = "lunch"
    AFTERNOON = "afternoon"
    DINNER = "dinner"

    @property
    def label(self) -> str:
        return {TimeSlot.MORNING: "아침", TimeSlot.LUNCH: "점심",
                TimeSlot.AFTERNOON: "오후", TimeSlot.DINNER: "저녁"}[self]


class SlotKind(str, Enum):
    """리듬 슬롯의 성격 — 코드가 하루 시간 배분을 소유하고, 슬롯마다 채울 업종을 정한다.

    가이드(일정설계 §3): 시간 슬롯은 코드가, 슬롯 내용은 데이터가 채운다.
    MEAL=식당, CAFE=카페 휴식, OUTDOOR=야외 명소·공원 산책, CULTURE=실내 문화(박물관·전시).
    """

    MEAL = "meal"
    CAFE = "cafe"
    OUTDOOR = "outdoor"
    CULTURE = "culture"


# 서울→전주 이동 소요(분). 숙소 체크아웃(분, 가이드: 11시 가정).
_TRAVEL_MIN = {TransportMode.KTX: 100, TransportMode.BUS: 170, TransportMode.CAR: 180}
_CHECKOUT_MIN = 11 * 60

# 하루 여행 리듬 — (시간대, 기준시각[분], 슬롯 성격). 사람의 자연스러운 하루:
# 아침 산책 → 점심 식당 → 카페 휴식 → 오후 명소 → 저녁 식당. "탐방 일색" 대신 리듬을 강제한다.
_DAY_RHYTHM: list[tuple[TimeSlot, int, SlotKind]] = [
    (TimeSlot.MORNING, 9 * 60 + 30, SlotKind.OUTDOOR),
    (TimeSlot.LUNCH, 12 * 60 + 30, SlotKind.MEAL),
    (TimeSlot.AFTERNOON, 14 * 60 + 30, SlotKind.CAFE),
    (TimeSlot.AFTERNOON, 16 * 60, SlotKind.CULTURE),
    (TimeSlot.DINNER, 18 * 60 + 30, SlotKind.MEAL),
]


def _hhmm(minutes: int) -> str:
    return f"{(minutes // 60) % 24:02d}:{minutes % 60:02d}"


def _to_minutes(clock: Optional[str]) -> Optional[int]:
    if not clock:
        return None
    try:
        h, m = clock.split(":")
        return int(h) * 60 + int(m)
    except (ValueError, AttributeError):
        return None


def meal_schedule(
    transport: TransportMode,
    departure_time: Optional[str],
    days: int,
    return_time: Optional[str] = None,
    heat_sensitive: bool = False,
) -> list[list[tuple[TimeSlot, str, SlotKind]]]:
    """일자별 여행 리듬 블록을 (슬롯, 'HH:MM', 성격) 리스트로 계산한다.

    - Day 1: 출발+이동으로 도착시각을 구해, 도착 이후 리듬만 포함(도착→카페·명소→저녁).
    - 중간 날: 아침 산책→점심→카페→오후 명소→저녁(풀 리듬, 활동 ~4개).
    - 마지막 날(다박): 체크아웃 11시 이후만, 저녁 제외(귀가시각이 있으면 그 전까지).
    - 더위 취약견: 비식사 활동을 한 개 덜어 하루를 더 여유롭게(가이드: 하루 4~5개, 노견·더위 3개).
    """
    arrival_min = None
    dep = _to_minutes(departure_time)
    if dep is not None:
        arrival_min = dep + _TRAVEL_MIN.get(transport, 150)
    ret_min = _to_minutes(return_time)

    schedule: list[list[tuple[TimeSlot, str, SlotKind]]] = []
    for d in range(1, days + 1):
        is_last = days > 1 and d == days
        blocks: list[tuple[TimeSlot, str, SlotKind]] = []
        for slot, clock, kind in _DAY_RHYTHM:
            if d == 1 and arrival_min is not None and clock < arrival_min:
                continue  # 도착 전은 건너뜀
            if is_last:
                if clock < _CHECKOUT_MIN:
                    continue  # 체크아웃 전은 건너뜀
                if ret_min is not None and clock > ret_min:
                    continue  # 귀가 후는 건너뜀
                if ret_min is None and slot is TimeSlot.DINNER:
                    continue  # 귀가시각 미정이면 마지막 날 저녁 제외
            blocks.append((slot, _hhmm(clock), kind))
        if heat_sensitive:  # 비식사 활동이 3개 이상이면 마지막 1개를 덜어 여유롭게
            non_meal = [b for b in blocks if b[2] is not SlotKind.MEAL]
            if len(non_meal) >= 3:
                blocks.remove(non_meal[-1])
        if not blocks:  # 안전망 — 최소 점심은 보장
            blocks.append((TimeSlot.LUNCH, _hhmm(12 * 60 + 30), SlotKind.MEAL))
        schedule.append(blocks)
    return schedule


# 도시별 도착 기준점 — 코스 앵커·후보 정렬·거리 계산에 사용(전주만이 아님).
_CITY_ARRIVAL: dict[str, dict[TransportMode, tuple[float, float]]] = {
    "전주": {
        TransportMode.KTX: (35.8503, 127.1602),
        TransportMode.BUS: (35.8345, 127.1292),
        TransportMode.CAR: (35.8150, 127.1530),
    },
    "경주": {
        TransportMode.KTX: (35.7982, 129.1388),
        TransportMode.BUS: (35.8394, 129.2078),
        TransportMode.CAR: (35.8352, 129.2191),
    },
    "부산": {
        TransportMode.KTX: (35.1150, 129.0413),
        TransportMode.BUS: (35.1796, 129.0750),
        TransportMode.CAR: (35.1796, 129.0750),
    },
    "강릉": {
        TransportMode.KTX: (37.7519, 128.8761),
        TransportMode.BUS: (37.7720, 128.9000),
        TransportMode.CAR: (37.7519, 128.8960),
    },
    "여수": {
        TransportMode.KTX: (34.7604, 127.6622),
        TransportMode.BUS: (34.7604, 127.6622),
        TransportMode.CAR: (34.7604, 127.6622),
    },
    "속초": {
        TransportMode.KTX: (38.2058, 128.5640),
        TransportMode.BUS: (38.2058, 128.5640),
        TransportMode.CAR: (38.2058, 128.5900),
    },
}


def arrival_point(
    region: str,
    transport: TransportMode,
    places: Sequence[object] | None = None,
) -> Coordinate | None:
    """목적지·이동수단별 도착 좌표. 미등록 도시는 시설 풀 중심으로 추정."""
    if transport is TransportMode.UNSET:
        return None
    city = _CITY_ARRIVAL.get(region) or {}
    if transport in city:
        lat, lng = city[transport]
        return Coordinate(lat, lng)
    if places:
        coords = [p.coordinate for p in places if hasattr(p, "coordinate")]
        if coords:
            lat = sum(c.latitude for c in coords) / len(coords)
            lng = sum(c.longitude for c in coords) / len(coords)
            return Coordinate(lat, lng)
    return None


def transport_hint(region: str, transport: TransportMode) -> str:
    """LLM 프롬프트용 이동수단·도착지 안내 — 지역명을 하드코딩하지 않는다."""
    if transport is TransportMode.KTX:
        return (
            f"이동수단: KTX({region}역 도착). 차가 없으니 역·도심 도보권 명소 중심으로, "
            "정류장 간 이동이 짧게 묶어주세요.\n"
        )
    if transport is TransportMode.BUS:
        return (
            f"이동수단: 고속버스({region} 터미널 도착). 차가 없으니 터미널·도심 도보권 명소 중심으로, "
            "대중교통으로 다니기 쉽게 묶어주세요.\n"
        )
    if transport is TransportMode.CAR:
        return (
            f"이동수단: 자차({region}까지). 외곽 명소도 포함해 폭넓게 묶어도 좋습니다. "
            "이동 구간은 대형견 체리의 휴식·창밖 구경 시간으로 활용하세요.\n"
        )
    return ""
