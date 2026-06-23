from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class DecorationTemplate:
    """꾸미기 템플릿 — 갤러리(F1/F4)에서 고르는 한 항목.

    독립 마스터(부모 없음). 전통·한옥·여행 테마의 꾸미기 소스. 데이터는 mock 시드.
    """

    id: int
    name: str
    theme: str
    thumbnail_url: str
    source: str
