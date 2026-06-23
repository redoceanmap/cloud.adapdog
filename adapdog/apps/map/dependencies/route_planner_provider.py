from __future__ import annotations

import logging
from functools import lru_cache

from fastapi import Depends

from core.config import GEMINI_API_KEY, GEMINI_MODEL, TRAIL_CSV_PATH
from map.adapter.outbound.repositories.route_planner_repository import (
    CsvTrailRepository,
    RuleBasedRoutePlannerAgent,
)
from map.app.ports.input.cohort_recommendation_use_case import CohortRecommendationUseCase
from map.app.ports.input.pet_place_use_case import PetPlaceUseCase
from map.app.ports.input.route_planner_use_case import RoutePlannerUseCase
from map.app.ports.output.route_planner_port import RoutePlannerAgentPort, TrailPort
from map.app.use_cases.route_planner_interactor import RoutePlannerInteractor
from map.dependencies.cohort_recommendation_provider import get_cohort_recommendation_use_case
from map.dependencies.pet_place_provider import get_pet_place_use_case

logger = logging.getLogger(__name__)


@lru_cache(maxsize=1)
def get_trail_port() -> TrailPort:
    """둘레길 CSV repo는 무상태·내부 캐시 보유 → 싱글톤으로 1회만 생성(요청마다 CSV 재파싱 방지)."""
    return CsvTrailRepository(csv_path=TRAIL_CSV_PATH)


def get_route_planner_agent(
    pet_place: PetPlaceUseCase = Depends(get_pet_place_use_case),
    trail_port: TrailPort = Depends(get_trail_port),
) -> RoutePlannerAgentPort:
    """GEMINI_API_KEY가 있으면 Gemini 에이전트, 없으면 규칙기반 폴백."""
    if GEMINI_API_KEY:
        from map.adapter.outbound.repositories.route_planner_repository import GeminiRoutePlannerAgent

        logger.info("[provider] Gemini 동선 에이전트 사용 | model=%s", GEMINI_MODEL)
        return GeminiRoutePlannerAgent(
            pet_place=pet_place, trail_port=trail_port, api_key=GEMINI_API_KEY, model_name=GEMINI_MODEL
        )

    logger.info("[provider] GEMINI_API_KEY 없음 → 규칙기반 폴백 에이전트")
    return RuleBasedRoutePlannerAgent(pet_place=pet_place, trail_port=trail_port)


def get_route_planner_use_case(
    agent: RoutePlannerAgentPort = Depends(get_route_planner_agent),
    cohort: CohortRecommendationUseCase = Depends(get_cohort_recommendation_use_case),
) -> RoutePlannerUseCase:
    return RoutePlannerInteractor(agent=agent, cohort=cohort)
