from __future__ import annotations

from fastapi import APIRouter, Depends

from map.adapter.inbound.api.schemas.entry_verdict_schema import EntryVerdictSchema
from map.app.dtos.entry_verdict_dto import EntryVerdictResponse
from map.app.ports.input.entry_verdict_use_case import EntryVerdictUseCase
from map.dependencies.entry_verdict_provider import get_entry_verdict_use_case

entry_verdict_router = APIRouter(prefix="/entry-verdict", tags=["entry-verdict"])


@entry_verdict_router.post("/check")
async def check_entry(
    schema: EntryVerdictSchema,
    use_case: EntryVerdictUseCase = Depends(get_entry_verdict_use_case),
) -> EntryVerdictResponse:
    return await use_case.check(schema)
