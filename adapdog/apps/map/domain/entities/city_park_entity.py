from __future__ import annotations

from dataclasses import dataclass
from typing import Optional

from map.domain.value_objects.pet_place_vo import Coordinate


@dataclass(frozen=True)
class CityPark:
    """플래너 야외(산책) 슬롯 후보 공원(도메인 노드).

    원천: 전국 도시공원 표준데이터(좌표·공원구분). 강아지 산책에 적합한 공원을
    숙소·도착점 인근에서 골라 코스의 OUTDOOR 슬롯을 보강한다(놀이터성 어린이공원은 제외).
    """

    id: int
    name: str
    coordinate: Coordinate
    park_type: str                     # 공원구분(근린공원/수변공원/문화공원 등)
    address: Optional[str] = None
    phone: Optional[str] = None
