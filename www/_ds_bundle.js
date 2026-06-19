/* @ds-bundle: {"format":3,"namespace":"DesignSystem_d6ad93","components":[{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Chip","sourcePath":"components/core/Chip.jsx"},{"name":"IconButton","sourcePath":"components/core/IconButton.jsx"},{"name":"Switch","sourcePath":"components/core/Switch.jsx"},{"name":"Tabs","sourcePath":"components/core/Tabs.jsx"},{"name":"DogAvatar","sourcePath":"components/domain/DogAvatar.jsx"},{"name":"PlaceCard","sourcePath":"components/domain/PlaceCard.jsx"},{"name":"RouteStop","sourcePath":"components/domain/RouteStop.jsx"},{"name":"POLICY_BADGES","sourcePath":"components/feedback/PolicyBadge.jsx"},{"name":"PolicyBadge","sourcePath":"components/feedback/PolicyBadge.jsx"},{"name":"RiskBadge","sourcePath":"components/feedback/RiskBadge.jsx"},{"name":"VerdictPill","sourcePath":"components/feedback/VerdictPill.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"}],"sourceHashes":{"components/core/Button.jsx":"dce0f6331f13","components/core/Chip.jsx":"dd3d66553b87","components/core/IconButton.jsx":"ffe9f4dd9443","components/core/Switch.jsx":"d97bccb74c32","components/core/Tabs.jsx":"58bfa9243a6c","components/domain/DogAvatar.jsx":"831f489d919d","components/domain/PlaceCard.jsx":"14bcff0b7417","components/domain/RouteStop.jsx":"aa3c87a0f52e","components/feedback/PolicyBadge.jsx":"c4e63f4fe4b3","components/feedback/RiskBadge.jsx":"1bf857bc5f94","components/feedback/VerdictPill.jsx":"e829629ee762","components/forms/Input.jsx":"04192f3ffa47","components/forms/Select.jsx":"421945a989ef","ui_kits/app/app.jsx":"dcc6e2322a92","ui_kits/app/screens.jsx":"644765c86704"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.DesignSystem_d6ad93 = window.DesignSystem_d6ad93 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
let injected = false;
function inject() {
  if (injected || typeof document === "undefined") return;
  injected = true;
  const el = document.createElement("style");
  el.id = "bj-button-styles";
  el.textContent = `
  .bj-btn {
    --_bg: var(--brand); --_fg: var(--on-brand); --_bd: transparent;
    display: inline-flex; align-items: center; justify-content: center; gap: 8px;
    font-family: var(--font-sans); font-weight: var(--fw-bold);
    border: 1.5px solid var(--_bd); background: var(--_bg); color: var(--_fg);
    border-radius: var(--radius-md); cursor: pointer; white-space: nowrap;
    text-decoration: none; line-height: 1; box-sizing: border-box;
    transition: background var(--dur-fast) var(--ease-out),
      transform var(--dur-fast) var(--ease-out),
      box-shadow var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out);
  }
  .bj-btn:focus-visible { outline: 3px solid var(--focus-ring); outline-offset: 2px; }
  .bj-btn:active { transform: scale(0.97); }
  .bj-btn[disabled] { opacity: 0.45; cursor: not-allowed; transform: none; box-shadow: none; }
  .bj-btn svg, .bj-btn i { width: 1.15em; height: 1.15em; flex: none; }

  .bj-btn--sm { height: 36px; padding: 0 14px; font-size: var(--fs-label); border-radius: var(--radius-sm); }
  .bj-btn--md { height: 46px; padding: 0 20px; font-size: var(--fs-body); }
  .bj-btn--lg { height: 54px; padding: 0 26px; font-size: var(--fs-body-lg); border-radius: var(--radius-lg); }
  .bj-btn--block { width: 100%; }

  .bj-btn--primary { --_bg: var(--brand); --_fg: var(--on-brand); box-shadow: var(--shadow-brand-sm); }
  .bj-btn--primary:hover:not([disabled]) { --_bg: var(--brand-hover); box-shadow: var(--shadow-brand); }
  .bj-btn--primary:active:not([disabled]) { --_bg: var(--brand-pressed); }

  .bj-btn--secondary { --_bg: var(--surface-card); --_fg: var(--text-strong); --_bd: var(--border-strong); }
  .bj-btn--secondary:hover:not([disabled]) { --_bg: var(--surface-sunken); --_bd: var(--sand-400); }

  .bj-btn--ghost { --_bg: transparent; --_fg: var(--text-brand); --_bd: transparent; }
  .bj-btn--ghost:hover:not([disabled]) { --_bg: var(--brand-soft); }

  .bj-btn--danger { --_bg: var(--danger); --_fg: #fff; }
  .bj-btn--danger:hover:not([disabled]) { --_bg: var(--red-600); }
  `;
  document.head.appendChild(el);
}

/**
 * 발자국 Button — primary action control.
 * Icons use Lucide: pass `icon`/`iconRight` as a lucide name; the host page must
 * run lucide.createIcons() after render.
 */
