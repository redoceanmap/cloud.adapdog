/* 발자국 app — screens + router. 백엔드(window.API)와 연동. shell 은 window(app.jsx)에서 읽음. */
const { useState, useEffect } = React;
const DSx = window.DesignSystem_d6ad93;
const { PhoneFrame, StatusBar, MapView, TabBar, AppBar, SectionHead, relucide } = window;
const { Button, IconButton, Chip, Tabs, Switch, Input, Select, DogAvatar, PlaceCard, RiskBadge, VerdictPill, PolicyBadge } = DSx;

/* ---------- 공용 매핑 ---------- */
const RISK_KO = { low: "낮음", moderate: "보통", high: "높음", severe: "매우 높음" };
const VERDICT_TITLE = {
  allowed: (n) => `${n}, 입장 가능해요`,
  conditional: (n) => `${n}, 조건부 가능해요`,
  denied: (n) => `${n}는 입장이 어려워요`,
};
const CATEGORY_ICON = {
  카페: "coffee", 여행지: "map-pin", 박물관: "landmark", 문예회관: "building",
  미용: "scissors", 식당: "utensils-crossed", 해변: "waves", 공원: "trees",
  숙소: "bed", 체험: "mountain", 병원: "cross",
};
const iconFor = (cat) => CATEGORY_ICON[cat] || Object.keys(CATEGORY_ICON).find((k) => (cat || "").includes(k)) && CATEGORY_ICON[Object.keys(CATEGORY_ICON).find((k) => (cat || "").includes(k))] || "map-pin";

const DEFAULT_PET = { name: "체리", breed: "시츄", size: "small", temperament: "" };
/* 견종 대신 크기만 고를 수 있는 빠른 선택 (백엔드 미환산 → 프론트에서 size 직접 지정) */
const SIZE_BREEDS = { 소형견: "small", 중형견: "medium", 대형견: "large" };

/* ---------- 소셜 브랜드 마크 ---------- */
const KakaoMark = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
    <path fill="currentColor" d="M12 3C6.9 3 3 6.2 3 10.2c0 2.6 1.7 4.9 4.3 6.2-.2.7-.7 2.6-.8 3 0 .1 0 .3.2.4.1.1.3 0 .3 0 .4-.1 2.7-1.8 3.6-2.4.4.1.8.1 1.2.1 5.1 0 9-3.2 9-7.2S17.1 3 12 3z" />
  </svg>
);
const NaverMark = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
    <path fill="currentColor" d="M14.7 12.3 9.1 4H4.5v16h4.8v-8.3l5.6 8.3h4.6V4h-4.8z" />
  </svg>
);
const GoogleMark = () => (
  <svg viewBox="0 0 48 48" width="20" height="20" aria-hidden="true">
    <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.9 2.4 30.3 0 24 0 14.6 0 6.4 5.4 2.5 13.3l7.9 6.1C12.3 13.3 17.7 9.5 24 9.5z" />
    <path fill="#4285F4" d="M46.1 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.4c-.5 2.9-2.1 5.3-4.6 7l7.1 5.5C43.6 37.3 46.1 31.4 46.1 24.5z" />
    <path fill="#FBBC05" d="M10.4 28.6c-.5-1.5-.8-3-.8-4.6s.3-3.1.8-4.6l-7.9-6.1C.9 16.5 0 20.1 0 24s.9 7.5 2.5 10.7l7.9-6.1z" />
    <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.1-5.5c-2 1.3-4.5 2.1-8.8 2.1-6.3 0-11.7-3.8-13.6-9.1l-7.9 6.1C6.4 42.6 14.6 48 24 48z" />
  </svg>
);

