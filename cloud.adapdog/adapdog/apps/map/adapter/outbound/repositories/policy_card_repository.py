from __future__ import annotations

import asyncio
import json
import logging
import re

from map.app.ports.output.policy_card_port import PolicyCardParserPort
from map.domain.value_objects.policy_card_vo import BadgeType

logger = logging.getLogger(__name__)

# 규칙기반 키워드 → 배지 매핑
_KEYWORDS: list[tuple[tuple[str, ...], BadgeType]] = [
    (("이동장", "케이지", "캐리어"), BadgeType.CARRIER_REQUIRED),
    (("소형",), BadgeType.SMALL_ONLY),
    (("실내",), BadgeType.INDOOR_OK),
    (("실외", "야외"), BadgeType.OUTDOOR_ONLY),
    (("목줄", "리드줄"), BadgeType.LEASH_REQUIRED),
    (("입마개",), BadgeType.MUZZLE_REQUIRED),
    (("배변", "봉투", "배변봉투"), BadgeType.WASTE_BAG),
    (("요금", "유료", "비용", "추가금"), BadgeType.EXTRA_FEE),
]


def _rule_based_badges(text: str) -> list[BadgeType]:
    """키워드 매칭 배지 추출 — 규칙기반 파서이자 Gemini 실패 시 폴백."""
    badges: list[BadgeType] = []
    for keywords, badge in _KEYWORDS:
        if any(k in text for k in keywords) and badge not in badges:
            badges.append(badge)
    return badges


class RuleBasedPolicyCardParser(PolicyCardParserPort):
    """규칙기반 폴백 파서 — 키워드 매칭."""

    async def parse(self, text: str) -> list[BadgeType]:
        badges = _rule_based_badges(text)
        logger.info("[RuleBasedPolicyCardParser] %d badges", len(badges))
        return badges


class GeminiPolicyCardParser(PolicyCardParserPort):
    """Gemini 기반 파서 — 규정 텍스트를 표준 배지 코드로 분류."""

    def __init__(self, api_key: str, model_name: str) -> None:
        import google.generativeai as genai

        self.model_name = model_name
        self._genai = genai
        genai.configure(api_key=api_key)

    async def parse(self, text: str) -> list[BadgeType]:
        try:
            return await asyncio.to_thread(self._run, text)
        except Exception as e:  # noqa: BLE001 — Gemini 장애 시 규칙기반 폴백(서비스 유지)
            logger.warning("[GeminiPolicyCardParser] Gemini 실패 → 규칙기반 폴백 | %s", e)
            return _rule_based_badges(text)

    def _run(self, text: str) -> list[BadgeType]:
        allowed = ", ".join(b.value for b in BadgeType)
        system = (
            "당신은 반려동물 시설 규정을 표준 배지로 분류하는 분류기입니다. "
            f"허용 코드: [{allowed}]. 규정 텍스트에 해당하는 코드만 고르세요. "
            '오직 JSON으로만 답하세요: {"badges": ["코드", ...]}'
        )
        model = self._genai.GenerativeModel(self.model_name, system_instruction=system)
        resp = model.generate_content(f"규정 텍스트: {text}")
        return _parse_badges(resp.text)


def _parse_badges(text: str) -> list[BadgeType]:
    match = re.search(r"\{.*\}", text, re.DOTALL)
    if not match:
        return []
    try:
        data = json.loads(match.group(0))
    except json.JSONDecodeError:
        return []
    out: list[BadgeType] = []
    for code in data.get("badges", []):
        badge = BadgeType.from_code(str(code))
        if badge is not None and badge not in out:
            out.append(badge)
    return out
