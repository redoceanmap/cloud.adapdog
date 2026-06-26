from __future__ import annotations

from dataclasses import dataclass, field


@dataclass(frozen=True)
class SymptomTriage:
    """보호자가 말한 증상에 대한 AI 응급 안내(참고용·진단 아님).

    reply: 보호자에게 보여줄 대화체 안내("이런 증상일 수 있어요…").
    possible_conditions: 짐작되는 원인 후보(확정 아님).
    urgency: low | medium | high — 병원 방문 권고 강도.
    advice: 지금 집에서 할 수 있는 주의사항 한두 줄.
    """

    reply: str
    possible_conditions: list[str] = field(default_factory=list)
    urgency: str = "medium"
    advice: str = ""