/* ============ Auth (소셜 로그인) ============ */
function AuthLanding({ onLogin }) {
  useEffect(relucide);
  return (
    <PhoneFrame>
      <div className="screen auth">
        <StatusBar />
        <div className="auth__hero">
          <div className="auth__logo">
            <svg viewBox="0 0 64 64" width="52" height="52" aria-hidden="true">
              <g fill="var(--brand)">
                <ellipse cx="17.5" cy="26" rx="6" ry="8" transform="rotate(-24 17.5 26)" />
                <ellipse cx="27.5" cy="16.5" rx="6" ry="8.5" transform="rotate(-8 27.5 16.5)" />
                <ellipse cx="39" cy="16.5" rx="6" ry="8.5" transform="rotate(8 39 16.5)" />
                <ellipse cx="49" cy="27" rx="6" ry="8" transform="rotate(24 49 27)" />
                <path d="M33 33c8.2 0 15 5.7 15 13.1 0 5.1-3.9 8.2-8.7 8.2-3 0-4.6-1.5-6.3-1.5s-3.3 1.5-6.3 1.5C16.9 54.3 13 51.2 13 46.1 13 38.7 24.8 33 33 33Z" />
              </g>
            </svg>
          </div>
          <h1 className="auth__title">발자국</h1>
          <p className="auth__tag">발자국과 함께 떠나는 반려 여행,<br />지금 함께 시작해요.</p>
        </div>
        <div className="auth__actions">
          <button className="auth__btn auth__btn--kakao" onClick={() => onLogin("kakao")}>
            <span className="auth__ico"><KakaoMark /></span> 카카오로 시작하기
          </button>
          <button className="auth__btn auth__btn--naver" onClick={() => onLogin("naver")}>
            <span className="auth__ico"><NaverMark /></span> 네이버로 시작하기
          </button>
          <button className="auth__btn auth__btn--google" onClick={() => onLogin("google")}>
            <span className="auth__ico"><GoogleMark /></span> Google로 시작하기
          </button>
          <p className="auth__legal">계속하면 이용약관과 개인정보처리방침에 동의하게 됩니다.</p>
        </div>
      </div>
    </PhoneFrame>
  );
}

