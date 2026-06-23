from __future__ import annotations

import logging

# goods_order_orm을 임포트해 Base.metadata에 등록 → create_all_tables가 테이블 생성.
from creative.adapter.outbound.orm.goods_order_orm import GoodsOrderOrm  # noqa: F401
from creative.adapter.outbound.repositories.goods_order_repository import MockGoodsOrderRepository
from creative.app.ports.input.goods_order_use_case import GoodsOrderUseCase
from creative.app.ports.output.goods_order_port import GoodsOrderPort
from creative.app.use_cases.goods_order_interactor import GoodsOrderInteractor

logger = logging.getLogger(__name__)


def get_goods_order_repository() -> GoodsOrderPort:
    """결제·제작 미연동 단계 → mock repository."""
    logger.info("[provider] goods_order: mock 데이터 사용")
    return MockGoodsOrderRepository()


def get_goods_order_use_case() -> GoodsOrderUseCase:
    return GoodsOrderInteractor(repository=get_goods_order_repository())
