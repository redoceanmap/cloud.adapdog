/* 발자국 app — shell, map, nav, shared UI. Exposes pieces on window for screens.jsx. */
const { useState } = React;
const DS = window.DesignSystem_d6ad93;

function relucide() {
  const run = () => { try { window.lucide && window.lucide.createIcons(); } catch (e) {} };
  run();
  requestAnimationFrame(run);
  setTimeout(run, 80);
}

/* ---------- Phone frame ---------- */
function PhoneFrame({ children }) {
  return (
    <div className="phone">
      <div className="phone__screen">{children}</div>
    </div>
  );
}

function StatusBar({ dark = false }) {
  return (
    <div className={"statusbar" + (dark ? " statusbar--dark" : "")}>
      <span className="statusbar__time">9:41</span>
      <span className="statusbar__icons">
        <i data-lucide="signal"></i>
        <i data-lucide="wifi"></i>
        <i data-lucide="battery-full"></i>
      </span>
    </div>
  );
}

/* ---------- Stylized map (placeholder for real tiles) ---------- */
function MapView({ stops, height = 300, compact = false }) {
  return (
    <div className="map" style={{ height }}>
      <svg className="map__bg" viewBox="0 0 412 340" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <rect width="412" height="340" fill="#e9efe6" />
        <path d="M-20 250 Q120 200 230 250 T460 240 V360 H-20 Z" fill="#dfe9f6" />
        <path d="M-20 250 Q120 200 230 250 T460 240" stroke="#cdddf0" strokeWidth="2" fill="none" />
        <path d="M40 40 Q140 10 220 60 T400 50 V120 Q300 150 200 120 T20 130 Z" fill="#eef3ea" />
        <circle cx="320" cy="90" r="46" fill="#e4ede0" />
        <g stroke="#d8e0d2" strokeWidth="1.5">
          <path d="M0 170 H412 M0 110 H412 M120 0 V340 M260 0 V340" opacity="0.5" />
        </g>
      </svg>
      <svg className="map__route" viewBox="0 0 412 340" preserveAspectRatio="none" aria-hidden="true">
        <polyline points="78,118 168,96 232,172 300,150 336,236"
          fill="none" stroke="var(--route-line)" strokeWidth="4" strokeLinecap="round"
          strokeDasharray="2 11" strokeLinejoin="round" />
      </svg>
      {[
        { n: 1, x: 78, y: 118 },
        { n: 2, x: 168, y: 96 },
        { n: 3, x: 232, y: 172 },
        { n: 4, x: 300, y: 150 },
        { n: 5, x: 336, y: 236 },
      ].map((p) => (
        <div key={p.n} className="map__pin" style={{ left: p.x, top: p.y }}>
          <svg className="map__paw" viewBox="0 0 64 64" aria-hidden="true">
            <g fill="var(--brand)" stroke="#fff" strokeWidth="4.5" strokeLinejoin="round" style={{ paintOrder: "stroke" }}>
              <ellipse cx="17.5" cy="26" rx="6" ry="8" transform="rotate(-24 17.5 26)" />
              <ellipse cx="27.5" cy="16.5" rx="6" ry="8.5" transform="rotate(-8 27.5 16.5)" />
              <ellipse cx="39" cy="16.5" rx="6" ry="8.5" transform="rotate(8 39 16.5)" />
              <ellipse cx="49" cy="27" rx="6" ry="8" transform="rotate(24 49 27)" />
              <path d="M33 33c8.2 0 15 5.7 15 13.1 0 5.1-3.9 8.2-8.7 8.2-3 0-4.6-1.5-6.3-1.5s-3.3 1.5-6.3 1.5C16.9 54.3 13 51.2 13 46.1 13 38.7 24.8 33 33 33Z" />
            </g>
          </svg>
          <span className="map__pin-n">{p.n}</span>
        </div>
      ))}
      <div className="map__pin map__pin--vet" style={{ left: 250, top: 110 }}>
        <i data-lucide="cross"></i>
      </div>
      {!compact && (
        <div className="map__controls">
          <DS.IconButton icon="plus" variant="solid" label="확대" size="sm" />
          <DS.IconButton icon="minus" variant="outline" label="축소" size="sm" />
          <DS.IconButton icon="locate-fixed" variant="outline" label="내 위치" size="sm" />
        </div>
      )}
    </div>
  );
}

/* ---------- Bottom tab bar ---------- */
function TabBar({ active, onNav }) {
  const tabs = [
    { k: "home", icon: "house", label: "홈" },
    { k: "course", icon: "route", label: "코스" },
    { k: "saved", icon: "bookmark", label: "저장" },
    { k: "me", icon: "user-round", label: "프로필" },
  ];
  return (
    <nav className="tabbar">
      {tabs.map((t) => (
        <button
          key={t.k}
          className={"tabbar__item" + (active === t.k ? " is-active" : "")}
          onClick={() => onNav(t.k)}
        >
          <i data-lucide={t.icon}></i>
          <span>{t.label}</span>
        </button>
      ))}
    </nav>
  );
}

/* ---------- Top app bar ---------- */
function AppBar({ title, onBack, action }) {
  return (
    <div className="appbar">
      {onBack ? <DS.IconButton icon="chevron-left" variant="plain" label="뒤로" onClick={onBack} /> : <span style={{ width: 44 }} />}
      <span className="appbar__title">{title}</span>
      {action || <span style={{ width: 44 }} />}
    </div>
  );
}

/* ---------- Section header ---------- */
function SectionHead({ title, more }) {
  return (
    <div className="sect-head">
      <h2 className="sect-head__t">{title}</h2>
      {more ? <button className="sect-head__more">{more}<i data-lucide="chevron-right"></i></button> : null}
    </div>
  );
}

Object.assign(window, { PhoneFrame, StatusBar, MapView, TabBar, AppBar, SectionHead, relucide, DS });
