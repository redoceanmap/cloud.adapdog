from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class PetPersona:
    """반려동물 페르소나(B) — pet과 1:1로 생성되는 캐릭터 소개.

    인트로 문구·히어로/마스코트 이미지·말투를 보관(현재는 mock). pet_id가 식별자.
    """

    pet_id: int
    intro_text: str
    hero_image_url: str
    mascot_image_url: str
    tone: str
    created_at: str
