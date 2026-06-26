from __future__ import annotations

# pet_place는 데이터 접근 슬라이스로, use case가 도메인 엔티티(PetFriendlyPlace)를
# 그대로 반환해 같은 bounded context의 기능 슬라이스들이 도메인 행위를 재사용한다.
# 따라서 별도 app-layer DTO가 필요 없다. (외부 응답 형태는 adapter의 schema가 담당)
# 시설 단건/조회 결과를 컨텍스트 밖으로 내보내는 요구가 생기면 여기에 DTO를 추가한다.
