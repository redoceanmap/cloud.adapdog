from __future__ import annotations

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
    def from_raw(cls, raw: Optional[str]) -> "LodgingOption":
        """대화 문장에서 숙박 여부를 추출. 못 찾으면 UNSET(다시 물어봄)."""
        if not raw:
            return cls.UNSET
        text = raw.strip().lower()
        if any(k in text for k in ("당일", "당일치기", "안 자", "안자", "데이트립", "하루만")):
            return cls.DAYTRIP
        # '박'은 '박물관'과 충돌하므로 '1박'·'박2일' 등 구체 토큰만 본다.
        if any(k in text for k in ("1박", "2박", "박2일", "박3일", "숙박", "자고", "잘래",
                                   "잘 거", "잘거", "묵", "하룻밤", "오버나잇")):
            return cls.OVERNIGHT
        return cls.UNSET

    @property
    def label(self) -> str:
        return {LodgingOption.OVERNIGHT: "1박 이상", LodgingOption.DAYTRIP: "당일치기",
                LodgingOption.UNSET: "미정"}[self]


class PlannerStage(str, Enum):
    """대화 핑퐁 단계 — 다음에 채울 슬롯. TripPlan.next_stage()가 결정한다."""

    ASK_DESTINATION = "ask_destination"
    ASK_TRANSPORT = "ask_transport"
    ASK_LODGING = "ask_lodging"
    READY = "ready"
