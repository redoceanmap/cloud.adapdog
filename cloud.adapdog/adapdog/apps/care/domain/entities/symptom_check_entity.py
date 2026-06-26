from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class SymptomCheck:
    """응급 증상 체크 (D6~D9) — 참고용 기록이며 진단이 아니다.

    가드레일: is_diagnostic은 항상 False여야 한다. ai_result_text는 수의사 진료 안내를
    포함하고 특정 약·용량을 담지 않는다. pet_id는 users 앱(pet) cross-context 참조라
    도메인은 정수 식별자만 안다.
    """

    id: int
    pet_id: int
    symptom_text: str
    ai_result_text: str
    severity: str
    is_diagnostic: bool  # 항상 False (진단 아님)
    created_at: str
