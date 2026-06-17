from __future__ import annotations

import asyncio
import json
import logging
import urllib.request
from datetime import datetime, timedelta, timezone
from typing import Any
from urllib.parse import urlencode

from map.app.ports.output.safety_alert_port import WeatherPort
from map.domain.value_objects.safety_alert_vo import Weather

logger = logging.getLogger(__name__)

# 목 데이터 — 키 없을 때 폴백.
_MOCK_WEATHER: dict[str, Weather] = {
    "강릉": Weather(temperature_c=32.0, condition="폭염"),
    "서울": Weather(temperature_c=29.0, condition="더움"),
}
_DEFAULT = Weather(temperature_c=22.0, condition="맑음")


class MockWeatherRepository(WeatherPort):
    """날씨 조회 포트의 목 구현."""

    async def current(self, region: str) -> Weather:
        weather = _MOCK_WEATHER.get(region.strip(), _DEFAULT)
        logger.info("[MockWeatherRepository] current | region=%s temp=%s", region, weather.temperature_c)
        return weather


# ── 기상청 초단기실황 (data.go.kr 1360000) 실 API 구현 ───────────────────────────
_KST = timezone(timedelta(hours=9))

# 지역명 → 기상청 격자(nx, ny). 부분일치(예: '서울특별시'·'서울' 모두 매칭). 미매칭 시 서울.
_REGION_GRID: dict[str, tuple[int, int]] = {
    "서울": (60, 127), "부산": (98, 76), "대구": (89, 90), "인천": (55, 124),
    "광주": (58, 74), "대전": (67, 100), "울산": (102, 84), "세종": (66, 103),
    "수원": (60, 121), "경기": (60, 121), "춘천": (73, 134), "강원": (73, 134),
    "강릉": (92, 131), "청주": (69, 106), "충북": (69, 106), "충남": (68, 100),
    "전주": (63, 89), "전북": (63, 89), "전남": (51, 67), "안동": (91, 106),
    "경북": (91, 106), "창원": (90, 77), "경남": (91, 77), "제주": (52, 38),
}
_DEFAULT_GRID = (60, 127)

# 강수형태(PTY) 코드 → 표시 상태.
_PTY = {"1": "비", "2": "비/눈", "3": "눈", "4": "소나기", "5": "빗방울", "6": "진눈깨비", "7": "눈날림"}


def _grid_for(region: str) -> tuple[int, int]:
    region = region.strip()
    for key, grid in _REGION_GRID.items():
        if key in region:
            return grid
    return _DEFAULT_GRID


def _condition(temp: float, pty: str) -> str:
    if pty in _PTY:
        return _PTY[pty]
    if temp >= 33:
        return "폭염"
    if temp <= -3:
        return "한파"
    return "맑음"


class KmaWeatherRepository(WeatherPort):
    """기상청 초단기실황(getUltraSrtNcst) 실 API 구현. 실패 시 목 기본값으로 폴백."""

    def __init__(self, endpoint: str, service_key: str) -> None:
        self.endpoint = endpoint
        self.service_key = service_key

    async def current(self, region: str) -> Weather:
        nx, ny = _grid_for(region)
        try:
            items = await asyncio.to_thread(self._fetch, nx, ny)
        except Exception as e:  # noqa: BLE001 — 외부 API 장애 시 서비스 유지
            logger.warning("[KmaWeatherRepository] region=%s 호출 실패 → 폴백 | %s", region, e)
            return _DEFAULT
        values = {it.get("category"): it.get("obsrValue") for it in items}
        try:
            temp = float(values.get("T1H"))
        except (TypeError, ValueError):
            logger.warning("[KmaWeatherRepository] region=%s T1H 없음 → 폴백 | values=%s", region, values)
            return _DEFAULT
        weather = Weather(temperature_c=temp, condition=_condition(temp, values.get("PTY", "0")))
        logger.info("[KmaWeatherRepository] region=%s nx=%s ny=%s temp=%s cond=%s",
                    region, nx, ny, temp, weather.condition)
        return weather

    def _fetch(self, nx: int, ny: int) -> list[dict[str, Any]]:
        base_date, base_time = self._base_datetime()
        params = urlencode({
            "serviceKey": self.service_key, "dataType": "JSON", "numOfRows": 60, "pageNo": 1,
            "base_date": base_date, "base_time": base_time, "nx": nx, "ny": ny,
        })
        with urllib.request.urlopen(f"{self.endpoint}?{params}", timeout=10) as resp:  # noqa: S310
            payload = json.loads(resp.read().decode("utf-8"))
        header = payload.get("response", {}).get("header", {})
        if header.get("resultCode") != "00":
            raise RuntimeError(f"KMA resultCode={header.get('resultCode')} msg={header.get('resultMsg')}")
        return payload["response"]["body"]["items"]["item"]

    @staticmethod
    def _base_datetime() -> tuple[str, str]:
        """초단기실황 기준시각 — 매 정시 생성, 약 10분 후 제공. 안전하게 15분 미만이면 한 시간 전."""
        now = datetime.now(_KST)
        if now.minute < 15:
            now -= timedelta(hours=1)
        return now.strftime("%Y%m%d"), now.strftime("%H00")