function Button({
  variant = "primary",
  size = "md",
  block = false,
  icon,
  iconRight,
  as = "button",
  children,
  className = "",
  ...rest
}) {
  inject();
  const Tag = as;
  const cls = ["bj-btn", `bj-btn--${variant}`, `bj-btn--${size}`, block ? "bj-btn--block" : "", className].filter(Boolean).join(" ");
  return /*#__PURE__*/React.createElement(Tag, _extends({
    className: cls
  }, rest), icon ? /*#__PURE__*/React.createElement("i", {
    "data-lucide": icon,
    "aria-hidden": "true"
  }) : null, children, iconRight ? /*#__PURE__*/React.createElement("i", {
    "data-lucide": iconRight,
    "aria-hidden": "true"
  }) : null);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Chip.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
let injected = false;
function inject() {
  if (injected || typeof document === "undefined") return;
  injected = true;
  const el = document.createElement("style");
  el.textContent = `
  .bj-chip {
    display: inline-flex; align-items: center; gap: 6px;
    font-family: var(--font-sans); font-weight: var(--fw-semibold);
    font-size: var(--fs-label); line-height: 1;
    padding: 9px 14px; border-radius: var(--radius-pill);
    border: 1.5px solid var(--border-default); background: var(--surface-card);
    color: var(--text-body); cursor: pointer; box-sizing: border-box; user-select: none;
    transition: background var(--dur-fast) var(--ease-out),
      border-color var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out),
      transform var(--dur-fast) var(--ease-out);
  }
  .bj-chip:active { transform: scale(0.96); }
  .bj-chip:focus-visible { outline: 3px solid var(--focus-ring); outline-offset: 2px; }
  .bj-chip svg, .bj-chip i { width: 15px; height: 15px; }
  .bj-chip:hover:not(.bj-chip--on) { border-color: var(--border-strong); background: var(--surface-sunken); }
  .bj-chip--on {
    background: var(--brand-soft); border-color: var(--brand); color: var(--text-brand);
  }
  .bj-chip--on .bj-chip__check { display: inline-flex; }
  `;
  document.head.appendChild(el);
}

/**
 * 발자국 Chip — toggleable filter pill (무장애 필터, 카테고리, 크기 등).
 */
function Chip({
  selected = false,
  icon,
  onToggle,
  children,
  className = "",
  ...rest
}) {
  inject();
  const cls = ["bj-chip", selected ? "bj-chip--on" : "", className].filter(Boolean).join(" ");
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    className: cls,
    "aria-pressed": selected,
    onClick: onToggle
  }, rest), icon ? /*#__PURE__*/React.createElement("i", {
    "data-lucide": icon,
    "aria-hidden": "true"
  }) : null, children);
}
Object.assign(__ds_scope, { Chip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Chip.jsx", error: String((e && e.message) || e) }); }

// components/core/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
let injected = false;
function inject() {
  if (injected || typeof document === "undefined") return;
  injected = true;
  const el = document.createElement("style");
  el.textContent = `
  .bj-iconbtn {
    display: inline-flex; align-items: center; justify-content: center;
    border: 1.5px solid transparent; background: var(--surface-card);
    color: var(--text-body); cursor: pointer; box-sizing: border-box;
    transition: background var(--dur-fast) var(--ease-out),
      transform var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out),
      border-color var(--dur-fast) var(--ease-out);
  }
  .bj-iconbtn:focus-visible { outline: 3px solid var(--focus-ring); outline-offset: 2px; }
  .bj-iconbtn:active { transform: scale(0.94); }
  .bj-iconbtn[disabled] { opacity: 0.4; cursor: not-allowed; }
  .bj-iconbtn svg, .bj-iconbtn i { width: 1.3em; height: 1.3em; }
  .bj-iconbtn--sm { width: 36px; height: 36px; font-size: 16px; border-radius: var(--radius-sm); }
  .bj-iconbtn--md { width: 44px; height: 44px; font-size: 19px; border-radius: var(--radius-md); }
  .bj-iconbtn--lg { width: 52px; height: 52px; font-size: 22px; border-radius: var(--radius-md); }

  .bj-iconbtn--solid { background: var(--brand); color: var(--on-brand); box-shadow: var(--shadow-brand-sm); }
  .bj-iconbtn--solid:hover:not([disabled]) { background: var(--brand-hover); }
  .bj-iconbtn--outline { border-color: var(--border-default); }
  .bj-iconbtn--outline:hover:not([disabled]) { background: var(--surface-sunken); border-color: var(--border-strong); }
  .bj-iconbtn--soft { background: var(--brand-soft); color: var(--text-brand); }
  .bj-iconbtn--soft:hover:not([disabled]) { background: var(--coral-100); }
  .bj-iconbtn--plain { background: transparent; }
  .bj-iconbtn--plain:hover:not([disabled]) { background: var(--surface-sunken); }
  `;
  document.head.appendChild(el);
}

/**
 * 발자국 IconButton — square tappable icon-only control (map controls, nav, close).
 */
function IconButton({
  icon,
  variant = "outline",
  size = "md",
  label,
  className = "",
  children,
  ...rest
}) {
  inject();
  const cls = ["bj-iconbtn", `bj-iconbtn--${variant}`, `bj-iconbtn--${size}`, className].filter(Boolean).join(" ");
  return /*#__PURE__*/React.createElement("button", _extends({
    className: cls,
    "aria-label": label
  }, rest), icon ? /*#__PURE__*/React.createElement("i", {
    "data-lucide": icon,
    "aria-hidden": "true"
  }) : children);
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/core/Switch.jsx
try { (() => {
let injected = false;
function inject() {
  if (injected || typeof document === "undefined") return;
  injected = true;
  const el = document.createElement("style");
  el.textContent = `
  .bj-switch { display: inline-flex; align-items: center; gap: 10px; cursor: pointer; user-select: none; }
  .bj-switch__track {
    position: relative; width: 48px; height: 28px; border-radius: var(--radius-pill);
    background: var(--sand-300); transition: background var(--dur-base) var(--ease-out); flex: none;
  }
  .bj-switch__thumb {
    position: absolute; top: 3px; left: 3px; width: 22px; height: 22px; border-radius: 50%;
    background: #fff; box-shadow: var(--shadow-sm);
    transition: transform var(--dur-base) var(--ease-spring);
  }
  .bj-switch--on .bj-switch__track { background: var(--brand); }
  .bj-switch--on .bj-switch__thumb { transform: translateX(20px); }
  .bj-switch__label { font: var(--text-body); color: var(--text-body); }
  .bj-switch input { position: absolute; opacity: 0; width: 0; height: 0; }
  .bj-switch:focus-within .bj-switch__track { outline: 3px solid var(--focus-ring); outline-offset: 2px; }
  .bj-switch--disabled { opacity: 0.45; cursor: not-allowed; }
  `;
  document.head.appendChild(el);
}

/**
 * 발자국 Switch — on/off toggle (안전 알림, 무장애 우선 등).
 */
function Switch({
  checked = false,
  onChange,
  label,
  disabled = false,
  className = ""
}) {
  inject();
  const cls = ["bj-switch", checked ? "bj-switch--on" : "", disabled ? "bj-switch--disabled" : "", className].filter(Boolean).join(" ");
  return /*#__PURE__*/React.createElement("label", {
    className: cls
  }, /*#__PURE__*/React.createElement("span", {
    className: "bj-switch__track"
  }, /*#__PURE__*/React.createElement("span", {
    className: "bj-switch__thumb"
  })), /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: checked,
    disabled: disabled,
    onChange: e => onChange && onChange(e.target.checked)
  }), label ? /*#__PURE__*/React.createElement("span", {
    className: "bj-switch__label"
  }, label) : null);
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Switch.jsx", error: String((e && e.message) || e) }); }

// components/core/Tabs.jsx
try { (() => {
let injected = false;
function inject() {
  if (injected || typeof document === "undefined") return;
  injected = true;
  const el = document.createElement("style");
  el.textContent = `
  .bj-tabs { display: inline-flex; gap: 4px; padding: 4px; background: var(--surface-sunken);
    border-radius: var(--radius-pill); }
  .bj-tabs--block { display: flex; width: 100%; }
  .bj-tab {
    flex: 1; display: inline-flex; align-items: center; justify-content: center; gap: 6px;
    font-family: var(--font-sans); font-weight: var(--fw-semibold); font-size: var(--fs-label);
    padding: 8px 16px; border: none; background: transparent; color: var(--text-muted);
    border-radius: var(--radius-pill); cursor: pointer; white-space: nowrap;
    transition: color var(--dur-fast) var(--ease-out), background var(--dur-base) var(--ease-out),
      box-shadow var(--dur-base) var(--ease-out);
  }
  .bj-tab svg, .bj-tab i { width: 16px; height: 16px; }
  .bj-tab:hover:not(.bj-tab--on) { color: var(--text-body); }
  .bj-tab--on { background: var(--surface-card); color: var(--text-brand); box-shadow: var(--shadow-sm); }
  .bj-tab:focus-visible { outline: 3px solid var(--focus-ring); outline-offset: 2px; }
  `;
  document.head.appendChild(el);
}

/**
 * 발자국 Tabs — segmented pill switcher (지도/리스트, 일자별 보기 등).
 */
function Tabs({
  items = [],
  value,
  onChange,
  block = false,
  className = ""
}) {
  inject();
  const cls = ["bj-tabs", block ? "bj-tabs--block" : "", className].filter(Boolean).join(" ");
  return /*#__PURE__*/React.createElement("div", {
    className: cls,
    role: "tablist"
  }, items.map(it => {
    const key = typeof it === "string" ? it : it.value;
    const label = typeof it === "string" ? it : it.label;
    const icon = typeof it === "string" ? null : it.icon;
    const on = key === value;
    return /*#__PURE__*/React.createElement("button", {
      key: key,
      role: "tab",
      "aria-selected": on,
      className: "bj-tab" + (on ? " bj-tab--on" : ""),
      onClick: () => onChange && onChange(key)
    }, icon ? /*#__PURE__*/React.createElement("i", {
      "data-lucide": icon,
      "aria-hidden": "true"
    }) : null, label);
  }));
}
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Tabs.jsx", error: String((e && e.message) || e) }); }

// components/domain/DogAvatar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const SIZE_LABEL = {
  small: "소형",
  medium: "중형",
  large: "대형"
};
let injected = false;
function inject() {
  if (injected || typeof document === "undefined") return;
  injected = true;
  const el = document.createElement("style");
  el.textContent = `
  .bj-dog { position: relative; display: inline-flex; flex: none; }
  .bj-dog__img {
    border-radius: 50%; object-fit: cover; background: var(--brand-soft);
    display: grid; place-items: center; overflow: hidden; box-sizing: border-box;
  }
  .bj-dog--ring .bj-dog__img { border: 2.5px solid var(--brand); box-shadow: 0 0 0 3px var(--surface-card); }
  .bj-dog__fallback { width: 58%; height: 58%; opacity: .9; }
  .bj-dog__size {
    position: absolute; right: -2px; bottom: -2px;
    background: var(--surface-card); color: var(--text-brand);
    border: 2px solid var(--surface-card); border-radius: var(--radius-pill);
    font-family: var(--font-sans); font-weight: var(--fw-extra); line-height: 1;
    box-shadow: var(--shadow-sm);
  }
  `;
  document.head.appendChild(el);
}
const PX = {
  xs: 32,
  sm: 40,
  md: 56,
  lg: 80,
  xl: 104
};

/**
 * 발자국 DogAvatar — circular pet avatar with size badge + paw fallback.
 */
function DogAvatar({
  src,
  name,
  size = "md",
  petSize,
  ring = false,
  className = "",
  ...rest
}) {
  inject();
  const px = PX[size] || PX.md;
  const cls = ["bj-dog", ring ? "bj-dog--ring" : "", className].filter(Boolean).join(" ");
  return /*#__PURE__*/React.createElement("span", _extends({
    className: cls,
    style: {
      width: px,
      height: px
    }
  }, rest), src ? /*#__PURE__*/React.createElement("img", {
    className: "bj-dog__img",
    src: src,
    alt: name || "강아지",
    style: {
      width: px,
      height: px
    }
  }) : /*#__PURE__*/React.createElement("span", {
    className: "bj-dog__img",
    style: {
      width: px,
      height: px
    },
    "aria-label": name || "강아지"
  }, /*#__PURE__*/React.createElement("svg", {
    className: "bj-dog__fallback",
    viewBox: "0 0 64 64",
    fill: "none",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("ellipse", {
    cx: "17.5",
    cy: "26",
    rx: "6",
    ry: "8",
    transform: "rotate(-24 17.5 26)",
    fill: "var(--brand)"
  }), /*#__PURE__*/React.createElement("ellipse", {
    cx: "27.5",
    cy: "16.5",
    rx: "6",
    ry: "8.5",
    transform: "rotate(-8 27.5 16.5)",
    fill: "var(--brand)"
  }), /*#__PURE__*/React.createElement("ellipse", {
    cx: "39",
    cy: "16.5",
    rx: "6",
    ry: "8.5",
    transform: "rotate(8 39 16.5)",
    fill: "var(--brand)"
  }), /*#__PURE__*/React.createElement("ellipse", {
    cx: "49",
    cy: "27",
    rx: "6",
    ry: "8",
    transform: "rotate(24 49 27)",
    fill: "var(--brand)"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M33 33c8.2 0 15 5.7 15 13.1 0 5.1-3.9 8.2-8.7 8.2-3 0-4.6-1.5-6.3-1.5s-3.3 1.5-6.3 1.5C16.9 54.3 13 51.2 13 46.1 13 38.7 24.8 33 33 33Z",
    fill: "var(--brand)"
  }))), petSize ? /*#__PURE__*/React.createElement("span", {
    className: "bj-dog__size",
    style: {
      fontSize: Math.max(9, px * 0.18),
      padding: `${px * 0.04}px ${px * 0.09}px`
    }
  }, SIZE_LABEL[petSize] || petSize) : null);
}
Object.assign(__ds_scope, { DogAvatar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/domain/DogAvatar.jsx", error: String((e && e.message) || e) }); }

// components/domain/RouteStop.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
let injected = false;
function inject() {
  if (injected || typeof document === "undefined") return;
  injected = true;
  const el = document.createElement("style");
  el.textContent = `
  .bj-stop { display: flex; gap: 12px; align-items: stretch; }
  .bj-stop__rail { display: flex; flex-direction: column; align-items: center; flex: none; width: 28px; }
  .bj-stop__node {
    width: 28px; height: 28px; border-radius: 50%; flex: none; display: grid; place-items: center;
    font: var(--text-label); font-weight: var(--fw-extra); color: #fff; background: var(--brand);
    box-shadow: var(--shadow-sm); z-index: 1;
  }
  .bj-stop__node i, .bj-stop__node svg { width: 15px; height: 15px; }
  .bj-stop__node--vet { background: var(--vet-marker); }
  .bj-stop__node--start { background: var(--sand-700); }
  .bj-stop__line { width: 2.5px; flex: 1; background: repeating-linear-gradient(
      var(--coral-300) 0 5px, transparent 5px 10px); margin: 2px 0; min-height: 14px; }
  .bj-stop__body { flex: 1; min-width: 0; padding-bottom: 18px; }
  .bj-stop--last .bj-stop__body { padding-bottom: 0; }
  .bj-stop__name { font: var(--text-title); color: var(--text-strong); letter-spacing: var(--ls-snug); }
  .bj-stop__meta { font: var(--text-caption); color: var(--text-muted); margin-top: 3px;
    display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
  .bj-stop__meta i, .bj-stop__meta svg { width: 13px; height: 13px; vertical-align: -2px; }
  .bj-stop__leg { font: var(--text-caption); color: var(--text-subtle); display: flex; align-items: center; gap: 5px; padding: 4px 0 0; }
  .bj-stop__leg i, .bj-stop__leg svg { width: 14px; height: 14px; }
  `;
  document.head.appendChild(el);
}

/**
 * 발자국 RouteStop — a timeline node in a course (동선 정류장).
 */
function RouteStop({
  index,
  name,
  time,
  category,
  legLabel,
  type = "place",
  last = false,
  children,
  className = "",
  ...rest
}) {
  inject();
  const nodeIcon = type === "vet" ? "cross" : type === "start" ? "flag" : null;
  return /*#__PURE__*/React.createElement("div", _extends({
    className: ["bj-stop", last ? "bj-stop--last" : "", className].filter(Boolean).join(" ")
  }, rest), /*#__PURE__*/React.createElement("div", {
    className: "bj-stop__rail"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bj-stop__node" + (type !== "place" ? ` bj-stop__node--${type}` : "")
  }, nodeIcon ? /*#__PURE__*/React.createElement("i", {
    "data-lucide": nodeIcon,
    "aria-hidden": "true"
  }) : index), !last ? /*#__PURE__*/React.createElement("div", {
    className: "bj-stop__line"
  }) : null), /*#__PURE__*/React.createElement("div", {
    className: "bj-stop__body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bj-stop__name"
  }, name), /*#__PURE__*/React.createElement("div", {
    className: "bj-stop__meta"
  }, time ? /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "clock",
    "aria-hidden": "true"
  }), " ", time) : null, category ? /*#__PURE__*/React.createElement("span", null, category) : null), children, legLabel && !last ? /*#__PURE__*/React.createElement("div", {
    className: "bj-stop__leg"
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "footprints",
    "aria-hidden": "true"
  }), legLabel) : null));
}
Object.assign(__ds_scope, { RouteStop });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/domain/RouteStop.jsx", error: String((e && e.message) || e) }); }

// components/feedback/PolicyBadge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const POLICY_BADGES = {
  carrier_required: {
    label: "이동장 필수",
    icon: "package",
    tone: "warn"
  },
  small_only: {
    label: "소형견만",
    icon: "dog",
    tone: "info"
  },
  indoor_ok: {
    label: "실내 가능",
    icon: "house",
    tone: "ok"
  },
  outdoor_only: {
    label: "실외만",
    icon: "trees",
    tone: "neutral"
  },
  leash_required: {
    label: "목줄 필수",
    icon: "link-2",
    tone: "warn"
  },
  muzzle_required: {
    label: "입마개 필수",
    icon: "shield-alert",
    tone: "warn"
  },
  waste_bag: {
    label: "배변봉투 지참",
    icon: "trash-2",
    tone: "neutral"
  },
  extra_fee: {
    label: "추가 요금",
    icon: "coins",
    tone: "neutral"
  }
};
let injected = false;
function inject() {
  if (injected || typeof document === "undefined") return;
  injected = true;
  const el = document.createElement("style");
  el.textContent = `
  .bj-badge {
    display: inline-flex; align-items: center; gap: 5px; box-sizing: border-box;
    font-family: var(--font-sans); font-weight: var(--fw-semibold); line-height: 1;
    border-radius: var(--radius-pill); white-space: nowrap;
    --_bg: var(--surface-sunken); --_fg: var(--text-body); --_bd: transparent;
    background: var(--_bg); color: var(--_fg); border: 1px solid var(--_bd);
  }
  .bj-badge svg, .bj-badge i { width: 1.05em; height: 1.05em; opacity: .9; }
  .bj-badge--sm { font-size: var(--fs-micro); padding: 5px 9px; }
  .bj-badge--md { font-size: var(--fs-label); padding: 7px 12px; }
  .bj-badge--neutral { --_bg: var(--sand-100); --_fg: var(--sand-700); }
  .bj-badge--warn { --_bg: var(--warning-soft); --_fg: var(--warning-text); }
  .bj-badge--ok   { --_bg: var(--success-soft); --_fg: var(--success-text); }
  .bj-badge--info { --_bg: var(--info-soft); --_fg: var(--info-text); }
  `;
  document.head.appendChild(el);
}

/**
 * 발자국 PolicyBadge — standardized facility-rule pictogram pill.
 * Pass a known `type` (BadgeType code) or a custom {label, icon, tone}.
 * Icons are Lucide names; host runs lucide.createIcons().
 */
function PolicyBadge({
  type,
  label,
  icon,
  tone,
  size = "sm",
  className = "",
  ...rest
}) {
  inject();
  const preset = type && POLICY_BADGES[type] ? POLICY_BADGES[type] : {};
  const _label = label != null ? label : preset.label;
  const _icon = icon != null ? icon : preset.icon;
  const _tone = tone != null ? tone : preset.tone || "neutral";
  const cls = ["bj-badge", `bj-badge--${size}`, `bj-badge--${_tone}`, className].filter(Boolean).join(" ");
  return /*#__PURE__*/React.createElement("span", _extends({
    className: cls
  }, rest), _icon ? /*#__PURE__*/React.createElement("i", {
    "data-lucide": _icon,
    "aria-hidden": "true"
  }) : null, _label);
}
Object.assign(__ds_scope, { POLICY_BADGES, PolicyBadge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/PolicyBadge.jsx", error: String((e && e.message) || e) }); }

// components/feedback/RiskBadge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const RISKS = {
  low: {
    label: "낮음",
    icon: "sun",
    tone: "low"
  },
  moderate: {
    label: "주의",
    icon: "cloud-sun",
    tone: "moderate"
  },
  high: {
    label: "높음",
    icon: "thermometer-sun",
    tone: "high"
  },
  severe: {
    label: "심각",
    icon: "triangle-alert",
    tone: "severe"
  }
};
let injected = false;
function inject() {
  if (injected || typeof document === "undefined") return;
  injected = true;
  const el = document.createElement("style");
  el.textContent = `
  .bj-risk {
    display: inline-flex; align-items: center; gap: 6px; box-sizing: border-box;
    font-family: var(--font-sans); font-weight: var(--fw-bold); line-height: 1;
    border-radius: var(--radius-pill); padding: 6px 11px; font-size: var(--fs-label);
    --_c: var(--risk-low);
    background: color-mix(in srgb, var(--_c) 14%, white); color: var(--_c);
  }
  .bj-risk svg, .bj-risk i { width: 1.15em; height: 1.15em; }
  .bj-risk--low { --_c: var(--green-600); }
  .bj-risk--moderate { --_c: var(--amber-700); }
  .bj-risk--high { --_c: var(--orange-600); }
  .bj-risk--severe { --_c: var(--red-600); }
  .bj-risk__pre { font-weight: var(--fw-semibold); opacity: .7; }

  /* Banner layout for safety-alert headers */
  .bj-risk-banner {
    display: flex; align-items: flex-start; gap: 12px; box-sizing: border-box;
    border-radius: var(--radius-lg); padding: 14px 16px;
    --_c: var(--risk-low);
    background: color-mix(in srgb, var(--_c) 10%, white);
    border: 1px solid color-mix(in srgb, var(--_c) 28%, white);
  }
  .bj-risk-banner--low { --_c: var(--green-600); }
  .bj-risk-banner--moderate { --_c: var(--amber-700); }
  .bj-risk-banner--high { --_c: var(--orange-600); }
  .bj-risk-banner--severe { --_c: var(--red-600); }
  .bj-risk-banner__ico {
    width: 38px; height: 38px; border-radius: var(--radius-md); flex: none;
    display: grid; place-items: center; background: var(--_c); color: #fff;
  }
  .bj-risk-banner__ico i, .bj-risk-banner__ico svg { width: 20px; height: 20px; }
  .bj-risk-banner__t { font: var(--text-title); color: var(--text-strong); margin-bottom: 2px; }
  .bj-risk-banner__d { font: var(--text-body); color: var(--text-muted); }
  `;
  document.head.appendChild(el);
}

/**
 * 발자국 RiskBadge — weather × breed walk-risk indicator (낮음/주의/높음/심각).
 * Compact pill by default; `banner` renders a titled safety-alert block.
 */
function RiskBadge({
  level = "low",
  banner = false,
  title,
  description,
  className = "",
  ...rest
}) {
  inject();
  const r = RISKS[level] || RISKS.low;
  if (banner) {
    const cls = ["bj-risk-banner", `bj-risk-banner--${r.tone}`, className].filter(Boolean).join(" ");
    return /*#__PURE__*/React.createElement("div", _extends({
      className: cls
    }, rest), /*#__PURE__*/React.createElement("span", {
      className: "bj-risk-banner__ico"
    }, /*#__PURE__*/React.createElement("i", {
      "data-lucide": r.icon,
      "aria-hidden": "true"
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "bj-risk-banner__t"
    }, title || `오늘 위험도 ${r.label}`), description ? /*#__PURE__*/React.createElement("div", {
      className: "bj-risk-banner__d"
    }, description) : null));
  }
  const cls = ["bj-risk", `bj-risk--${r.tone}`, className].filter(Boolean).join(" ");
  return /*#__PURE__*/React.createElement("span", _extends({
    className: cls
  }, rest), /*#__PURE__*/React.createElement("i", {
    "data-lucide": r.icon,
    "aria-hidden": "true"
  }), /*#__PURE__*/React.createElement("span", {
    className: "bj-risk__pre"
  }, "\uC704\uD5D8\uB3C4"), r.label);
}
Object.assign(__ds_scope, { RiskBadge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/RiskBadge.jsx", error: String((e && e.message) || e) }); }

// components/feedback/VerdictPill.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const VERDICTS = {
  allowed: {
    label: "입장 가능",
    icon: "circle-check",
    tone: "ok"
  },
  conditional: {
    label: "조건부 가능",
    icon: "circle-alert",
    tone: "warn"
  },
  denied: {
    label: "입장 불가",
    icon: "circle-x",
    tone: "no"
  }
};
let injected = false;
function inject() {
  if (injected || typeof document === "undefined") return;
  injected = true;
  const el = document.createElement("style");
  el.textContent = `
  .bj-verdict {
    display: inline-flex; align-items: center; gap: 7px; box-sizing: border-box;
    font-family: var(--font-sans); font-weight: var(--fw-bold); line-height: 1;
    border-radius: var(--radius-pill); padding: 8px 14px; font-size: var(--fs-label);
    --_bg: var(--success-soft); --_fg: var(--success-text);
    background: var(--_bg); color: var(--_fg);
  }
  .bj-verdict svg, .bj-verdict i { width: 1.2em; height: 1.2em; }
  .bj-verdict--ok   { --_bg: var(--success-soft); --_fg: var(--success-text); }
  .bj-verdict--warn { --_bg: var(--warning-soft); --_fg: var(--warning-text); }
  .bj-verdict--no   { --_bg: var(--danger-soft); --_fg: var(--danger-text); }
  .bj-verdict__pet { font-weight: var(--fw-extra); }
  .bj-verdict__cond { font-weight: var(--fw-medium); opacity: .8; }

  .bj-verdict--solid.bj-verdict--ok   { background: var(--success); color: #fff; }
  .bj-verdict--solid.bj-verdict--warn { background: var(--warning); color: #fff; }
  .bj-verdict--solid.bj-verdict--no   { background: var(--danger); color: #fff; }
  `;
  document.head.appendChild(el);
}

/**
 * 발자국 VerdictPill — personalized entry verdict for the user's dog.
 * Mirrors backend EntryVerdict (allowed / conditional / denied).
 */
function VerdictPill({
  verdict = "allowed",
  petName,
  condition,
  solid = false,
  className = "",
  ...rest
}) {
  inject();
  const v = VERDICTS[verdict] || VERDICTS.allowed;
  const cls = ["bj-verdict", `bj-verdict--${v.tone}`, solid ? "bj-verdict--solid" : "", className].filter(Boolean).join(" ");
  return /*#__PURE__*/React.createElement("span", _extends({
    className: cls
  }, rest), /*#__PURE__*/React.createElement("i", {
    "data-lucide": v.icon,
    "aria-hidden": "true"
  }), petName ? /*#__PURE__*/React.createElement("span", {
    className: "bj-verdict__pet"
  }, petName) : null, v.label, condition ? /*#__PURE__*/React.createElement("span", {
    className: "bj-verdict__cond"
  }, "\xB7 ", condition) : null);
}
Object.assign(__ds_scope, { VerdictPill });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/VerdictPill.jsx", error: String((e && e.message) || e) }); }

// components/domain/PlaceCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
let injected = false;
function inject() {
  if (injected || typeof document === "undefined") return;
  injected = true;
  const el = document.createElement("style");
  el.textContent = `
  .bj-place {
    display: flex; gap: 14px; box-sizing: border-box; width: 100%; text-align: left;
    background: var(--surface-card); border: 1px solid var(--border-subtle);
    border-radius: var(--radius-lg); padding: 12px; cursor: pointer;
    box-shadow: var(--shadow-sm); transition: box-shadow var(--dur-base) var(--ease-out),
      transform var(--dur-base) var(--ease-out), border-color var(--dur-base) var(--ease-out);
  }
  .bj-place:hover { box-shadow: var(--shadow-md); transform: translateY(-1px); border-color: var(--border-default); }
  .bj-place:active { transform: translateY(0) scale(0.995); }
  .bj-place:focus-visible { outline: 3px solid var(--focus-ring); outline-offset: 2px; }
  .bj-place__thumb {
    position: relative; width: 92px; height: 92px; flex: none; border-radius: var(--radius-md);
    overflow: hidden; background: var(--surface-sunken); display: grid; place-items: center;
  }
  .bj-place__thumb img { width: 100%; height: 100%; object-fit: cover; }
  .bj-place__thumb i, .bj-place__thumb svg { width: 28px; height: 28px; color: var(--sand-400); }
  .bj-place__idx {
    position: absolute; top: 6px; left: 6px; width: 22px; height: 22px; border-radius: 50%;
    background: var(--brand); color: #fff; display: grid; place-items: center;
    font: var(--text-micro); font-weight: var(--fw-extra); box-shadow: var(--shadow-sm);
  }
  .bj-place__body { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 6px; }
  .bj-place__cat { font: var(--text-caption); color: var(--text-muted); display: flex; align-items: center; gap: 5px; }
  .bj-place__cat i, .bj-place__cat svg { width: 13px; height: 13px; }
  .bj-place__name { font: var(--text-title); color: var(--text-strong); letter-spacing: var(--ls-snug);
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .bj-place__badges { display: flex; flex-wrap: wrap; gap: 5px; margin-top: 1px; }
  .bj-place__foot { display: flex; align-items: center; gap: 8px; margin-top: 2px; }
  `;
  document.head.appendChild(el);
}

/**
 * 발자국 PlaceCard — a facility row in a course/list.
 * Composes PolicyBadge + VerdictPill. `badges` = array of PolicyBadgeType codes.
 */
function PlaceCard({
  name,
  category,
  categoryIcon = "map-pin",
  image,
  index,
  distance,
  badges = [],
  verdict,
  petName,
  condition,
  maxBadges = 3,
  className = "",
  ...rest
}) {
  inject();
  const shown = badges.slice(0, maxBadges);
  const extra = badges.length - shown.length;
  return /*#__PURE__*/React.createElement("button", _extends({
    className: ["bj-place", className].filter(Boolean).join(" ")
  }, rest), /*#__PURE__*/React.createElement("span", {
    className: "bj-place__thumb"
  }, image ? /*#__PURE__*/React.createElement("img", {
    src: image,
    alt: name
  }) : /*#__PURE__*/React.createElement("i", {
    "data-lucide": categoryIcon,
    "aria-hidden": "true"
  }), index != null ? /*#__PURE__*/React.createElement("span", {
    className: "bj-place__idx"
  }, index) : null), /*#__PURE__*/React.createElement("span", {
    className: "bj-place__body"
  }, /*#__PURE__*/React.createElement("span", {
    className: "bj-place__cat"
  }, category ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("i", {
    "data-lucide": categoryIcon,
    "aria-hidden": "true"
  }), category) : null, distance ? /*#__PURE__*/React.createElement("span", null, "\xB7 ", distance) : null), /*#__PURE__*/React.createElement("span", {
    className: "bj-place__name"
  }, name), shown.length ? /*#__PURE__*/React.createElement("span", {
    className: "bj-place__badges"
  }, shown.map(b => /*#__PURE__*/React.createElement(__ds_scope.PolicyBadge, {
    key: b,
    type: b
  })), extra > 0 ? /*#__PURE__*/React.createElement(__ds_scope.PolicyBadge, {
    label: `+${extra}`,
    tone: "neutral"
  }) : null) : null, verdict ? /*#__PURE__*/React.createElement("span", {
    className: "bj-place__foot"
  }, /*#__PURE__*/React.createElement(__ds_scope.VerdictPill, {
    verdict: verdict,
    petName: petName,
    condition: condition
  })) : null));
}
Object.assign(__ds_scope, { PlaceCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/domain/PlaceCard.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
let injected = false;
function inject() {
  if (injected || typeof document === "undefined") return;
  injected = true;
  const el = document.createElement("style");
  el.textContent = `
  .bj-field { display: flex; flex-direction: column; gap: 7px; }
  .bj-field__label { font: var(--text-label); color: var(--text-strong); }
  .bj-field__req { color: var(--brand); margin-left: 2px; }
  .bj-input-wrap {
    display: flex; align-items: center; gap: 9px; box-sizing: border-box;
    background: var(--surface-card); border: 1.5px solid var(--border-default);
    border-radius: var(--radius-md); padding: 0 14px; height: 50px;
    transition: border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out);
  }
  .bj-input-wrap:focus-within { border-color: var(--brand); box-shadow: 0 0 0 3px var(--focus-ring); }
  .bj-input-wrap--err { border-color: var(--danger); }
  .bj-input-wrap--err:focus-within { box-shadow: 0 0 0 3px color-mix(in srgb, var(--danger) 30%, transparent); }
  .bj-input-wrap > i, .bj-input-wrap > svg { width: 19px; height: 19px; color: var(--text-subtle); flex: none; }
  .bj-input {
    flex: 1; border: none; outline: none; background: transparent; min-width: 0;
    font: var(--text-body); color: var(--text-body); padding: 0;
  }
  .bj-input::placeholder { color: var(--text-subtle); }
  .bj-input-wrap--lg { height: 58px; border-radius: var(--radius-lg); }
  .bj-input-wrap--pill { border-radius: var(--radius-pill); }
  .bj-field__hint { font: var(--text-caption); color: var(--text-muted); }
  .bj-field__hint--err { color: var(--danger-text); }
  .bj-input__suffix { font: var(--text-label); color: var(--text-muted); flex: none; }
  `;
  document.head.appendChild(el);
}

/**
 * 발자국 Input — text field with optional leading icon, label, hint/error.
 */
function Input({
  label,
  required = false,
  icon,
  hint,
  error,
  suffix,
  size = "md",
  shape = "round",
  className = "",
  id,
  ...rest
}) {
  inject();
  const fid = id || (label ? "bj-" + label.replace(/\s/g, "") : undefined);
  const wrapCls = ["bj-input-wrap", size === "lg" ? "bj-input-wrap--lg" : "", shape === "pill" ? "bj-input-wrap--pill" : "", error ? "bj-input-wrap--err" : ""].filter(Boolean).join(" ");
  return /*#__PURE__*/React.createElement("div", {
    className: ["bj-field", className].filter(Boolean).join(" ")
  }, label ? /*#__PURE__*/React.createElement("label", {
    className: "bj-field__label",
    htmlFor: fid
  }, label, required ? /*#__PURE__*/React.createElement("span", {
    className: "bj-field__req"
  }, "*") : null) : null, /*#__PURE__*/React.createElement("div", {
    className: wrapCls
  }, icon ? /*#__PURE__*/React.createElement("i", {
    "data-lucide": icon,
    "aria-hidden": "true"
  }) : null, /*#__PURE__*/React.createElement("input", _extends({
    id: fid,
    className: "bj-input"
  }, rest)), suffix ? /*#__PURE__*/React.createElement("span", {
    className: "bj-input__suffix"
  }, suffix) : null), error ? /*#__PURE__*/React.createElement("span", {
    className: "bj-field__hint bj-field__hint--err"
  }, error) : hint ? /*#__PURE__*/React.createElement("span", {
    className: "bj-field__hint"
  }, hint) : null);
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
let injected = false;
function inject() {
  if (injected || typeof document === "undefined") return;
  injected = true;
  const el = document.createElement("style");
  el.textContent = `
  .bj-select-wrap { position: relative; display: flex; flex-direction: column; gap: 7px; }
  .bj-select-box { position: relative; display: flex; align-items: center; }
  .bj-select {
    appearance: none; -webkit-appearance: none; width: 100%; box-sizing: border-box;
    height: 50px; padding: 0 42px 0 14px; font: var(--text-body); color: var(--text-body);
    background: var(--surface-card); border: 1.5px solid var(--border-default);
    border-radius: var(--radius-md); cursor: pointer; outline: none;
    transition: border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out);
  }
  .bj-select:focus { border-color: var(--brand); box-shadow: 0 0 0 3px var(--focus-ring); }
  .bj-select--placeholder { color: var(--text-subtle); }
  .bj-select-box > i {
    position: absolute; right: 14px; width: 18px; height: 18px; color: var(--text-subtle);
    pointer-events: none;
  }
  .bj-field__label { font: var(--text-label); color: var(--text-strong); }
  `;
  document.head.appendChild(el);
}

/**
 * 발자국 Select — styled native dropdown.
 * `options`: array of strings or {value,label}.
 */
function Select({
  label,
  options = [],
  value,
  onChange,
  placeholder,
  className = "",
  id,
  ...rest
}) {
  inject();
  const fid = id || (label ? "bj-sel-" + label.replace(/\s/g, "") : undefined);
  const isPlaceholder = placeholder != null && (value === "" || value == null);
  return /*#__PURE__*/React.createElement("div", {
    className: ["bj-select-wrap", className].filter(Boolean).join(" ")
  }, label ? /*#__PURE__*/React.createElement("label", {
    className: "bj-field__label",
    htmlFor: fid
  }, label) : null, /*#__PURE__*/React.createElement("div", {
    className: "bj-select-box"
  }, /*#__PURE__*/React.createElement("select", _extends({
    id: fid,
    className: "bj-select" + (isPlaceholder ? " bj-select--placeholder" : ""),
    value: value,
    onChange: onChange
  }, rest), placeholder ? /*#__PURE__*/React.createElement("option", {
    value: "",
    disabled: true
  }, placeholder) : null, options.map(o => {
    const v = typeof o === "string" ? o : o.value;
    const l = typeof o === "string" ? o : o.label;
    return /*#__PURE__*/React.createElement("option", {
      key: v,
      value: v
    }, l);
  })), /*#__PURE__*/React.createElement("i", {
    "data-lucide": "chevron-down",
    "aria-hidden": "true"
  })));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/app.jsx
try { (() => {
/* 발자국 app — shell, map, nav, shared UI. Exposes pieces on window for screens.jsx. */
const {
  useState
} = React;
const DS = window.DesignSystem_d6ad93;
function relucide() {
  const run = () => {
    try {
      window.lucide && window.lucide.createIcons();
    } catch (e) {}
  };
  run();
  requestAnimationFrame(run);
  setTimeout(run, 80);
}

/* ---------- Phone frame ---------- */
function PhoneFrame({
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "phone"
  }, /*#__PURE__*/React.createElement("div", {
    className: "phone__screen"
  }, children));
}
function StatusBar({
  dark = false
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "statusbar" + (dark ? " statusbar--dark" : "")
  }, /*#__PURE__*/React.createElement("span", {
    className: "statusbar__time"
  }, "9:41"), /*#__PURE__*/React.createElement("span", {
    className: "statusbar__icons"
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "signal"
  }), /*#__PURE__*/React.createElement("i", {
    "data-lucide": "wifi"
  }), /*#__PURE__*/React.createElement("i", {
    "data-lucide": "battery-full"
  })));
}

/* ---------- Stylized map (placeholder for real tiles) ---------- */
function MapView({
  stops,
  height = 300,
  compact = false
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "map",
    style: {
      height
    }
  }, /*#__PURE__*/React.createElement("svg", {
    className: "map__bg",
    viewBox: "0 0 412 340",
    preserveAspectRatio: "xMidYMid slice",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("rect", {
    width: "412",
    height: "340",
    fill: "#e9efe6"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M-20 250 Q120 200 230 250 T460 240 V360 H-20 Z",
    fill: "#dfe9f6"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M-20 250 Q120 200 230 250 T460 240",
    stroke: "#cdddf0",
    strokeWidth: "2",
    fill: "none"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M40 40 Q140 10 220 60 T400 50 V120 Q300 150 200 120 T20 130 Z",
    fill: "#eef3ea"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "320",
    cy: "90",
    r: "46",
    fill: "#e4ede0"
  }), /*#__PURE__*/React.createElement("g", {
    stroke: "#d8e0d2",
    strokeWidth: "1.5"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M0 170 H412 M0 110 H412 M120 0 V340 M260 0 V340",
    opacity: "0.5"
  }))), /*#__PURE__*/React.createElement("svg", {
    className: "map__route",
    viewBox: "0 0 412 340",
    preserveAspectRatio: "none",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("polyline", {
    points: "78,118 168,96 232,172 300,150 336,236",
    fill: "none",
    stroke: "var(--route-line)",
    strokeWidth: "4",
    strokeLinecap: "round",
    strokeDasharray: "2 11",
    strokeLinejoin: "round"
  })), [{
    n: 1,
    x: 78,
    y: 118
  }, {
    n: 2,
    x: 168,
    y: 96
  }, {
    n: 3,
    x: 232,
    y: 172
  }, {
    n: 4,
    x: 300,
    y: 150
  }, {
    n: 5,
    x: 336,
    y: 236
  }].map(p => /*#__PURE__*/React.createElement("div", {
    key: p.n,
    className: "map__pin",
    style: {
      left: p.x,
      top: p.y
    }
  }, /*#__PURE__*/React.createElement("svg", {
    className: "map__paw",
    viewBox: "0 0 64 64",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("g", {
    fill: "var(--brand)",
    stroke: "#fff",
    strokeWidth: "4.5",
    strokeLinejoin: "round",
    style: {
      paintOrder: "stroke"
    }
  }, /*#__PURE__*/React.createElement("ellipse", {
    cx: "17.5",
    cy: "26",
    rx: "6",
    ry: "8",
    transform: "rotate(-24 17.5 26)"
  }), /*#__PURE__*/React.createElement("ellipse", {
    cx: "27.5",
    cy: "16.5",
    rx: "6",
    ry: "8.5",
    transform: "rotate(-8 27.5 16.5)"
  }), /*#__PURE__*/React.createElement("ellipse", {
    cx: "39",
    cy: "16.5",
    rx: "6",
    ry: "8.5",
    transform: "rotate(8 39 16.5)"
  }), /*#__PURE__*/React.createElement("ellipse", {
    cx: "49",
    cy: "27",
    rx: "6",
    ry: "8",
    transform: "rotate(24 49 27)"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M33 33c8.2 0 15 5.7 15 13.1 0 5.1-3.9 8.2-8.7 8.2-3 0-4.6-1.5-6.3-1.5s-3.3 1.5-6.3 1.5C16.9 54.3 13 51.2 13 46.1 13 38.7 24.8 33 33 33Z"
  }))), /*#__PURE__*/React.createElement("span", {
    className: "map__pin-n"
  }, p.n))), /*#__PURE__*/React.createElement("div", {
    className: "map__pin map__pin--vet",
    style: {
      left: 250,
      top: 110
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "cross"
  })), !compact && /*#__PURE__*/React.createElement("div", {
    className: "map__controls"
  }, /*#__PURE__*/React.createElement(DS.IconButton, {
    icon: "plus",
    variant: "solid",
    label: "\uD655\uB300",
    size: "sm"
  }), /*#__PURE__*/React.createElement(DS.IconButton, {
    icon: "minus",
    variant: "outline",
    label: "\uCD95\uC18C",
    size: "sm"
  }), /*#__PURE__*/React.createElement(DS.IconButton, {
    icon: "locate-fixed",
    variant: "outline",
    label: "\uB0B4 \uC704\uCE58",
    size: "sm"
  })));
}

/* ---------- Bottom tab bar ---------- */
function TabBar({
  active,
  onNav
}) {
  const tabs = [{
    k: "home",
    icon: "house",
    label: "홈"
  }, {
    k: "course",
    icon: "route",
    label: "코스"
  }, {
    k: "saved",
    icon: "bookmark",
    label: "저장"
  }, {
    k: "me",
    icon: "user-round",
    label: "프로필"
  }];
  return /*#__PURE__*/React.createElement("nav", {
    className: "tabbar"
  }, tabs.map(t => /*#__PURE__*/React.createElement("button", {
    key: t.k,
    className: "tabbar__item" + (active === t.k ? " is-active" : ""),
    onClick: () => onNav(t.k)
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": t.icon
  }), /*#__PURE__*/React.createElement("span", null, t.label))));
}

/* ---------- Top app bar ---------- */
function AppBar({
  title,
  onBack,
  action
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "appbar"
  }, onBack ? /*#__PURE__*/React.createElement(DS.IconButton, {
    icon: "chevron-left",
    variant: "plain",
    label: "\uB4A4\uB85C",
    onClick: onBack
  }) : /*#__PURE__*/React.createElement("span", {
    style: {
      width: 44
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "appbar__title"
  }, title), action || /*#__PURE__*/React.createElement("span", {
    style: {
      width: 44
    }
  }));
}

/* ---------- Section header ---------- */
function SectionHead({
  title,
  more
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "sect-head"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "sect-head__t"
  }, title), more ? /*#__PURE__*/React.createElement("button", {
    className: "sect-head__more"
  }, more, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "chevron-right"
  })) : null);
}
Object.assign(window, {
  PhoneFrame,
  StatusBar,
  MapView,
  TabBar,
  AppBar,
  SectionHead,
  relucide,
  DS
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/app.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/screens.jsx
try { (() => {
/* 발자국 app — screens + router. Reads shell pieces from window (app.jsx). */
const {
  useState,
  useEffect
} = React;
const DSx = window.DesignSystem_d6ad93;
const {
  PhoneFrame,
  StatusBar,
  MapView,
  TabBar,
  AppBar,
  SectionHead,
  relucide
} = window;
const {
  Button,
  IconButton,
  Chip,
  Tabs,
  Switch,
  Input,
  Select,
  DogAvatar,
  PlaceCard,
  RiskBadge,
  VerdictPill,
  PolicyBadge
} = DSx;

/* ---------- demo data ---------- */
const CHERRY = {
  name: "체리",
  petSize: "small",
  breed: "시츄",
  brachy: true
};
const PLACES = [{
  id: 1,
  name: "오죽헌 정원 카페",
  category: "카페",
  icon: "coffee",
  time: "오전 10:30",
  distance: "도보 8분",
  badges: ["leash_required", "indoor_ok", "waste_bag"],
  verdict: "conditional",
  condition: "이동장 필요",
  addr: "강릉시 율곡로 3139",
  hours: "매일 10:00–21:00",
  leg: "도보 8분 · 0.6km"
}, {
  id: 2,
  name: "안목해변 솔숲길",
  category: "해변·산책",
  icon: "trees",
  time: "오전 11:20",
  distance: "차로 6분",
  badges: ["leash_required", "outdoor_only"],
  verdict: "allowed",
  condition: null,
  addr: "강릉시 창해로14번길",
  hours: "상시 개방",
  leg: "차로 9분 · 4.2km"
}, {
  id: 3,
  name: "강릉동물메디컬센터",
  category: "동선 주변 동물병원",
  icon: "cross",
  vet: true,
  addr: "강릉시 경강로 2079",
  hours: "09:00–20:00 · 응급 24h",
  leg: "차로 14분 · 9km"
}, {
  id: 4,
  name: "테라로사 커피공장",
  category: "카페",
  icon: "coffee",
  time: "오후 1:40",
  distance: "차로 14분",
  badges: ["small_only", "extra_fee", "leash_required"],
  verdict: "conditional",
  condition: "소형견만",
  addr: "강릉시 구정면 현천길",
  hours: "매일 09:00–21:00",
  leg: "차로 35분 · 22km"
}, {
  id: 5,
  name: "대관령 양떼목장",
  category: "체험",
  icon: "mountain",
  time: "오후 3:00",
  distance: "차로 35분",
  badges: ["outdoor_only", "extra_fee"],
  verdict: "denied",
  condition: "대형견 불가",
  addr: "평창군 대관령마루길",
  hours: "09:00–17:00",
  leg: null
}];

/* ============ Onboarding ============ */
function Onboarding({
  onDone
}) {
  const traits = ["사교적", "수줍음", "활발함", "차분함", "겁많음"];
  const [sel, setSel] = useState(["수줍음"]);
  useEffect(relucide);
  const toggle = t => setSel(s => s.includes(t) ? s.filter(x => x !== t) : [...s, t]);
  return /*#__PURE__*/React.createElement(PhoneFrame, null, /*#__PURE__*/React.createElement("div", {
    className: "screen"
  }, /*#__PURE__*/React.createElement(StatusBar, null), /*#__PURE__*/React.createElement("div", {
    className: "ob"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ob__steps"
  }, /*#__PURE__*/React.createElement("span", {
    className: "is-on"
  }), /*#__PURE__*/React.createElement("span", null), /*#__PURE__*/React.createElement("span", null)), /*#__PURE__*/React.createElement("h1", {
    className: "ob__title"
  }, "\uC6B0\uB9AC \uC560\uB97C \uC54C\uB824\uC8FC\uC138\uC694"), /*#__PURE__*/React.createElement("p", {
    className: "ob__sub"
  }, "\uD55C \uBC88\uB9CC \uB4F1\uB85D\uD558\uBA74, \uCCB4\uB9AC\uC5D0\uAC8C \uB9DE\uB294 \uCF54\uC2A4\uB97C \uC9DC\uB4DC\uB9B4\uAC8C\uC694."), /*#__PURE__*/React.createElement("div", {
    className: "ob__avatar"
  }, /*#__PURE__*/React.createElement(DogAvatar, {
    name: "\uCCB4\uB9AC",
    petSize: "small",
    size: "xl",
    ring: true
  }), /*#__PURE__*/React.createElement("button", {
    className: "ob__upload"
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "camera"
  }), " \uC0AC\uC9C4 \uCD94\uAC00")), /*#__PURE__*/React.createElement("div", {
    className: "ob__form"
  }, /*#__PURE__*/React.createElement(Input, {
    label: "\uC774\uB984",
    defaultValue: "\uCCB4\uB9AC",
    required: true
  }), /*#__PURE__*/React.createElement("div", {
    className: "ob__row"
  }, /*#__PURE__*/React.createElement(Select, {
    label: "\uACAC\uC885",
    defaultValue: "\uC2DC\uCE04",
    options: ["말티즈", "푸들", "시츄", "포메라니안", "웰시코기", "골든리트리버"]
  }), /*#__PURE__*/React.createElement(Input, {
    label: "\uCCB4\uC911",
    type: "number",
    defaultValue: "4.8",
    suffix: "kg"
  })), /*#__PURE__*/React.createElement(Input, {
    label: "\uB098\uC774",
    type: "number",
    defaultValue: "7",
    suffix: "\uC0B4",
    hint: "\uC2DC\uB2C8\uC5B4\uACAC\uC740 \uD3ED\uC5FC\xB7\uD55C\uD30C\uC5D0 \uB354 \uC8FC\uC758\uD574\uC11C \uC548\uB0B4\uD574\uB4DC\uB824\uC694."
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "ob__label"
  }, "\uC131\uD5A5 ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--text-subtle)",
      fontWeight: 500
    }
  }, "(\uC5EC\uB7EC \uAC1C \uC120\uD0DD)")), /*#__PURE__*/React.createElement("div", {
    className: "ob__chips"
  }, traits.map(t => /*#__PURE__*/React.createElement(Chip, {
    key: t,
    selected: sel.includes(t),
    onToggle: () => toggle(t)
  }, t)))))), /*#__PURE__*/React.createElement("div", {
    className: "screen__cta"
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "lg",
    block: true,
    icon: "paw-print",
    onClick: onDone
  }, "\uB4F1\uB85D\uD558\uACE0 \uC2DC\uC791\uD558\uAE30"))));
}

/* ============ Home ============ */
function Home({
  onNav,
  onSearch
}) {
  useEffect(relucide);
  return /*#__PURE__*/React.createElement(PhoneFrame, null, /*#__PURE__*/React.createElement("div", {
    className: "screen"
  }, /*#__PURE__*/React.createElement(StatusBar, null), /*#__PURE__*/React.createElement("div", {
    className: "home__top"
  }, /*#__PURE__*/React.createElement("div", {
    className: "home__greet"
  }, /*#__PURE__*/React.createElement("span", {
    className: "home__hi"
  }, "\uC548\uB155\uD558\uC138\uC694, \uBCF4\uD638\uC790\uB2D8 \uD83D\uDC4B"), /*#__PURE__*/React.createElement("h1", {
    className: "home__q"
  }, "\uCCB4\uB9AC\uB791 \uC5B4\uB514 \uAC00\uBCFC\uAE4C\uC694?")), /*#__PURE__*/React.createElement("div", {
    className: "home__dogs"
  }, /*#__PURE__*/React.createElement(DogAvatar, {
    name: "\uCCB4\uB9AC",
    petSize: "small",
    size: "md",
    ring: true
  }), /*#__PURE__*/React.createElement("button", {
    className: "home__adddog"
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "plus"
  })))), /*#__PURE__*/React.createElement("button", {
    className: "home__search",
    onClick: onSearch
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "sparkles"
  }), /*#__PURE__*/React.createElement("span", null, "\uAC15\uC544\uC9C0\uB791 1\uBC152\uC77C \uAC15\uB989\u2026"), /*#__PURE__*/React.createElement("span", {
    className: "home__search-go"
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "arrow-right"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "home__body"
  }, /*#__PURE__*/React.createElement(RiskBadge, {
    banner: true,
    level: "high",
    title: "\uC624\uB298 \uAC15\uB989, \uC0B0\uCC45 \uC704\uD5D8\uB3C4 \uB192\uC74C",
    description: "31\xB0C \uD3ED\uC5FC \xB7 \uCCB4\uB9AC\uB294 \uB2E8\uB450\uC885\uC774\uB77C \uD638\uD761\uAE30\uAC00 \uCDE8\uC57D\uD574\uC694. \uD55C\uB0AE \uC0B0\uCC45\uC740 \uD53C\uD558\uACE0 \uADF8\uB298\xB7\uBB3C\uC744 \uC790\uC8FC \uCC59\uACA8\uC8FC\uC138\uC694."
  }), /*#__PURE__*/React.createElement("div", {
    className: "home__chips"
  }, /*#__PURE__*/React.createElement(Chip, {
    icon: "accessibility"
  }, "\uBB34\uC7A5\uC560"), /*#__PURE__*/React.createElement(Chip, {
    icon: "coffee",
    selected: true
  }, "\uCE74\uD398"), /*#__PURE__*/React.createElement(Chip, {
    icon: "trees"
  }, "\uACF5\uC6D0\xB7\uD574\uBCC0"), /*#__PURE__*/React.createElement(Chip, {
    icon: "utensils-crossed"
  }, "\uC2DD\uB2F9"), /*#__PURE__*/React.createElement(Chip, {
    icon: "bed"
  }, "\uC219\uC18C")), /*#__PURE__*/React.createElement(SectionHead, {
    title: "\uCCB4\uB9AC \uB9DE\uCDA4 \uCD94\uCC9C \uCF54\uC2A4",
    more: "\uC804\uCCB4"
  }), /*#__PURE__*/React.createElement("div", {
    className: "course-cards"
  }, /*#__PURE__*/React.createElement("button", {
    className: "course-prev",
    onClick: () => onNav("course")
  }, /*#__PURE__*/React.createElement("div", {
    className: "course-prev__img course-prev__img--a"
  }, /*#__PURE__*/React.createElement("span", {
    className: "course-prev__tag"
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "paw-print"
  }), " \uC18C\uD615\uACAC \uCD94\uCC9C")), /*#__PURE__*/React.createElement("div", {
    className: "course-prev__body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "course-prev__t"
  }, "\uAC15\uB989 \uBC14\uB2E4 & \uCE74\uD398 1\uBC15 2\uC77C"), /*#__PURE__*/React.createElement("div", {
    className: "course-prev__meta"
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "map-pin"
  }), " 5\uACF3 \xB7 ", /*#__PURE__*/React.createElement("i", {
    "data-lucide": "route"
  }), " 22km \xB7 \uB3D9\uBB3C\uBCD1\uC6D0 1\uACF3 \uD3EC\uD568"), /*#__PURE__*/React.createElement("div", {
    className: "course-prev__badges"
  }, /*#__PURE__*/React.createElement(PolicyBadge, {
    type: "indoor_ok"
  }), /*#__PURE__*/React.createElement(PolicyBadge, {
    type: "leash_required"
  }), /*#__PURE__*/React.createElement(PolicyBadge, {
    label: "+3",
    tone: "neutral"
  })))), /*#__PURE__*/React.createElement("button", {
    className: "course-prev",
    onClick: () => onNav("course")
  }, /*#__PURE__*/React.createElement("div", {
    className: "course-prev__img course-prev__img--b"
  }, /*#__PURE__*/React.createElement("span", {
    className: "course-prev__tag"
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "accessibility"
  }), " \uBB34\uC7A5\uC560 \uCF54\uC2A4")), /*#__PURE__*/React.createElement("div", {
    className: "course-prev__body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "course-prev__t"
  }, "\uD720\uCCB4\uC5B4\uB3C4 \uD568\uAED8, \uACBD\uD3EC \uB458\uB808 \uCF54\uC2A4"), /*#__PURE__*/React.createElement("div", {
    className: "course-prev__meta"
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "map-pin"
  }), " 4\uACF3 \xB7 ", /*#__PURE__*/React.createElement("i", {
    "data-lucide": "route"
  }), " 9km"))))), /*#__PURE__*/React.createElement(TabBar, {
    active: "home",
    onNav: onNav
  })));
}

