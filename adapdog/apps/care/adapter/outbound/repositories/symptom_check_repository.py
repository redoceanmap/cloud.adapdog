from __future__ import annotations

from typing import Optional

from care.app.ports.output.symptom_check_port import SymptomCheckPort
from care.domain.entities.symptom_check_entity import SymptomCheck


class MockSymptomCheckRepository(SymptomCheckPort):
    """데이터 없는 단계의 mock 증상 체크 — 체리 데모 시나리오용 (참고용·진단 아님).

    가드레일: ai_result_text에 "반드시 수의사 진료" 안내를 담고 특정 약·용량은 넣지 않는다.
    is_diagnostic은 항상 False. DB 시드로 전환 시 DbSymptomCheckRepository로 교체하면
    도메인/인터랙터는 무수정(OCP).
    """

    _DATA = (
        SymptomCheck(
            1, 1, "발을 핥아요",
            "가벼운 자극일 수 있으나 지속되면 반드시 수의사 진료를 받으세요.",
            "낮음", False, "2026-06-23 10:20",
        ),
        SymptomCheck(
            2, 1, "더위에 헥헥거려요",
            "그늘·물 휴식을 권장합니다. 호흡곤란·경련 시 즉시 병원에 가고, 반드시 수의사 진료를 받으세요.",
            "주의", False, "2026-06-23 13:05",
        ),
    )

    async def find_checks(self, pet_id: Optional[int]) -> list[SymptomCheck]:
        if pet_id is not None:
            return [c for c in self._DATA if c.pet_id == pet_id]
        return list(self._DATA)
