from __future__ import annotations

import re
from enum import Enum
from typing import Optional

# 좌표(Coordinate)·크기(PetSize) VO는 pet_place 슬라이스에서 재사용한다.
# (map.domain.value_objects.pet_place_vo) 아래는 대화형 플래너 전용 VO.


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
    """하루를 나누는 시간대 블록 — 여정을 아침/점심/저녁으로 묶는다."""

    MORNING = "morning"
    LUNCH = "lunch"
    DINNER = "dinner"

    @property
    def label(self) -> str:
        return {TimeSlot.MORNING: "아침", TimeSlot.LUNCH: "점심", TimeSlot.DINNER: "저녁"}[self]


# 식사/블록 기준 시각(자정 기준 분). 서울→전주 이동 소요(분). 숙소 체크아웃(분).
_SLOT_CLOCK = {TimeSlot.MORNING: 8 * 60 + 30, TimeSlot.LUNCH: 12 * 60 + 30, TimeSlot.DINNER: 18 * 60 + 30}
_TRAVEL_MIN = {TransportMode.KTX: 100, TransportMode.BUS: 170, TransportMode.CAR: 180}
_CHECKOUT_MIN = 10 * 60 + 30


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
) -> list[list[tuple[TimeSlot, str, bool]]]:
    """일자별 시간대 블록을 (슬롯, 'HH:MM', 식사여부) 리스트로 계산한다.

    - Day 1: 출발시각+이동시간으로 도착시각을 구해, 도착 이후 블록만 포함.
    - 중간 날: 아침·점심·저녁 모두(아침은 식사 없이 관광).
    - 마지막 날(다박): 체크아웃 10:30 이후 시작, 저녁 제외(귀가시각이 있으면 그 전까지).
    - 식사는 점심·저녁 항상, 아침은 Day 1에 아침 식사 시간까지 도착했을 때만.
    """
    arrival_min = None
    dep = _to_minutes(departure_time)
    if dep is not None:
        arrival_min = dep + _TRAVEL_MIN.get(transport, 150)
    ret_min = _to_minutes(return_time)

    schedule: list[list[tuple[TimeSlot, str, bool]]] = []
    for d in range(1, days + 1):
        is_last = days > 1 and d == days
        day_blocks: list[tuple[TimeSlot, str, bool]] = []
        for slot in (TimeSlot.MORNING, TimeSlot.LUNCH, TimeSlot.DINNER):
            clock = _SLOT_CLOCK[slot]
            if d == 1 and arrival_min is not None and clock < arrival_min:
                continue  # 도착 전 블록은 건너뜀
            if is_last:
                if clock < _CHECKOUT_MIN:
                    continue  # 체크아웃 전은 건너뜀
                if ret_min is not None and clock > ret_min:
                    continue  # 귀가 후는 건너뜀
                if ret_min is None and slot is TimeSlot.DINNER:
                    continue  # 귀가시각 미정이면 마지막 날 저녁 제외
            has_meal = slot in (TimeSlot.LUNCH, TimeSlot.DINNER) or (
                d == 1 and slot is TimeSlot.MORNING and arrival_min is not None
                and arrival_min <= _SLOT_CLOCK[TimeSlot.MORNING]
            )
            day_blocks.append((slot, _hhmm(clock), has_meal))
        if not day_blocks:  # 안전망 — 최소 점심 블록은 보장
            day_blocks.append((TimeSlot.LUNCH, _hhmm(_SLOT_CLOCK[TimeSlot.LUNCH]), True))
        schedule.append(day_blocks)
    return schedule
