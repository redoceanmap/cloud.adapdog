from __future__ import annotations

import logging

from core.config import GEMINI_API_KEY, GEMINI_MODEL
from map.adapter.outbound.repositories.policy_card_repository import RuleBasedPolicyCardParser
from map.app.ports.input.policy_card_use_case import PolicyCardUseCase
from map.app.ports.output.policy_card_port import PolicyCardParserPort
from map.app.use_cases.policy_card_interactor import PolicyCardInteractor

logger = logging.getLogger(__name__)


def get_policy_card_parser() -> PolicyCardParserPort:
    """GEMINI_API_KEY가 있으면 Gemini 파서, 없으면 규칙기반 폴백."""
    if GEMINI_API_KEY:
        from map.adapter.outbound.repositories.policy_card_repository import GeminiPolicyCardParser

        logger.info("[provider] Gemini 정책카드 파서 사용")
        return GeminiPolicyCardParser(api_key=GEMINI_API_KEY, model_name=GEMINI_MODEL)
    logger.info("[provider] GEMINI_API_KEY 없음 → 규칙기반 정책카드 파서")
    return RuleBasedPolicyCardParser()


def get_policy_card_use_case() -> PolicyCardUseCase:
    return PolicyCardInteractor(parser=get_policy_card_parser())
