from __future__ import annotations

import csv
import logging
from typing import Optional

from pyproj import Transformer

from core.introduction import Introduction
from map.app.ports.output.animal_hospital_port import AnimalHospitalPort
from map.domain.entities.animal_hospital_entity import AnimalHospital
from map.domain.value_objects.pet_place_vo import Coordinate

logger = logging.getLogger(__name__)

# 행안부 LOCALDATA 좌표계 = EPSG:2097(중부원점 TM, Bessel). 검증: 종로 명륜동 병원 → 37.585,126.997.
_TM_TO_WGS84 = Transformer.from_crs(2097, 4326, always_xy=True)


def _to_wgs84(x_raw: str, y_raw: str) -> Optional[Coordinate]:
    try:
        x, y = float(x_raw), float(y_raw)
    except (TypeError, ValueError):
        return None
    if x == 0 or y == 0:
        return None
    lng, lat = _TM_TO_WGS84.transform(x, y)
    try:
        return Coordinate(lat, lng)
    except ValueError:  # 변환 결과가 한반도 밖이면 폐기
        return None


class CsvAnimalHospitalRepository(AnimalHospitalPort):
    """행정안전부 전국 동물병원 표준데이터(cp949 CSV) 조회. TM→WGS84 변환 후 1회 캐시."""

    def __init__(self, csv_path: str) -> None:
        self.csv_path = csv_path
        self._cache: Optional[list[AnimalHospital]] = None

    def _load(self) -> list[AnimalHospital]:
        if self._cache is not None:
            return self._cache
        hospitals: list[AnimalHospital] = []
        try:
            with open(self.csv_path, encoding="cp949", newline="") as f:
                for r in csv.DictReader(f):
                    name = (r.get("사업장명") or "").strip()
                    if not name:
                        continue
                    coord = _to_wgs84(r.get("좌표정보(X)", ""), r.get("좌표정보(Y)", ""))
                    if coord is None:
                        continue
                    status = (r.get("영업상태명") or "").strip()
                    hospitals.append(AnimalHospital(
                        name=name,
                        coordinate=coord,
                        phone=(r.get("전화번호") or "").strip(),
                        road_address=(r.get("도로명주소") or r.get("지번주소") or "").strip(),
                        is_open=status in ("영업/정상", "영업"),
                    ))
        except FileNotFoundError:
            logger.warning("[CsvAnimalHospitalRepository] CSV 없음 | %s", self.csv_path)
            self._cache = []
            return self._cache
        self._cache = hospitals
        logger.info("[CsvAnimalHospitalRepository] 로드 | 병원=%d", len(hospitals))
        return hospitals

    async def find(self, region: Optional[str], open_only: bool) -> list[AnimalHospital]:
        import asyncio

        hospitals = await asyncio.to_thread(self._load)
        region = (region or "").strip()
        result = [
            h for h in hospitals
            if (not region or region in h.road_address)
            and (not open_only or h.is_open)
        ]
        logger.info("[CsvAnimalHospitalRepository] find | region=%s open_only=%s matched=%d",
                    region, open_only, len(result))
        return result

    async def introduce_myself(self) -> Introduction:
        return Introduction(
            context="map",
            feature="animal_hospital",
            message=f"응급 동물병원 안내(행안부 표준데이터 {len(self._load())}곳). 연동 정상!",
            trail=["repository"],
        )
