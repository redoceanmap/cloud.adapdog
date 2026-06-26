from __future__ import annotations

import asyncio
import json
import logging
import re
from typing import Optional

from care.app.ports.output.symptom_check_port import SymptomCheckPort, SymptomTriageAgentPort
from care.domain.entities.symptom_check_entity import SymptomCheck
from care.domain.value_objects.symptom_check_vo import SymptomTriage

logger = logging.getLogger(__name__)


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


# ── 증상 대화형 안내 에이전트 ──────────────────────────────────────────────────
# 가드레일: 확정 진단 금지, 항상 "수의사 진료 필요" 명시, 약·용량 언급 금지.
_DISCLAIMER = "참고용 안내이며 진단이 아니에요. 증상이 지속·악화되면 반드시 수의사 진료를 받으세요."

# 응급 키워드 → (긴급도, 짐작 원인, 주의사항) 규칙 — Gemini 미사용/실패 시 폴백.
_TRIAGE_RULES: list[tuple[tuple[str, ...], str, list[str], str]] = [
    (("경련", "발작", "쓰러", "의식", "기절", "호흡곤란", "숨을 못", "청색", "피를 토"),
     "high", ["응급 상황 가능"], "지체 없이 가까운(가능하면 24시) 동물병원으로 바로 이동하세요."),
    (("헥헥", "더위", "체온", "열사병", "침을 많이", "탈진"),
     "high", ["열사병/탈수 의심"], "시원한 그늘로 옮기고 미지근한 물로 몸을 적셔 체온을 낮추며 바로 병원으로 가세요."),
    (("구토", "토해", "설사", "혈변", "안 먹", "식욕"),
     "medium", ["소화기 이상 가능"], "금식 상태로 물만 조금씩 주고, 반복되면 토사물 사진과 함께 병원에 방문하세요."),
    (("절뚝", "다리", "발을 핥", "절음", "관절"),
     "medium", ["근골격/발 자극 가능"], "무리한 활동을 멈추고 발바닥·발톱에 상처가 있는지 살핀 뒤 지속되면 진료를 받으세요."),
    (("기침", "콧물", "재채기", "눈곱"),
     "medium", ["호흡기 자극 가능"], "환기·보온을 챙기고 증상이 2~3일 이상 지속되면 진료를 받으세요."),
    (("가려", "긁", "피부", "발진", "붉"),
     "low", ["피부 자극/알레르기 가능"], "긁어서 덧나지 않게 하고 산책 후 발·배를 닦아주세요. 지속되면 진료를 권합니다."),
]


def _rule_based_triage(symptom: str, pet_breed: Optional[str]) -> SymptomTriage:
    """키워드 매칭 기반 안내 — Gemini 실패/미사용 시 폴백(안전한 일반 안내)."""
    pet = (pet_breed or "반려동물").strip()
    for keywords, urgency, conditions, advice in _TRIAGE_RULES:
        if any(k in symptom for k in keywords):
            lead = "응급일 수 있어요" if urgency == "high" else "이런 가능성이 있어요"
            reply = f"말씀하신 증상은 {lead} — {', '.join(conditions)}. {advice} {_DISCLAIMER}"
            return SymptomTriage(reply=reply, possible_conditions=conditions, urgency=urgency, advice=advice)
    reply = (
        f"{pet}의 증상을 조금 더 자세히 알려주실 수 있을까요? (언제부터, 얼마나 자주, 함께 보이는 변화 등) "
        f"그동안 무리한 활동을 피하고 물을 충분히 주세요. {_DISCLAIMER}"
    )
    return SymptomTriage(reply=reply, possible_conditions=[], urgency="medium",
                         advice="증상을 더 구체적으로 알려주시면 함께 살펴볼게요.")


class RuleBasedSymptomTriageAgent(SymptomTriageAgentPort):
    """규칙기반 증상 안내 — Gemini 폴백 겸 단독 동작 가능."""

    async def triage(self, messages, pet_breed, pet_size) -> SymptomTriage:
        last = next((c for r, c in reversed(messages) if r == "user"), "")
        return _rule_based_triage(last, pet_breed)


class GeminiSymptomTriageAgent(SymptomTriageAgentPort):
    """Gemini 기반 증상 대화 안내 — 가드레일 시스템 프롬프트로 진단을 금지한다."""

    def __init__(self, api_key: str, model_name: str) -> None:
        import google.generativeai as genai

        self.model_name = model_name
        self._genai = genai
        genai.configure(api_key=api_key)

    async def triage(self, messages, pet_breed, pet_size) -> SymptomTriage:
        try:
            return await asyncio.to_thread(self._run, messages, pet_breed, pet_size)
        except Exception as e:  # noqa: BLE001 — Gemini 장애 시 규칙기반 폴백(서비스 유지)
            logger.warning("[GeminiSymptomTriageAgent] Gemini 실패 → 규칙기반 폴백 | %s", e)
            last = next((c for r, c in reversed(messages) if r == "user"), "")
            return _rule_based_triage(last, pet_breed)

    def _run(self, messages, pet_breed, pet_size) -> SymptomTriage:
        profile = f"반려동물: {pet_breed or '미상'}, 크기: {pet_size or '미상'}"
        system = (
            "당신은 반려동물 보호자의 불안을 덜어주는 따뜻한 '응급 증상 안내 도우미'입니다. "
            "보호자가 말한 증상을 듣고 짐작되는 원인을 쉬운 말로 알려주고, 지금 집에서 할 수 있는 주의사항을 안내합니다. "
            "절대 지켜야 할 규칙: (1) 확정 진단·특정 약·용량을 말하지 않는다. "
            "(2) 항상 '수의사 진료가 필요하다'는 점을 명확히 한다. "
            "(3) 경련·호흡곤란·열사병 등 위급 신호면 urgency=high로 즉시 병원 방문을 권한다. "
            "(4) 정보가 부족하면 한두 가지를 되물어 대화를 이어간다. "
            f"반려동물 프로필을 고려하세요({profile}). "
            '오직 JSON으로만 답하세요: '
            '{"reply": "대화체 안내(2~4문장)", "possible_conditions": ["원인후보", ...], '
            '"urgency": "low|medium|high", "advice": "집에서의 주의사항 한 줄"}'
        )
        convo = "\n".join(f"{'보호자' if r == 'user' else 'AI'}: {c}" for r, c in messages)
        model = self._genai.GenerativeModel(self.model_name, system_instruction=system)
        resp = model.generate_content(f"대화 기록:\n{convo}\n\n위 마지막 보호자 발화에 답하세요.")
        return _parse_triage(resp.text)


def _parse_triage(text: str) -> SymptomTriage:
    match = re.search(r"\{.*\}", text or "", re.DOTALL)
    if not match:
        return SymptomTriage(reply=(text or "").strip() or _DISCLAIMER)
    try:
        data = json.loads(match.group(0))
    except json.JSONDecodeError:
        return SymptomTriage(reply=text.strip())
    reply = str(data.get("reply") or "").strip()
    # 가드레일: 면책 문구가 빠졌으면 덧붙인다.
    if "수의사" not in reply:
        reply = f"{reply} {_DISCLAIMER}".strip()
    urgency = str(data.get("urgency") or "medium").lower()
    if urgency not in ("low", "medium", "high"):
        urgency = "medium"
    conds = [str(c) for c in data.get("possible_conditions", []) if str(c).strip()]
    return SymptomTriage(reply=reply, possible_conditions=conds, urgency=urgency,
                         advice=str(data.get("advice") or "").strip())
