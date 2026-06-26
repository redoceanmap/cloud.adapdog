import type { CSSProperties } from "react";

/** 인라인 CSS 문자열 → React style 객체 (네이버 지도 마커 HTML용). */
export function css(str: string | null | undefined): CSSProperties {
  const out: Record<string, string> = {};
  if (!str) return out as CSSProperties;

  const decls: string[] = [];
  let depth = 0;
  let buf = "";
  for (const ch of str) {
    if (ch === "(") depth++;
    else if (ch === ")") depth = Math.max(0, depth - 1);
    if (ch === ";" && depth === 0) {
      decls.push(buf);
      buf = "";
    } else {
      buf += ch;
    }
  }
  if (buf) decls.push(buf);

  for (const decl of decls) {
    const idx = decl.indexOf(":");
    if (idx < 0) continue;
    const rawKey = decl.slice(0, idx).trim();
    const value = decl.slice(idx + 1).trim();
    if (!rawKey || !value) continue;
    const key = rawKey.startsWith("--")
      ? rawKey
      : rawKey.replace(/-([a-z])/g, (_m, c: string) => c.toUpperCase());
    out[key] = value;
  }
  return out as CSSProperties;
}