/* ============ Course result ============ */
function CourseResult({
  onBack,
  onOpen,
  onNav
}) {
  const [tab, setTab] = useState("map");
  useEffect(relucide);
  return /*#__PURE__*/React.createElement(PhoneFrame, null, /*#__PURE__*/React.createElement("div", {
    className: "screen"
  }, /*#__PURE__*/React.createElement(StatusBar, null), /*#__PURE__*/React.createElement(AppBar, {
    title: "\uAC15\uB989 \uBC14\uB2E4 & \uCE74\uD398",
    onBack: onBack,
    action: /*#__PURE__*/React.createElement(IconButton, {
      icon: "share-2",
      variant: "plain",
      label: "\uACF5\uC720"
    })
  }), /*#__PURE__*/React.createElement("div", {
    className: "course__sub"
  }, /*#__PURE__*/React.createElement("span", {
    className: "course__pill"
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "calendar-days"
  }), " 1\uBC15 2\uC77C"), /*#__PURE__*/React.createElement("span", {
    className: "course__pill"
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "map-pin"
  }), " 5\uACF3"), /*#__PURE__*/React.createElement("span", {
    className: "course__pill"
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "route"
  }), " 22km"), /*#__PURE__*/React.createElement("span", {
    className: "course__pill course__pill--vet"
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "cross"
  }), " \uBCD1\uC6D0 1\uACF3")), /*#__PURE__*/React.createElement("div", {
    className: "course__tabs"
  }, /*#__PURE__*/React.createElement(Tabs, {
    block: true,
    value: tab,
    onChange: setTab,
    items: [{
      value: "map",
      label: "지도",
      icon: "map"
    }, {
      value: "list",
      label: "리스트",
      icon: "list"
    }]
  })), /*#__PURE__*/React.createElement("div", {
    className: "course__body"
  }, tab === "map" && /*#__PURE__*/React.createElement(MapView, {
    stops: PLACES,
    height: 232
  }), /*#__PURE__*/React.createElement("div", {
    className: "course__list"
  }, PLACES.filter(p => !p.vet).map((p, i) => /*#__PURE__*/React.createElement(PlaceCard, {
    key: p.id,
    name: p.name,
    category: p.category,
    categoryIcon: p.icon,
    index: i + 1,
    distance: p.distance,
    badges: p.badges,
    verdict: p.verdict,
    petName: "\uCCB4\uB9AC",
    condition: p.condition,
    onClick: () => onOpen(p.id)
  })))), /*#__PURE__*/React.createElement("div", {
    className: "screen__cta screen__cta--row"
  }, /*#__PURE__*/React.createElement(IconButton, {
    icon: "bookmark",
    variant: "outline",
    label: "\uC800\uC7A5",
    size: "lg"
  }), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "lg",
    block: true,
    icon: "navigation"
  }, "\uC774 \uCF54\uC2A4\uB85C \uAC08\uB798\uC694"))));
}

