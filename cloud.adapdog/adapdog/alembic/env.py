import importlib
import os
import pkgutil
import sys
from logging.config import fileConfig
from pathlib import Path

from alembic import context
from dotenv import load_dotenv
from sqlalchemy import engine_from_config, pool

# alembic/env.py → 상위가 adapdog/ (backend 루트). 프로젝트 루트/백엔드/apps 를 path 에 추가.
_backend_dir = Path(__file__).parents[1]
_project_root = _backend_dir.parent
for _p in [str(_project_root), str(_backend_dir), str(_backend_dir / "apps")]:
    if _p not in sys.path:
        sys.path.insert(0, _p)

# .env 의 DATABASE_URL 사용 (이미 환경변수가 있으면 override 안 함).
load_dotenv(_backend_dir / ".env")

config = context.config
config.set_main_option("sqlalchemy.url", os.environ["DATABASE_URL"])

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

from core.database.base import Base

# strict fractal: 슬라이스마다 orm 파일이 하나씩 늘어난다.
# 각 컨텍스트 orm 패키지의 모든 모듈을 import 해 Base.metadata 에 테이블을 등록한다.
# (map·users 만 보면 trips·care 테이블을 autogenerate 가 삭제 대상으로 오탐지하므로 전부 스캔.)
for _orm_pkg in (
    "map.adapter.outbound.orm",
    "users.adapter.outbound.orm",
    "trips.adapter.outbound.orm",
    "care.adapter.outbound.orm",
):
    _pkg = importlib.import_module(_orm_pkg)
    for _mod in pkgutil.iter_modules(_pkg.__path__):
        importlib.import_module(f"{_orm_pkg}.{_mod.name}")

target_metadata = Base.metadata


def include_name(name, type_, parent_names):
    """ORM 모델이 없는 DB 테이블(과거 create_all 잔여·아직 미구현 [제안] 테이블)을
    autogenerate 가 DROP 대상으로 오탐지하지 않게, metadata 에 있는 테이블만 비교 대상에 둔다.
    (alembic 이 관리하지 않는 테이블은 그대로 보존 — create_all 병행 구조 대응.)"""
    if type_ == "table":
        return name in target_metadata.tables or name == "alembic_version"
    return True


def run_migrations_offline() -> None:
    """'offline' 모드: 엔진 없이 URL 만으로 마이그레이션 SQL 을 출력한다."""
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
        include_name=include_name,
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """'online' 모드: 동기 엔진으로 DB 에 연결해 마이그레이션을 실행한다."""
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            include_name=include_name,
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
