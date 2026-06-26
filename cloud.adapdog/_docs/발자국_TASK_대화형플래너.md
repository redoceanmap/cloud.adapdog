# 발자국 — 작업 지시: 대화형 AI 여행 플래너 (Claude Code)

> 이 문서를 작업 단위로 삼는다. 먼저 저장소의 `발자국_PROJECT_CONTEXT.md`, `CLAUDE.md`,
> `NAVIGATION.md`를 읽고, 아키텍처 규칙(헥사고날·DDD·SOLID·Mock-first)을 그대로 따른다.
> 안전·규정·출처 지시는 비협상이다. 작은 단위로 만들고 매 단계 테스트를 통과시킨다.

## 0. 한 줄 목표
사용자와 AI가 **핑퐁(질문↔답)** 으로 주고받으며 **여정(TripPlan)이 실시간으로 채워지는**
대화형 여행 플래너를, FastAPI 헥사고날 백엔드 + 그 결과를 소비하는 프론트로 구현한다.
**대화의 한 마디 한 마디가 곧 플랜의 편집(추가/삭제/재정렬/설정)** 이어야 한다.

## 1. 피벗 요약 (무엇이 바뀌나)
- 앱의 메인 = **플래너(대화형)**. 온보딩~페르소나~플래너 입력 화면은 이미 존재하니 **건드리지 않는다.**
- 검색/둘러보기 중심 → **AI 에이전트가 대화로 여정을 설계**하는 앱.
- 데모: 사용자 위치 **서울**, 목적지 **전주**, 반려견 **체리(골든 리트리버·대형견·28kg·더위 취약)**.
- **유지 기능**: 플래너(대화형)·시설 상세/입장 판정·둘러보기(축제·둘레길·문화시설)·케어 알림·응급·여행 진행 자동 이동(발자국 지도).
- **폐기 기능**: 꾸미기(한복)·커뮤니티·브이로그·연말 결산.
- 탭: **3탭(플래너·둘러보기·내 강아지) + 전역 응급 FAB**. (발자국 지도=내 강아지)

## 2. 핵심: 대화형 플래너 에이전트
### 2-1. 상태 모델 (도메인 애그리거트 TripPlan)
매 대화 턴마다 이 상태를 읽고/갱신한다. 대화가 길어져도 "지금까지 정해진 것"을 이 상태가 보존한다.
```
TripPlan {
  origin: "서울", destination: "전주",
  transport: KTX | BUS | CAR | UNSET,
  lodging:   OVERNIGHT | DAYTRIP | UNSET,
  pet: { name, breed, size(enum), heat_sensitive(bool), ... },   # 필터 기준
  legs: [ TravelLeg { from, to, mode, stopovers:[Place] } ],       # 이동 구간(서울→[경유지]→전주)
  itinerary: [ ItineraryItem {
      place_id(str), name, category, planned_time,
      reason(str),                 # 추천 이유(규칙 기반 생성)
      source(str),                 # 데이터 출처 태그
      entry: EntryJudgement        # 입장 판정 결과(규칙)
  } ],
  status: DRAFTING | READY
}
```
- 특징값(size·heat_sensitive 등)은 **enum 고정값**(온보딩 UI의 직접입력 비활성과 일치).

### 2-2. LLM 도구(tool-calling) — 에이전트가 plan을 조작하는 수단
LLM은 자유 대화를 받되, **plan 변경은 반드시 아래 도구로만** 한다(자유 텍스트로 상태를 바꾸지 않음).
- `set_transport(mode)` — KTX/BUS/CAR
- `set_lodging(option)` — OVERNIGHT/DAYTRIP. OVERNIGHT면 전주 펫 동반 숙소를 itinerary에 제안
- `suggest_places(category, context)` — (읽기) 펫 필터 통과 후보 반환(카페·명소·축제·숙소)
- `add_place(place_id)` — itinerary에 추가(+reason+source+entry 판정)
- `remove_place(item_id)` — 삭제 후 동선 재정렬
- `reorder(order[])` — 순서 변경
- `explain(item_id)` — 추천 이유 상세 반환
- `finalize()` — status=READY → 여행 진행으로 넘길 준비
> 이동수단 분기: CAR면 `legs`에 서울→전주 **경유지(휴게소·펫 동반 명소)** 추천을 포함. KTX/BUS면 전주역 직행(경유지 없음).
> 전주는 공항이 없으므로 transport에 **비행기 없음**(KTX·고속버스·자차만).

