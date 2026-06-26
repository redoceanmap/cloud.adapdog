// 둘러보기 — 하이브리드. 상단 카테고리 칩 + 하단 실 공공데이터 카드 그리드(시안 카드 디자인 유지).
// 실데이터: festival · walking-trail · pet-place/search.
import { useEffect, useMemo, useState } from 'react';
import { css } from '../lib/css';
import { getFestivals, getTrails, searchPlaces } from '../api/endpoints';
import type { Festival, WalkingTrail, PetPlace } from '../api/types';

const GRADS = [
  'linear-gradient(135deg,#A9C7E8,#7FA8D8)', 'linear-gradient(135deg,#E7D2A6,#D2B16E)',
  'linear-gradient(135deg,#CDE6C2,#94C39C)', 'linear-gradient(135deg,#F6D9A6,#E7B776)',
  'linear-gradient(135deg,#C9B6E4,#A98FD0)', 'linear-gradient(135deg,#BFD3F0,#8FAEE0)',
  'linear-gradient(135deg,#F4C6BE,#E89B8E)',
];
const CAT_ICON: Record<string, string> = { 박물관: 'museum', 미술관: 'palette', 문예회관: 'theater_comedy', 여행지: 'landscape', 식당: 'restaurant', 카페: 'local_cafe', 숙박: 'hotel', 축제: 'festival', 둘레길: 'forest' };
const CHIPS = ['전체', '문화시설', '관광', '맛집', '둘레길', '숙박', '축제'] as const;
type Chip = (typeof CHIPS)[number];

interface Card {
  group: Chip;
  name: string;
  sub: string;
  tag: string;
  icon: string;
  grad: string;
  source: string;
  pet?: boolean;
  addable?: boolean; // 좌표가 있어 코스에 직접 담을 수 있는 실 시설
  cat?: string;
  lat?: number;
  lng?: number;
}

export interface ExploreAddStop { name: string; category: string; latitude: number; longitude: number }

