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


async def _prewarm_course_cache() -> None:
    """데모 코스(전주/대형견) 캐시를 백그라운드로 미리 채운다 — 첫 시연도 빠르게.

    서버 기동 후 /plan(= agent.plan)을 호출해 _PLAN_CACHE를 워밍. 부팅을 막지 않는다.
    """
    import json
    import urllib.request

    await asyncio.sleep(2)  # 서버가 요청을 받기 시작할 때까지 잠깐 대기
    for days in (2, 1):  # 1박(2일)·당일치기(1일) 둘 다 워밍
        try:
            body = json.dumps(
                {"region": "전주", "days": days, "pet_size": "large", "pet_breed": "골든 리트리버"}
            ).encode()
            req = urllib.request.Request(
                "http://127.0.0.1:8000/api/map/route-planner/plan",
                data=body, headers={"Content-Type": "application/json"},
            )
            await asyncio.to_thread(lambda: urllib.request.urlopen(req, timeout=30).read())
            logger.info("[prewarm] 코스 캐시 워밍 완료 | days=%d", days)
        except Exception as e:  # noqa: BLE001 — 워밍 실패는 서비스에 영향 없음
            logger.warning("[prewarm] 코스 캐시 워밍 실패 | days=%d %s", days, e)


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_engine()
    await create_all_tables()
    asyncio.create_task(_prewarm_course_cache())  # 비차단 백그라운드 워밍
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
        "http://localhost:3001",
        "http://127.0.0.1:3001",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(map_router, prefix="/api")
app.include_router(users_router, prefix="/api")
app.include_router(trips_router, prefix="/api")
app.include_router(care_router, prefix="/api")


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