/* ============ Place detail ============ */
function PlaceDetail({
  id,
  onBack
}) {
  const p = PLACES.find(x => x.id === id) || PLACES[0];
  useEffect(relucide);
  const vTitle = {
    allowed: "체리, 입장 가능해요",
    conditional: "체리, 조건부 가능해요",
    denied: "체리는 입장이 어려워요"
  }[p.verdict];
  return /*#__PURE__*/React.createElement(PhoneFrame, null, /*#__PURE__*/React.createElement("div", {
    className: "screen"
  }, /*#__PURE__*/React.createElement("div", {
    className: "detail__hero detail__hero--" + (p.verdict || "allowed")
  }, /*#__PURE__*/React.createElement(StatusBar, {
    dark: true
  }), /*#__PURE__*/React.createElement("div", {
    className: "detail__hero-bar"
  }, /*#__PURE__*/React.createElement(IconButton, {
    icon: "chevron-left",
    variant: "soft",
    label: "\uB4A4\uB85C",
    onClick: onBack
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(IconButton, {
    icon: "share-2",
    variant: "soft",
    label: "\uACF5\uC720"
  }), /*#__PURE__*/React.createElement(IconButton, {
    icon: "heart",
    variant: "soft",
    label: "\uC800\uC7A5"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "detail__hero-ico"
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": p.icon
  }))), /*#__PURE__*/React.createElement("div", {
    className: "detail__body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "detail__cat"
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": p.icon
  }), " ", p.category), /*#__PURE__*/React.createElement("h1", {
    className: "detail__name"
  }, p.name), /*#__PURE__*/React.createElement("div", {
    className: "detail__verdict detail__verdict--" + p.verdict
  }, /*#__PURE__*/React.createElement(VerdictPill, {
    verdict: p.verdict,
    solid: true
  }), /*#__PURE__*/React.createElement("div", {
    className: "detail__verdict-txt"
  }, /*#__PURE__*/React.createElement("strong", null, vTitle), p.condition ? /*#__PURE__*/React.createElement("span", null, p.condition, " \xB7 4.8kg \uC18C\uD615\uACAC \uAE30\uC900 \uD310\uC815") : /*#__PURE__*/React.createElement("span", null, "4.8kg \uC18C\uD615\uACAC \uAE30\uC900 \uD310\uC815"))), /*#__PURE__*/React.createElement("div", {
    className: "detail__sect"
  }, /*#__PURE__*/React.createElement("div", {
    className: "detail__sect-t"
  }, "\uC2DC\uC124 \uADDC\uC815"), /*#__PURE__*/React.createElement("div", {
    className: "detail__badges"
  }, (p.badges || []).map(b => /*#__PURE__*/React.createElement(PolicyBadge, {
    key: b,
    type: b,
    size: "md"
  })))), /*#__PURE__*/React.createElement("div", {
    className: "detail__info"
  }, /*#__PURE__*/React.createElement("div", {
    className: "detail__info-row"
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "clock"
  }), /*#__PURE__*/React.createElement("span", null, p.hours)), /*#__PURE__*/React.createElement("div", {
    className: "detail__info-row"
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "map-pin"
  }), /*#__PURE__*/React.createElement("span", null, p.addr)), /*#__PURE__*/React.createElement("div", {
    className: "detail__info-row"
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "cross"
  }), /*#__PURE__*/React.createElement("span", null, "\uAC00\uC7A5 \uAC00\uAE4C\uC6B4 \uB3D9\uBB3C\uBCD1\uC6D0 ", /*#__PURE__*/React.createElement("strong", null, "\uAC15\uB989\uB3D9\uBB3C\uBA54\uB514\uCEEC\uC13C\uD130"), " \xB7 \uCC28\uB85C 9\uBD84"))), /*#__PURE__*/React.createElement(MapView, {
    compact: true,
    height: 150
  })), /*#__PURE__*/React.createElement("div", {
    className: "screen__cta"
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "lg",
    block: true,
    icon: "plus"
  }, "\uB3D9\uC120\uC5D0 \uCD94\uAC00"))));
}

