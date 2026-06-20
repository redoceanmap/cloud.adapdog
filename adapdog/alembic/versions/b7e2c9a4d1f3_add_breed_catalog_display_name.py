"""add breed_catalog.display_name

Revision ID: b7e2c9a4d1f3
Revises: 96a7fd767f47
Create Date: 2026-06-20 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'b7e2c9a4d1f3'
down_revision: Union[str, Sequence[str], None] = '96a7fd767f47'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column('breed_catalog', sa.Column('display_name', sa.String(), nullable=True))


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column('breed_catalog', 'display_name')
