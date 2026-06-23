import asyncio
import logging
import os
import sys
from contextlib import asynccontextmanager
from datetime import datetime, timezone

# apps/ 를 import 경로에 추가 → bounded context를 `map.xxx` 로 임포트
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "apps"))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from core.config import DATABASE_URL
from core.database.session import create_all_tables, dispose_engine, init_engine
from care.adapter.inbound.api import care_router
from community.adapter.inbound.api import community_router
from creative.adapter.inbound.api import creative_router
from map.adapter.inbound.api import map_router
from trips.adapter.inbound.api import trips_router
from users.adapter.inbound.api import users_router


def _configure_logging() -> None:
    logging.basicConfig(
        level=logging.INFO,
        format="%(levelname)s:\t%(message)s",
        force=True,
    )


_configure_logging()
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_engine()
    await create_all_tables()
    try:
        yield
    finally:
        await dispose_engine()


app = FastAPI(title="발자국 (어댑독)", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(map_router, prefix="/api")
app.include_router(users_router, prefix="/api")
app.include_router(trips_router, prefix="/api")
app.include_router(care_router, prefix="/api")
app.include_router(creative_router, prefix="/api")
app.include_router(community_router, prefix="/api")


@app.get("/")
def read_root():
    return {"message": "발자국 API", "docs": "/docs"}


@app.get("/api/health")
def health_check():
    """프론트 연결 상태 점검용 헬스 엔드포인트(운영 관심사 → composition root에 둠)."""
    return {
        "status": "ok",
        "service": "발자국 API",
        "storage": "db" if DATABASE_URL else "memory",
        "time": datetime.now(timezone.utc).isoformat(),
    }


if __name__ == "__main__":
    import uvicorn

    if sys.platform == "win32":
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

    uvicorn.run("main:app", host="127.0.0.1", port=8000, loop="none")
