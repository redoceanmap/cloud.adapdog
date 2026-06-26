from __future__ import annotations

import re


def normalize_breed(raw: str | None) -> str:
    """견종명 정규화 키. 카탈로그 조회 시 입력 표기 차이를 흡수한다.

    공백 제거 + 소문자화로 '골든 리트리버'·'골든리트리버'·'Golden Retriever'를
    같은 키로 본다(한글은 소문자화 영향 없음).
    """
    if not raw:
        return ""
    return re.sub(r"\s+", "", raw.strip()).lower()
