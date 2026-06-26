"""add restaurant, restaurant_image, animal_hospital tables

Revision ID: f0ea5eab0222
Revises: b7e2c9a4d1f3
Create Date: 2026-06-26 10:40:44.194441

음식점·동물병원 CSV직접 소스를 3NF 전용 테이블로 정규화 적재한다.
region/category 공유 차원을 재사용한다. (autogenerate가 env.py 미스캔 앱
trips/care/creative/community 테이블을 삭제 대상으로 오탐지하므로, 신규 3테이블
생성/삭제만 남기도록 수동 정리했다.)
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'f0ea5eab0222'
down_revision: Union[str, Sequence[str], None] = 'b7e2c9a4d1f3'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table('restaurant',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('name', sa.String(), nullable=False),
    sa.Column('latitude', sa.Float(), nullable=False),
    sa.Column('longitude', sa.Float(), nullable=False),
    sa.Column('region_id', sa.Integer(), nullable=True),
    sa.Column('cuisine', sa.String(), nullable=True),
    sa.Column('phone', sa.String(), nullable=True),
    sa.Column('road_address', sa.String(), nullable=True),
    sa.Column('jibun_address', sa.String(), nullable=True),
    sa.Column('status', sa.String(), nullable=True),
    sa.Column('thumbnail_url', sa.String(), nullable=True),
    sa.Column('pet_friendly', sa.Boolean(), nullable=False),
    sa.ForeignKeyConstraint(['region_id'], ['region.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_restaurant_latitude'), 'restaurant', ['latitude'], unique=False)
    op.create_index(op.f('ix_restaurant_longitude'), 'restaurant', ['longitude'], unique=False)
    op.create_index(op.f('ix_restaurant_region_id'), 'restaurant', ['region_id'], unique=False)
    op.create_table('restaurant_image',
    sa.Column('restaurant_id', sa.Integer(), nullable=False),
    sa.Column('seq', sa.Integer(), nullable=False),
    sa.Column('url', sa.String(), nullable=False),
    sa.ForeignKeyConstraint(['restaurant_id'], ['restaurant.id'], ),
    sa.PrimaryKeyConstraint('restaurant_id', 'seq')
    )
    op.create_table('animal_hospital',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('name', sa.String(), nullable=False),
    sa.Column('latitude', sa.Float(), nullable=False),
    sa.Column('longitude', sa.Float(), nullable=False),
    sa.Column('region_id', sa.Integer(), nullable=True),
    sa.Column('phone', sa.String(), nullable=True),
    sa.Column('road_address', sa.String(), nullable=True),
    sa.Column('is_open', sa.Boolean(), nullable=False),
    sa.ForeignKeyConstraint(['region_id'], ['region.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_animal_hospital_latitude'), 'animal_hospital', ['latitude'], unique=False)
    op.create_index(op.f('ix_animal_hospital_longitude'), 'animal_hospital', ['longitude'], unique=False)
    op.create_index(op.f('ix_animal_hospital_region_id'), 'animal_hospital', ['region_id'], unique=False)


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_index(op.f('ix_animal_hospital_region_id'), table_name='animal_hospital')
    op.drop_index(op.f('ix_animal_hospital_longitude'), table_name='animal_hospital')
    op.drop_index(op.f('ix_animal_hospital_latitude'), table_name='animal_hospital')
    op.drop_table('animal_hospital')
    op.drop_index(op.f('ix_restaurant_region_id'), table_name='restaurant')
    op.drop_index(op.f('ix_restaurant_longitude'), table_name='restaurant')
    op.drop_index(op.f('ix_restaurant_latitude'), table_name='restaurant')
    op.drop_table('restaurant_image')
    op.drop_table('restaurant')