/* ============ Onboarding ============ */
function Onboarding({ onDone, provider = "demo" }) {
  const traits = ["사교적", "수줍음", "활발함", "차분함", "겁많음"];
  const [name, setName] = useState("");
  const [breed, setBreed] = useState("");
  const [age, setAge] = useState("");
  const [size, setSize] = useState("");
  const [temperament, setTemperament] = useState("");
  const [sel, setSel] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState(null);
  const [photo, setPhoto] = useState(null);
  const fileRef = React.useRef(null);
  const [breeds, setBreeds] = useState([]);
  const [sugg, setSugg] = useState([]);
  const [suggOpen, setSuggOpen] = useState(false);
  useEffect(relucide);

  /* 견종 목록 1회 로드 (정적 카탈로그) */
  useEffect(() => {
    fetch("breeds.json").then((r) => r.json()).then(setBreeds).catch(() => {});
  }, []);

  const norm = (s) => s.replace(/\s/g, "");
  const allBreeds = [...Object.keys(SIZE_BREEDS), ...breeds];
  const onBreedChange = (e) => {
    const v = e.target.value;
    setBreed(v);
    const q = norm(v);
    if (!q) { setSugg([]); setSuggOpen(false); return; }
    const m = allBreeds.filter((b) => norm(b).includes(q)).slice(0, 8);
    setSugg(m);
    setSuggOpen(m.length > 0 && !(m.length === 1 && norm(m[0]) === q));
  };
  const chooseBreed = (b) => { setBreed(b); setSugg([]); setSuggOpen(false); };

  const pickPhoto = (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result);
    reader.readAsDataURL(f);
  };

  /* 견종이 카탈로그(또는 크기키워드)에 정확히 있을 때만 유효 */
  const isCatalogBreed = (b) => breeds.some((x) => norm(x) === norm(b));
  const breedValid = (() => { const b = breed.trim(); return !!b && (!!SIZE_BREEDS[b] || isCatalogBreed(b)); })();

  /* 유효 견종일 때만 size/기질 도출. 그 외(미입력·오타·미등록)는 비워서 'unknown' 배지 방지 */
  useEffect(() => {
    const b = breed.trim();
    if (SIZE_BREEDS[b]) { setSize(SIZE_BREEDS[b]); setTemperament(""); return; }
    if (!b || !isCatalogBreed(b)) { setSize(""); setTemperament(""); return; }
    let live = true;
    const t = setTimeout(() => {
      API.breedProfile(b)
        .then((p) => { if (live) { setSize(p.size); setTemperament(p.temperament); } })
        .catch(() => { if (live) { setSize(""); setTemperament(""); } });
    }, 400);
    return () => { live = false; clearTimeout(t); };
  }, [breed, breeds]);

  const toggle = (t) => setSel((s) => (s.includes(t) ? s.filter((x) => x !== t) : [...s, t]));

  const submit = async () => {
    if (!name.trim()) { setErr("이름은 필수예요."); return; }
    if (!breed.trim()) { setErr("견종은 필수예요."); return; }
    if (!breedValid) { setErr("견종은 목록에 있는 견종을 선택해주세요."); return; }
    setSubmitting(true); setErr(null);
    const birth_year = new Date().getFullYear() - (parseInt(age, 10) || 0);
    /* size 는 프론트가 신뢰할 수 있는 값(카탈로그/크기키워드) 사용 — 백엔드는 키워드를 unknown 으로 반환 */
    const localPet = { name: name.trim(), breed: breed.trim(), size, temperament };
    try {
      await API.signup({ name: name.trim(), breed: breed.trim(), birth_year, provider });
      onDone(localPet);
    } catch (e) {
      setErr("등록 저장에 실패했지만 데모를 계속 진행합니다.");
      onDone(localPet);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PhoneFrame>
      <div className="screen">
        <StatusBar />
        <div className="ob">
          <h1 className="ob__title">반려동물의 이름을 알려주세요</h1>
          <p className="ob__sub">한 번만 등록하면, {name.trim() || "우리 아이"}에게 맞는 코스를 짜드릴게요.</p>

          <div className="ob__avatar">
            <DogAvatar name={name} petSize={size} size="xl" ring src={photo} />
            <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={pickPhoto} />
            <button className="ob__upload" type="button" onClick={() => fileRef.current && fileRef.current.click()}>
              <i data-lucide="camera"></i> {photo ? "사진 변경" : "사진 추가"}
            </button>
          </div>

          <div className="ob__form">
            <Input label="이름" value={name} onChange={(e) => setName(e.target.value)} placeholder="이름 입력" required />
            <div className="ob__row">
              <div className="ob__ac">
                <Input label="견종" value={breed} onChange={onBreedChange} placeholder="견종 입력" required
                  autoComplete="off" onFocus={onBreedChange} onBlur={() => setTimeout(() => setSuggOpen(false), 120)} />
                {suggOpen && (
                  <ul className="ob__ac-list">
                    {sugg.map((b) => (
                      <li key={b}>
                        <button type="button" className="ob__ac-item" onMouseDown={() => chooseBreed(b)}>{b}</button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <Input label="체중" type="number" placeholder="예: 4.8" suffix="kg" />
            </div>
            <p className="ob__guide">
              <i data-lucide="info"></i>
              견종을 잘 모르시면 <strong>소형견 · 중형견 · 대형견</strong> 으로 입력해도 돼요.
            </p>
            <Input label="나이" type="number" value={age} onChange={(e) => setAge(e.target.value)} suffix="살" placeholder="나이 입력"
              hint={temperament ? `${breed} 기질: ${temperament}` : "시니어견은 폭염·한파에 더 주의해서 안내해드려요."} />
            <div>
              <div className="ob__label">성향 <span style={{ color: "var(--text-subtle)", fontWeight: 500 }}>(여러 개 선택)</span></div>
              <div className="ob__chips">
                {traits.map((t) => <Chip key={t} selected={sel.includes(t)} onToggle={() => toggle(t)}>{t}</Chip>)}
              </div>
            </div>
          </div>
        </div>
        <div className="screen__cta">
          {err && <p style={{ font: "var(--text-label)", color: "var(--danger-text)", margin: "0 0 8px", textAlign: "center" }}>{err}</p>}
          <Button variant="primary" size="lg" block icon="paw-print" onClick={submit} disabled={submitting}>
            {submitting ? "등록 중…" : "등록하고 시작하기"}
          </Button>
        </div>
      </div>
    </PhoneFrame>
  );
}

/* ============ Home ============ */
function Home({ pet, onNav, onSearch }) {
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(relucide);
  useEffect(() => {
    let live = true;
    setLoading(true);
    API.safetyAlert({ pet_breed: pet.breed, pet_size: pet.size })
      .then((a) => { if (live) setAlert(a); })
      .catch(() => {})
      .finally(() => { if (live) setLoading(false); });
    return () => { live = false; };
  }, [pet.breed, pet.size]);

  const riskLevel = alert ? alert.risk_level : "moderate";
  return (
    <PhoneFrame>
      <div className="screen">
        <StatusBar />
        <div className="home__top">
          <div className="home__greet">
            <span className="home__hi">안녕하세요, 보호자님 👋</span>
            <h1 className="home__q">{pet.name}랑 어디 가볼까요?</h1>
          </div>
          <div className="home__dogs">
            <DogAvatar name={pet.name} petSize={pet.size} size="md" ring />
            <button className="home__adddog"><i data-lucide="plus"></i></button>
          </div>
        </div>

        <button className="home__search" onClick={onSearch}>
          <i data-lucide="sparkles"></i>
          <span>강아지랑 1박2일 강릉…</span>
          <span className="home__search-go"><i data-lucide="arrow-right"></i></span>
        </button>

        <div className="home__body">
          {alert ? (
            <RiskBadge banner level={riskLevel}
              title={`오늘 ${alert.region}, 산책 위험도 ${RISK_KO[riskLevel] || riskLevel}`}
              description={`${alert.temperature_c}°C ${alert.condition} · ${alert.reasons.join(" · ")} 주변 동물병원 ${alert.hospital_count}곳 확인됨.`} />
          ) : (
            <RiskBadge banner level="moderate" title={loading ? "산책 안전도 확인 중…" : "안전도 정보를 불러오지 못했어요"}
              description={loading ? "오늘 날씨와 체리 체질을 분석하고 있어요." : "잠시 후 다시 시도해주세요."} />
          )}

          <div className="home__chips">
            <Chip icon="accessibility">무장애</Chip>
            <Chip icon="coffee" selected>카페</Chip>
            <Chip icon="trees">공원·해변</Chip>
            <Chip icon="utensils-crossed">식당</Chip>
            <Chip icon="bed">숙소</Chip>
          </div>

          <SectionHead title={`${pet.name} 맞춤 추천 코스`} more="전체" />
          <div className="course-cards">
            <button className="course-prev" onClick={() => onNav("course")}>
              <div className="course-prev__img course-prev__img--a">
                <span className="course-prev__tag"><i data-lucide="paw-print"></i> {pet.size === "small" ? "소형견 추천" : "추천 코스"}</span>
              </div>
              <div className="course-prev__body">
                <div className="course-prev__t">강릉 바다 & 카페 1박 2일</div>
                <div className="course-prev__meta"><i data-lucide="map-pin"></i> 동선 플래너로 실시간 생성 · <i data-lucide="route"></i> 우리 아이 판정 포함</div>
                <div className="course-prev__badges">
                  <PolicyBadge type="indoor_ok" /><PolicyBadge type="leash_required" /><PolicyBadge label="실시간" tone="neutral" />
                </div>
              </div>
            </button>
            <button className="course-prev" onClick={() => onNav("course")}>
              <div className="course-prev__img course-prev__img--b">
                <span className="course-prev__tag"><i data-lucide="accessibility"></i> 무장애 코스</span>
              </div>
              <div className="course-prev__body">
                <div className="course-prev__t">휠체어도 함께, 경포 둘레 코스</div>
                <div className="course-prev__meta"><i data-lucide="map-pin"></i> 무장애 시설 위주</div>
              </div>
            </button>
          </div>
        </div>
        <TabBar active="home" onNav={onNav} />
      </div>
    </PhoneFrame>
  );
}

/* ============ Course result ============ */
function CourseResult({ pet, onBack, onOpen, onNav }) {
  const [tab, setTab] = useState("map");
  const [plan, setPlan] = useState(null);
  const [verdicts, setVerdicts] = useState({});
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  useEffect(relucide);

  useEffect(() => {
    let live = true;
    setLoading(true); setErr(null);
    API.routePlan({ pet_size: pet.size, pet_breed: pet.breed, days: 2 })
      .then(async (p) => {
        if (!live) return;
        setPlan(p);
        const entries = await Promise.all(
          p.stops.map((s) =>
            API.entryVerdict({ place_name: s.name, pet_name: pet.name, pet_size: pet.size })
              .then((v) => [s.name, v]).catch(() => [s.name, null])
          )
        );
        if (live) setVerdicts(Object.fromEntries(entries));
      })
      .catch(() => { if (live) setErr("동선을 불러오지 못했어요."); })
      .finally(() => { if (live) setLoading(false); });
    return () => { live = false; };
  }, [pet.size, pet.breed, pet.name]);

  const stops = plan ? plan.stops : [];
  return (
    <PhoneFrame>
      <div className="screen">
        <StatusBar />
        <AppBar title={`${API.REGION} 추천 코스`} onBack={onBack}
          action={<IconButton icon="share-2" variant="plain" label="공유" />} />
        <div className="course__sub">
          <span className="course__pill"><i data-lucide="calendar-days"></i> 1박 2일</span>
          <span className="course__pill"><i data-lucide="map-pin"></i> {plan ? `${plan.stop_count}곳` : "…"}</span>
          <span className="course__pill"><i data-lucide="route"></i> {plan ? `${plan.total_distance_km}km` : "…"}</span>
          <span className="course__pill course__pill--vet"><i data-lucide="cross"></i> 병원 포함</span>
        </div>
        <div className="course__tabs">
          <Tabs block value={tab} onChange={setTab}
            items={[{ value: "map", label: "지도", icon: "map" }, { value: "list", label: "리스트", icon: "list" }]} />
        </div>

        <div className="course__body">
          {tab === "map" && <MapView stops={stops} height={232} />}
          {plan && plan.summary && (
            <p style={{ font: "var(--text-caption)", color: "var(--text-muted)", padding: "12px 20px 0", margin: 0 }}>
              {plan.summary}
            </p>
          )}
          <div className="course__list">
            {loading && !stops.length && <p style={{ color: "var(--text-muted)", font: "var(--text-body)" }}>동선을 짜는 중…</p>}
            {err && <p style={{ color: "var(--danger-text)", font: "var(--text-body)" }}>{err}</p>}
            {stops.map((s, i) => {
              const v = verdicts[s.name];
              return (
                <PlaceCard key={s.order} name={s.name} category={s.category} categoryIcon={iconFor(s.category)}
                  index={i + 1} verdict={v ? v.verdict : undefined} petName={pet.name}
                  condition={v && v.conditions && v.conditions.length ? v.conditions.join(", ") : null}
                  onClick={() => onOpen(s)} />
              );
            })}
          </div>
        </div>

        <div className="screen__cta screen__cta--row">
          <IconButton icon="bookmark" variant="outline" label="저장" size="lg" />
          <Button variant="primary" size="lg" block icon="navigation">이 코스로 갈래요</Button>
        </div>
      </div>
    </PhoneFrame>
  );
}

/* ============ Place detail ============ */
function PlaceDetail({ place, pet, onBack }) {
  const [verdict, setVerdict] = useState(null);
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(relucide);

  useEffect(() => {
    let live = true;
    setLoading(true);
    API.entryVerdict({ place_name: place.name, pet_name: pet.name, pet_size: pet.size })
      .then(async (v) => {
        if (!live) return;
        setVerdict(v);
        if (v.conditions && v.conditions.length) {
          try {
            const parsed = await API.parsePolicy(v.conditions.join(", "));
            if (live) setBadges(parsed.badges.map((b) => b.code));
          } catch (e) {}
        }
      })
      .catch(() => {})
      .finally(() => { if (live) setLoading(false); });
    return () => { live = false; };
  }, [place.name, pet.name, pet.size]);

  const vk = verdict ? verdict.verdict : "allowed";
  const icon = iconFor(place.category);
  return (
    <PhoneFrame>
      <div className="screen">
        <div className={"detail__hero detail__hero--" + vk}>
          <StatusBar dark />
          <div className="detail__hero-bar">
            <IconButton icon="chevron-left" variant="soft" label="뒤로" onClick={onBack} />
            <div style={{ display: "flex", gap: 8 }}>
              <IconButton icon="share-2" variant="soft" label="공유" />
              <IconButton icon="heart" variant="soft" label="저장" />
            </div>
          </div>
          <div className="detail__hero-ico"><i data-lucide={icon}></i></div>
        </div>

        <div className="detail__body">
          <div className="detail__cat"><i data-lucide={icon}></i> {place.category}</div>
          <h1 className="detail__name">{place.name}</h1>

          <div className={"detail__verdict detail__verdict--" + vk}>
            <VerdictPill verdict={vk} solid />
            <div className="detail__verdict-txt">
              <strong>{verdict ? VERDICT_TITLE[vk](pet.name) : "판정 확인 중…"}</strong>
              <span>{verdict ? verdict.message : `${pet.name} 기준으로 입장 가능 여부를 확인하고 있어요.`}</span>
            </div>
          </div>

          {badges.length > 0 && (
            <div className="detail__sect">
              <div className="detail__sect-t">시설 규정</div>
              <div className="detail__badges">
                {badges.map((b) => <PolicyBadge key={b} type={b} size="md" />)}
              </div>
            </div>
          )}

          <div className="detail__info">
            <div className="detail__info-row"><i data-lucide="map-pin"></i><span>{API.REGION} · {place.category}</span></div>
            <div className="detail__info-row"><i data-lucide="navigation"></i>
              <span>좌표 {place.latitude?.toFixed(4)}, {place.longitude?.toFixed(4)}</span></div>
            {verdict && verdict.conditions && verdict.conditions.length > 0 && (
              <div className="detail__info-row"><i data-lucide="clipboard-check"></i>
                <span>입장 조건 <strong>{verdict.conditions.join(", ")}</strong></span></div>
            )}
          </div>

          <MapView compact height={150} />
        </div>

        <div className="screen__cta">
          <Button variant="primary" size="lg" block icon="plus">동선에 추가</Button>
        </div>
      </div>
    </PhoneFrame>
  );
}

/* ============ Router ============ */
function App() {
  const [screen, setScreen] = useState("auth");
  const [pet, setPet] = useState(DEFAULT_PET);
  const [place, setPlace] = useState(null);
  const [provider, setProvider] = useState("demo");
  useEffect(() => { relucide(); }, [screen, place]);
  const nav = (k) => { setScreen(k === "course" ? "course" : "home"); };
  if (screen === "auth") return <AuthLanding onLogin={(p) => { setProvider(p); setScreen("onboarding"); }} />;
  if (screen === "onboarding") return <Onboarding provider={provider} onDone={(p) => { setPet(p || DEFAULT_PET); setScreen("home"); }} />;
  if (screen === "home") return <Home pet={pet} onNav={nav} onSearch={() => setScreen("course")} />;
  if (screen === "course") return <CourseResult pet={pet} onBack={() => setScreen("home")} onOpen={(s) => { setPlace(s); setScreen("detail"); }} onNav={nav} />;
  if (screen === "detail") return <PlaceDetail place={place} pet={pet} onBack={() => setScreen("course")} />;
  return null;
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
relucide();
