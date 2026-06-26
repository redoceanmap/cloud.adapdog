from __future__ import annotations

import logging

# reservation_orm을 임포트해 Base.metadata에 등록 → create_all_tables가 테이블 생성.
from trips.adapter.outbound.orm.reservation_orm import ReservationOrm  # noqa: F401
from trips.adapter.outbound.repositories.reservation_repository import MockReservationRepository
from trips.app.ports.input.reservation_use_case import ReservationUseCase
from trips.app.ports.output.reservation_port import ReservationPort
from trips.app.use_cases.reservation_interactor import ReservationInteractor

logger = logging.getLogger(__name__)


def get_reservation_repository() -> ReservationPort:
    """예약 DB 미연동 단계 → mock repository."""
    logger.info("[provider] reservation: mock 데이터 사용")
    return MockReservationRepository()


def get_reservation_use_case() -> ReservationUseCase:
    return ReservationInteractor(repository=get_reservation_repository())
