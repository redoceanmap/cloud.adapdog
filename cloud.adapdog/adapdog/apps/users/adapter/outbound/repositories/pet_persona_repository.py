from __future__ import annotations

from typing import Optional

from users.app.ports.output.pet_persona_port import PetPersonaPort
from users.domain.entities.pet_persona_entity import PetPersona

_CHERRY_PERSONA = PetPersona(
    pet_id=1,
    intro_text="안녕! 나는 골든 리트리버 체리야. 더위는 좀 타지만 사람을 정말 좋아해!",
    hero_image_url="https://cdn.adapdog.example/persona/cherry_hero.png",
    mascot_image_url="https://cdn.adapdog.example/persona/cherry_mascot.png",
    tone="밝고 친근",
    created_at="2026-06-23",
)


class MockPetPersonaRepository(PetPersonaPort):
    """데이터 없는 단계의 mock 페르소나 — 체리 데모 시나리오용.

    페르소나 생성 파이프라인 연동 전까지 사용. DB 시드로 전환 시
    DbPetPersonaRepository로 교체하면 도메인/인터랙터는 무수정(OCP).
    """

    _DATA = {_CHERRY_PERSONA.pet_id: _CHERRY_PERSONA}

    async def find_persona(self, pet_id: int) -> Optional[PetPersona]:
        return self._DATA.get(pet_id)
