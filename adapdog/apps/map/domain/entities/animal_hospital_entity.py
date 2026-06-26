from __future__ import annotations

from dataclasses import dataclass

from map.domain.value_objects.pet_place_vo import Coordinate


@dataclass(frozen=True)
class AnimalHospital:
    """응급 시 안내할 동물병원. 행안부 동물병원 표준데이터 1행에 대응.

    영업 상태·전화·좌표를 갖고, 24시 여부는 상호명에서 추론한다(표준데이터에 운영시간 없음).
    """

    name: str
    coordinate: Coordinate
    phone: str
    road_address: str
    is_open: bool  # 영업상태명 == '영업/정상'

    @property
    def is_24h(self) -> bool:
        """상호명에 '24시'가 들어가면 24시 응급으로 본다(표준데이터에 운영시간 부재)."""
        n = self.name.replace(" ", "")
        return "24시" in n or "24時" in n or "24h" in n.lower()
