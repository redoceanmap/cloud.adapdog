from __future__ import annotations

from dataclasses import dataclass
from typing import Optional

from map.domain.value_objects.pet_place_vo import Coordinate


@dataclass
class Restaurant:
    """식사 정류장 후보 식당(도메인 노드).

    원천: 전주시 음식점기본정보(좌표·전화·업태) + 음식점이미지정보(썸네일).
    펫동반 여부는 한국문화정보원 펫동반 문화시설 데이터와 식당명으로 매칭해 표시한다
    (매칭되는 식당이 우선 배치된다).
    """

    name: str
    coordinate: Coordinate
    category: str                      # 업태(한식/카페/중국식 등)
    phone: Optional[str] = None
    address: Optional[str] = None
    image_url: Optional[str] = None    # 식당 이미지 URL(없을 수 있음)
    pet_friendly: bool = False         # 펫동반 문화시설 데이터에 등록된 식당/카페인가
    recommended: bool = False          # 전주시 모범음식점(위생·품질 지정)에 등록된 식당인가
