"""
기능 슬라이스 자기소개(연동 검증) 공용 타입.

각 기능 슬라이스가 router→use case→interactor→port→repository 전 계층을 통과했음을
trail로 보여, 프론트↔백엔드 헥사고날 배선이 살아있는지 한 눈에 확인한다.
map·users 두 컨텍스트가 공유하는 진단용 커널 타입이다.
"""
from __future__ import annotations

from dataclasses import dataclass, field

from pydantic import BaseModel


@dataclass
class Introduction:
    """자기소개 결과 — 어느 컨텍스트의 어느 기능이 어떤 계층을 거쳐왔는지."""

    context: str                                    # 바운디드 컨텍스트 (map / users)
    feature: str                                    # 기능 슬라이스 이름
    message: str                                    # 사람이 읽을 자기소개 문구
    trail: list[str] = field(default_factory=list)  # 안→밖으로 거쳐온 계층 기록


class IntroductionSchema(BaseModel):
    """자기소개 응답 스키마(인바운드 경계)."""

    context: str
    feature: str
    message: str
    trail: list[str]

    @classmethod
    def from_entity(cls, intro: Introduction) -> "IntroductionSchema":
        return cls(
            context=intro.context,
            feature=intro.feature,
            message=intro.message,
            trail=intro.trail,
        )