export function Explore({ onText, hasCourse, courseNames, onAdd, onRemove }: {
  onText: (t: string) => void;
  hasCourse: boolean;
  courseNames: string[];
  onAdd: (p: ExploreAddStop) => void;
  onRemove: (name: string) => void;
}) {
  const [chip, setChip] = useState<Chip>('전체');
  const [festivals, setFestivals] = useState<Festival[] | null>(null);
  const [trails, setTrails] = useState<WalkingTrail[] | null>(null);
  const [places, setPlaces] = useState<PetPlace[] | null>(null);

  useEffect(() => {
    getFestivals('전주').then(setFestivals).catch(() => setFestivals([]));
    getTrails('전주').then(setTrails).catch(() => setTrails([]));
    searchPlaces('전주').then(setPlaces).catch(() => setPlaces([]));
  }, []);

  const loading = !festivals || !trails || !places;

  const cards = useMemo<Card[]>(() => {
    const out: Card[] = [];
    (festivals ?? []).forEach((f, i) => out.push({ group: '축제', name: f.name, sub: `${f.start_date} ~ ${f.end_date}${f.pet_allowed ? ' · 동반 가능' : ''}`, tag: '축제', icon: 'festival', grad: GRADS[i % GRADS.length], source: f.source, pet: f.pet_allowed }));
    (trails ?? []).slice(0, 8).forEach((t, i) => out.push({ group: '둘레길', name: t.name, sub: `${t.distance_km}km · ${t.difficulty} · ${t.duration}`, tag: '둘레길', icon: 'forest', grad: GRADS[(i + 2) % GRADS.length], source: '한국관광공사 두루누비' }));
    const pick = (cats: string[], group: Chip, n: number) =>
      (places ?? []).filter((p) => cats.some((c) => p.category.includes(c))).slice(0, n)
        .forEach((p, i) => out.push({ group, name: p.name, sub: `${p.category} · 펫 동반`, tag: p.category, icon: CAT_ICON[p.category] ?? 'pets', grad: GRADS[(i + 4) % GRADS.length], source: '한국문화정보원 펫동반 문화시설', pet: true, addable: true, cat: p.category, lat: p.latitude, lng: p.longitude }));
    pick(['박물관', '미술관', '문예회관'], '문화시설', 9);
    pick(['여행지'], '관광', 9);          // 펫 동반 관광 명소
    pick(['식당', '카페'], '맛집', 9);     // 펫 동반 식당 + 카페
    pick(['숙박', '펜션'], '숙박', 9);
    return out;
  }, [festivals, trails, places]);

  const shown = chip === '전체' ? cards : cards.filter((c) => c.group === chip);

  return (
    <div className="sc" style={css('flex:1; min-width:0; overflow-y:auto; padding:26px 30px 130px;')}>
      <div style={css('max-width:1040px; margin:0 auto;')}>
        <div style={css('font:800 24px Pretendard; letter-spacing:-0.02em;')}>둘러보기</div>
        <div style={css('font:500 14px Pretendard; color:var(--muted); margin-top:6px;')}>플래너가 추천에 쓰는 전주 공공 문화데이터를 미리 구경해요. 칩으로 종류를 골라보세요.</div>

        <div className="sc" style={css('display:flex; gap:8px; margin-top:18px; overflow-x:auto; padding-bottom:2px;')}>
          {CHIPS.map((ch) => {
            const on = chip === ch;
            return (
              <div key={ch} onClick={() => setChip(ch)} style={css(`flex:none; font:700 13px Pretendard; padding:9px 16px; border-radius:999px; cursor:pointer; white-space:nowrap; background:${on ? 'var(--accent)' : 'var(--panel-2)'}; color:${on ? '#fff' : 'var(--muted)'}; border:1px solid ${on ? 'var(--accent)' : 'var(--border)'};`)}>{ch}</div>
            );
          })}
        </div>

        {loading ? (
          <div style={css('padding:50px 0; text-align:center; font:600 14px Pretendard; color:var(--muted);')}>전주 공공데이터 불러오는 중…</div>
        ) : (
          <div style={css('display:grid; grid-template-columns:repeat(auto-fill,minmax(232px,1fr)); gap:16px; margin-top:18px;')}>
            {shown.map((e, i) => {
              const editable = hasCourse && e.addable && e.lat != null && e.lng != null;
              const inCourse = editable && courseNames.includes(e.name);
              const nudge = () => onText(e.group === '축제' ? '축제 넣어줘' : e.group === '둘레길' ? '산책 추가' : e.group === '맛집' ? '맛집 추가' : e.group === '관광' ? '한옥마을 추가' : e.group === '숙박' ? '1박' : '박물관 추가');
              return (
              <div key={e.name + i} onClick={editable ? undefined : nudge} style={css(`background:var(--panel); border:1px solid var(--border); border-radius:18px; overflow:hidden; box-shadow:var(--shadow); ${editable ? '' : 'cursor:pointer;'}`)}>
                <div style={css(`height:128px; background:${e.grad}; position:relative;`)}>
                  <span style={css('position:absolute; top:11px; left:12px; font:600 10.5px Pretendard; color:#fff; background:rgba(0,0,0,.28); padding:5px 10px; border-radius:999px;')}>{e.tag}</span>
                  {e.pet && <span style={css('position:absolute; top:11px; right:12px; font:700 9.5px Pretendard; color:#1B8A55; background:rgba(255,255,255,.92); padding:4px 9px; border-radius:999px;')}>동반 OK</span>}
                  <span className="msf" style={css('position:absolute; right:12px; bottom:10px; font-size:26px; color:rgba(255,255,255,.7);')}>{e.icon}</span>
                </div>
                <div style={css('padding:14px 15px;')}>
                  <div style={css('font:700 15px Pretendard; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;')}>{e.name}</div>
                  <div style={css('font:500 12px Pretendard; color:var(--muted); margin-top:3px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;')}>{e.sub}</div>
                  <div style={css('font:400 10px Pretendard; color:var(--faint); margin-top:9px;')}>출처: {e.source}</div>
                  {editable && (
                    inCourse ? (
                      <div onClick={(ev) => { ev.stopPropagation(); onRemove(e.name); }} style={css('margin-top:11px; display:flex; align-items:center; justify-content:center; gap:5px; font:700 12.5px Pretendard; color:#D23B34; background:rgba(210,59,52,.1); padding:9px; border-radius:11px; cursor:pointer;')}>
                        <span className="msr" style={css('font-size:16px;')}>remove_circle_outline</span>코스에서 제외
                      </div>
                    ) : (
                      <div onClick={(ev) => { ev.stopPropagation(); onAdd({ name: e.name, category: e.cat || e.tag, latitude: e.lat!, longitude: e.lng! }); }} style={css('margin-top:11px; display:flex; align-items:center; justify-content:center; gap:5px; font:700 12.5px Pretendard; color:#fff; background:var(--accent); padding:9px; border-radius:11px; cursor:pointer;')}>
                        <span className="msr" style={css('font-size:16px;')}>add_location_alt</span>이 경로 추가하기
                      </div>
                    )
                  )}
                </div>
              </div>
              );
            })}
            {shown.length === 0 && <div style={css('grid-column:1/-1; padding:30px 0; text-align:center; font:600 13px Pretendard; color:var(--muted);')}>이 종류의 데이터가 없어요.</div>}
          </div>
        )}
        <div style={css('font:400 11px Pretendard; color:var(--faint); margin-top:20px;')}>데이터: 한국관광공사 반려동물 동반여행 · 한국문화정보원 펫동반 문화시설 · 한국관광공사 두루누비 · 지역 문화행사</div>
      </div>
    </div>
  );
}
