/* 발자국 — 백엔드 API 클라이언트 (FastAPI @ :8000)
 * 정적 스크립트로 먼저 로드되어 window.API 를 노출한다. screens.jsx 가 사용.
 */
(function () {
  const BASE = `http://${location.hostname}:8000/api`;
  const REGION = "강릉";

  async function _json(res) {
    if (!res.ok) {
      let detail = "";
      try { detail = JSON.stringify((await res.json()).detail); } catch (e) {}
      throw new Error(`HTTP ${res.status} ${detail}`);
    }
    return res.json();
  }
  const _get = (path) => fetch(BASE + path).then(_json);
  const _post = (path, body) =>
    fetch(BASE + path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).then(_json);

  window.API = {
    REGION,

    /* 견종 프로필 — size / traits / temperament 자동 도출 */
    breedProfile: (breed) => _get(`/users/breed-catalog/${encodeURIComponent(breed)}`),

    /* 회원가입 = 계정 + 반려견 등록 (소셜 로그인 데모: provider 기반 임시 자격증명 생성) */
    signup: ({ name, breed, birth_year, gender = "female", provider = "demo" }) =>
      _post("/users/account/signup", {
        email: `${provider}_${Date.now()}@adapdog.io`,
        password: "demo1234",
        nickname: "보호자",
        pet: { name, breed, photo_url: "", birth_year, gender, features: "" },
      }),

    /* 오늘의 산책 안전도 (날씨 × 체질) */
    safetyAlert: ({ pet_breed, pet_size, region = REGION }) =>
      _post("/map/safety-alert/check", { region, pet_breed, pet_size }),

    /* 맞춤 동선 플래너 */
    routePlan: ({ pet_size, pet_breed, days = 2, region = REGION }) =>
      _post("/map/route-planner/plan", { region, days, pet_size, pet_breed }),

    /* 우리 아이 입장 판정 */
    entryVerdict: ({ place_name, pet_name, pet_size, region = REGION }) =>
      _post("/map/entry-verdict/check", { region, place_name, pet_name, pet_size }),

    /* 정책 텍스트 → 배지 코드 */
    parsePolicy: (text) => _post("/map/policy-card/parse", { text }),
  };
})();
