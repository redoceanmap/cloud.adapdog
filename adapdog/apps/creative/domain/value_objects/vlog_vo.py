from __future__ import annotations

# 브이로그 슬라이스는 별도 값 객체 없이 Vlog/VlogClip 엔티티로 충분하다.
# (VlogClip은 vlog_entity.py 안에 포함된 종속 값으로, 독립 슬라이스가 아니다.)
# 톤(Tone)·미디어 정책 등 도메인 규칙이 필요해지면 여기에 VO를 추가한다.
# (festival_vo와 동일하게, 프랙탈 구조 유지를 위한 자리 표시 모듈)
