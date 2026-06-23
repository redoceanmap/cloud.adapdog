import type { CSSProperties } from 'react';

/**
 * 인라인 CSS 문자열("a:b; c:d") → React style 객체.
 * 통합 프로토타입의 인라인 스타일을 그대로 보존하기 위한 런타임 변환 헬퍼.
 *
 * 선언 구분(`;`)은 괄호 밖에서만 적용한다 — `url(data:image/jpeg;base64,...)`
 * 처럼 값 안에 `;`/`:` 가 들어가는 data URI를 보호하기 위함.
 */
export function css(str: string | null | undefined): CSSProperties {
  const out: Record<string, string> = {};
  if (!str) return out as CSSProperties;

  // 1) 괄호 깊이를 추적하며 선언 단위로 분리
  const decls: string[] = [];
  let depth = 0;
  let buf = '';
  for (const ch of str) {
    if (ch === '(') depth++;
    else if (ch === ')') depth = Math.max(0, depth - 1);
    if (ch === ';' && depth === 0) {
      decls.push(buf);
      buf = '';
    } else {
      buf += ch;
    }
  }
  if (buf) decls.push(buf);

  // 2) 각 선언을 첫 콜론 기준으로 property:value 분리 (값 안 콜론은 보존)
  for (const decl of decls) {
    const idx = decl.indexOf(':');
    if (idx < 0) continue;
    const rawKey = decl.slice(0, idx).trim();
    const value = decl.slice(idx + 1).trim();
    if (!rawKey || !value) continue;
    const key = rawKey.startsWith('--')
      ? rawKey
      : rawKey.replace(/-([a-z])/g, (_m, c: string) => c.toUpperCase());
    out[key] = value;
  }
  return out as CSSProperties;
}