/* ============ Router ============ */
function App() {
  const [screen, setScreen] = useState("onboarding");
  const [placeId, setPlaceId] = useState(null);
  useEffect(() => {
    relucide();
  }, [screen, placeId]);
  const nav = k => {
    if (k === "course") setScreen("course");else setScreen("home");
  };
  if (screen === "onboarding") return /*#__PURE__*/React.createElement(Onboarding, {
    onDone: () => setScreen("home")
  });
  if (screen === "home") return /*#__PURE__*/React.createElement(Home, {
    onNav: nav,
    onSearch: () => setScreen("course")
  });
  if (screen === "course") return /*#__PURE__*/React.createElement(CourseResult, {
    onBack: () => setScreen("home"),
    onOpen: id => {
      setPlaceId(id);
      setScreen("detail");
    },
    onNav: nav
  });
  if (screen === "detail") return /*#__PURE__*/React.createElement(PlaceDetail, {
    id: placeId,
    onBack: () => setScreen("course")
  });
  return null;
}
ReactDOM.createRoot(document.getElementById("root")).render(/*#__PURE__*/React.createElement(App, null));
relucide();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/screens.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Chip = __ds_scope.Chip;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Switch = __ds_scope.Switch;

__ds_ns.Tabs = __ds_scope.Tabs;

__ds_ns.DogAvatar = __ds_scope.DogAvatar;

__ds_ns.PlaceCard = __ds_scope.PlaceCard;

__ds_ns.RouteStop = __ds_scope.RouteStop;

__ds_ns.POLICY_BADGES = __ds_scope.POLICY_BADGES;

__ds_ns.PolicyBadge = __ds_scope.PolicyBadge;

__ds_ns.RiskBadge = __ds_scope.RiskBadge;

__ds_ns.VerdictPill = __ds_scope.VerdictPill;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Select = __ds_scope.Select;

})();
