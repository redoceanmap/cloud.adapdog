from __future__ import annotations

from typing import Optional

from creative.app.ports.output.decoration_template_port import DecorationTemplatePort
from creative.domain.entities.decoration_template_entity import DecorationTemplate

_SOURCE = "꾸미기 템플릿 갤러리(mock)"


class MockDecorationTemplateRepository(DecorationTemplatePort):
    """데이터 없는 단계의 mock 템플릿 — 전주 데모 시나리오용.

    템플릿 시드 연동 전까지 사용. DB 시드로 전환 시 DbDecorationTemplateRepository로
    교체하면 도메인/인터랙터는 무수정(OCP).
    """

    _DATA = (
        DecorationTemplate(1, "전통 한복", "전통", "https://cdn.adapdog.mock/template/hanbok.png", _SOURCE),
        DecorationTemplate(2, "전통 문양", "전통", "https://cdn.adapdog.mock/template/pattern.png", _SOURCE),
        DecorationTemplate(3, "한옥 배경", "한옥", "https://cdn.adapdog.mock/template/hanok.png", _SOURCE),
        DecorationTemplate(4, "가을 단풍", "계절", "https://cdn.adapdog.mock/template/autumn.png", _SOURCE),
        DecorationTemplate(5, "전주 여행 테마", "여행", "https://cdn.adapdog.mock/template/jeonju.png", _SOURCE),
    )

    async def find_templates(self, theme: Optional[str]) -> list[DecorationTemplate]:
        if theme:
            return [t for t in self._DATA if theme in t.theme]
        return list(self._DATA)
