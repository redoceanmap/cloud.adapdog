from __future__ import annotations

import logging

from map.adapter.inbound.api.schemas.policy_card_schema import PolicyCardSchema
from map.app.dtos.policy_card_dto import BadgeItem, PolicyCardResponse
from map.app.ports.input.policy_card_use_case import PolicyCardUseCase
from map.app.ports.output.policy_card_port import PolicyCardParserPort
from map.domain.entities.policy_card_entity import PolicyCard

logger = logging.getLogger(__name__)


class PolicyCardInteractor(PolicyCardUseCase):
    """AI 정책 카드 인터랙터 — 파서 포트에 위임(DIP)."""

    def __init__(self, parser: PolicyCardParserPort) -> None:
        self.parser = parser

    async def parse_policy(self, schema: PolicyCardSchema) -> PolicyCardResponse:
        badges = await self.parser.parse(schema.text)
        card = PolicyCard(source_text=schema.text)
        for b in badges:
            card.add(b)
        logger.info("[PolicyCardInteractor] parsed %d badges", len(card.badges))
        return PolicyCardResponse(
            source_text=card.source_text,
            badges=[BadgeItem(code=b.value, label=b.label) for b in card.badges],
        )
