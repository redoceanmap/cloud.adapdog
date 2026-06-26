"""add city_park table and restaurant.recommended column

Revision ID: a1c2d3e4f5b6
Revises: f0ea5eab0222
Create Date: 2026-06-26 12:30:00.000000

전국 도시공원 표준데이터를 3NF 전용 테이블(city_park)로 적재해 플래너 야외(산책)
슬롯을 보강하고, 전주시 모범음식점 매칭 결과를 restaurant.recommended 품질 플래그로
추가한다. region 공유 차원을 재사용한다. (신규 테이블/컬럼만 남기도록 수동 정리.)
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a1c2d3e4f5b6'
down_revision: Union[str, Sequence[str], None] = 'f0ea5eab0222'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column(
        'restaurant',
        sa.Column('recommended', sa.Boolean(), nullable=False, server_default=sa.false()),
    )
    op.create_table('city_park',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('name', sa.String(), nullable=False),
    sa.Column('park_type', sa.String(), nullable=True),
    sa.Column('latitude', sa.Float(), nullable=False),
    sa.Column('longitude', sa.Float(), nullable=False),
    sa.Column('region_id', sa.Integer(), nullable=True),
    sa.Column('road_address', sa.String(), nullable=True),
    sa.Column('jibun_address', sa.String(), nullable=True),
    sa.Column('phone', sa.String(), nullable=True),
    sa.ForeignKeyConstraint(['region_id'], ['region.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_city_park_latitude'), 'city_park', ['latitude'], unique=False)
    op.create_index(op.f('ix_city_park_longitude'), 'city_park', ['longitude'], unique=False)
    op.create_index(op.f('ix_city_park_park_type'), 'city_park', ['park_type'], unique=False)
    op.create_index(op.f('ix_city_park_region_id'), 'city_park', ['region_id'], unique=False)


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_index(op.f('ix_city_park_region_id'), table_name='city_park')
    op.drop_index(op.f('ix_city_park_park_type'), table_name='city_park')
    op.drop_index(op.f('ix_city_park_longitude'), table_name='city_park')
    op.drop_index(op.f('ix_city_park_latitude'), table_name='city_park')
    op.drop_table('city_park')
    op.drop_column('restaurant', 'recommended')