### 2-3. 대화 루프 / 엔드포인트
```
POST /planner/message
  req:  { session_id, message, plan }       # plan은 직전 상태(없으면 신규)
  flow: LLM이 message+plan을 읽고 → 의도 파악 → 위 도구 호출(0..n) → 도메인 검증 → plan 갱신
  res:  { reply(한 마디 응답), plan(갱신본), suggestions[](다음 빠른 선택지) }
```
- 멀티턴: 클라이언트가 매 요청에 직전 plan을 동봉(서버 무상태 or 세션 저장 택1, MVP는 무상태+클라 보관 가능).

### 2-4. 안전·규정은 LLM이 아니라 규칙
- **입장 판정**(체리가 들어갈 수 있나)은 `EntryJudgementService`(도메인 규칙)가 반려동물 동반여행 데이터로 결정. LLM은 그 결과만 받는다.
- **폭염/위험**은 `RiskPolicy`가 날씨+체질로 판정해 경고를 부여. LLM이 임의 판단 금지.
- `add_place`로 들어온 장소는 항상 EntryJudgement 통과분만 itinerary에 남긴다(불가면 사유와 대안 제시).

## 3. 아키텍처 매핑 (헥사고날)
- inbound: `adapters/inbound/http/planner_router.py` → `application/PlannerChatService`
- domain(순수): `TripPlan` 애그리거트, `EntryJudgementService`, `RiskPolicy`, `ItineraryComposer`, 포트 정의
- outbound 포트/어댑터:
  - `LLMAgentPort` ← `adapters/outbound/llm`(tool-calling) / Mock
  - `PlaceRepositoryPort`(전주 카페·명소·축제) ← Mock(시드)
  - `LodgingRepositoryPort`(전주 펫 동반 숙소) ← Mock
  - `RouteProviderPort`(서울→전주 legs·경유지) ← Mock
  - `WeatherProviderPort`(폭염) ← Mock
- composition root에서 와이어링. **도메인은 LLM/HTTP/torch import 금지.**

## 4. Mock-first (데모 생명선)
- `APP_USE_MOCKS=true`로 외부 API 없이 핑퐁이 끝까지 돌 것.
- 전주 시드 데이터: 한옥마을 펫카페·자만벽화마을·오목대·전주천 둘레길·한지문화축제·비빔밥축제·펫 동반 숙소·전주중앙동물메디컬 등(현실적 값·출처 태그).
- **데모 안정화**: 정해진 입력("전주 갈래")엔 일관된 결과가 나오게 시드/캐싱. LLM 실패 시 스크립트 응답으로 degrade.

## 5. 빌드 순서 (각 단계 테스트 통과)
1. 도메인: `TripPlan`+값객체(enum) → `EntryJudgementService`·`RiskPolicy`·`ItineraryComposer` (순수, 단위테스트)
2. 포트 정의 + Mock 어댑터(Place/Lodging/Route/Weather/LLMAgent) → `PlannerChatService` 오케스트레이션
3. `POST /planner/message` end-to-end가 Mock만으로 김민주+체리 시나리오를 통과(이동수단→숙박→경유지/전주 코스→추가/삭제)
4. 실제 LLM 어댑터(tool-calling) 연결 + 안전 규칙은 도메인 유지
5. (선택) 실 공공데이터 어댑터로 교체

## 6. 프론트 연동(이 엔드포인트를 소비)
- 플래너 화면 = 채팅 + **실시간 갱신되는 여정 플랜 카드**(말 한 마디 → 플랜에 추가/삭제 반영).
- 각 ItineraryItem에 "추천 이유" 펼치기 + 추가/삭제/순서 변경. 하단 상시 입력창으로 계속 다듬기.
- "여행 시작" → 여행 진행(발자국 지도 핀 자동 이동: 좌표 배열을 순서대로 보간 이동, GPS 아님) + 케어 알림 + 응급 FAB.

## 7. 가드레일
- 안전·규정은 도메인 규칙, LLM은 제안·대화만. 응급/증상은 참고용·"반드시 수의사".
- 비밀키·모델 가중치 커밋 금지(.env/.gitignore). Mock 경로 유지.
- 공공데이터 출처를 UI 태그·`ml/DATA.md`에 기록. 동물병원=행정안전부.
- LLM 입력 범위 고정(시스템 프롬프트: 펫 동반 전주 여행 플래너만, 안전 규정 준수).

## 8. 음성 대화 + 웨이크워드 (I/O 레이어)
> 음성은 에이전트를 바꾸지 않는다. `/planner/message`(텍스트) 앞뒤에 STT/TTS/웨이크워드를 붙이는 **프론트 중심** 기능. 백엔드는 강아지 목소리 TTS만 포트로 둔다.

### 8-1. 음성 루프
```
웨이크워드 감지 → (비프/햅틱) 듣기 시작 → STT(말→텍스트)
  → POST /planner/message → reply 텍스트 → TTS(강아지 목소리) 재생
  → 화면의 여정 플랜 동시 갱신
```
- 핑퐁이 음성으로도 이어진다: AI가 음성으로 "어떻게 갈까요?" → 사용자가 말로 "KTX로" → plan 갱신 + 음성 답변.

### 8-2. STT (말 → 글)
- MVP: 브라우저 **Web Speech API**(`SpeechRecognition`, `lang="ko-KR"`). HTTPS + 마이크 권한 필요.
- 대안/백엔드: Whisper 또는 Clova STT를 `SpeechToTextPort` 뒤에 둠(선택). 도메인은 모름.

### 8-3. TTS (글 → 강아지 목소리) — `VoiceSynthesisPort`
- 페르소나(체리) 목소리로 답을 읽어줌. 견종·크기 기반 톤.
- 구현: 클라우드 TTS(피치/보이스 튜닝) 어댑터. 실패 시 **브라우저 `SpeechSynthesis`(ko-KR)로 degrade**.
- AI 5종 모달리티 중 ④ 음성(TTS)을 여기서 충족.

### 8-4. 웨이크워드 ("체리야~"로 호출)
- 기본(안정): **탭-투-토크 마이크 버튼**. 라이브 데모의 메인 경로.
- 정식 웨이크워드: **Picovoice Porcupine**(웹 JS SDK, 커스텀 키워드 "체리야"). 항상-듣기 → 감지 시 8-1 시작.
- 데모 꼼수(대체): 브라우저 음성인식을 연속 실행해 "체리야" 문구 스캔 → 활성화. **크롬 전용·불안정 → 데모 한정**, 백업 영상 필수.
- 항상-듣는 마이크는 **토글(기본 OFF)** + 활성 표시(파형/인디케이터). 프라이버시 고지.

### 8-5. 프론트 컴포넌트
- `VoiceController`: 웨이크워드 → STT → 에이전트 호출 → TTS → 플랜 갱신을 한 루프로.
- 마이크 버튼(플래너 입력창 옆), 듣는 중 파형, 음성 토글, 응답 자막(접근성).

### 8-6. 가드레일(음성)
- 마이크 권한·항상-듣기는 명시적 동의 + 토글. 음성 데이터는 STT 처리 외 저장/전송 금지.
- 키·토큰은 .env. 웨이크워드/STT 실패해도 텍스트 입력으로 항상 대체 가능(degrade).
- 안전·규정 판단은 음성 경로에서도 동일하게 도메인 규칙으로(LLM 임의 판단 금지).
