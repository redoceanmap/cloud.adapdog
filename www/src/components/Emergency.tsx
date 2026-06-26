// 응급 케어 모달 — 시안 디자인 유지 + 실데이터(safety-alert: 실 날씨 위험도 + 행안부 동물병원).
import { useEffect, useState } from 'react';
import { css } from '../lib/css';
import { checkSafety, getNearbyHospitals } from '../api/endpoints';
import type { SafetyAlertResult, AnimalHospital } from '../api/types';

// 데모 현재 위치 — 전주 한옥마을(실제 GPS 대체). 거리순 정렬 기준점.
const HERE = { lat: 35.8149, lng: 127.153 };
const telHref = (phone: string) => 'tel:' + (phone || '').replace(/[^0-9]/g, '');
const mapHref = (h: AnimalHospital) => `https://map.naver.com/v5/search/${encodeURIComponent(h.name)}`;

const RISK = {
  high: { c: '#E0533F', title: '지금 즉시 동물병원 방문 권장', icon: 'e911_emergency' },
  moderate: { c: '#D98A00', title: '야외 활동 주의가 필요해요', icon: 'warning' },
  low: { c: '#22A565', title: '지금은 큰 위험 신호가 없어요', icon: 'verified' },
} as const;

export function Emergency({ step, setStep, onClose }: { step: 'entry' | 'result' | 'list'; setStep: (s: 'entry' | 'result' | 'list') => void; onClose: () => void }) {
  const [safety, setSafety] = useState<SafetyAlertResult | null>(null);
  const [hospitals, setHospitals] = useState<AnimalHospital[] | null>(null);

  useEffect(() => {
    checkSafety({ region: '전주', pet_breed: '골든 리트리버', pet_size: 'large', latitude: HERE.lat, longitude: HERE.lng })
      .then(setSafety)
      .catch(() => {});
    getNearbyHospitals({ region: '전주', latitude: HERE.lat, longitude: HERE.lng, open_only: true, limit: 5 })
      .then((r) => setHospitals(r.hospitals))
      .catch(() => setHospitals([]));
  }, []);

  const r = safety ? RISK[(safety.risk_level as keyof typeof RISK)] ?? RISK.moderate : null;

  return (
    <div style={css('position:absolute; inset:0; z-index:60; background:rgba(10,12,20,.5); display:flex; align-items:center; justify-content:center; padding:20px;')}>
      <div style={{ ...css('width:min(440px,94%); background:var(--panel); border-radius:22px; overflow:hidden; box-shadow:0 30px 70px rgba(0,0,0,.35);'), animation: 'fadeup .25s ease' }}>
        <div style={css('display:flex; align-items:center; gap:10px; padding:16px 18px; border-bottom:1px solid var(--border);')}>
          <span className="msf" style={css('font-size:22px; color:#FF6B5C;')}>emergency</span>
          <span style={css('font:800 16px Pretendard;')}>응급 케어</span>
          <div onClick={onClose} style={css('margin-left:auto; width:32px; height:32px; border-radius:9px; background:var(--chip); display:flex; align-items:center; justify-content:center; cursor:pointer; color:var(--muted);')}>
            <span className="msr" style={css('font-size:19px;')}>close</span>
          </div>
        </div>
        <div style={css('padding:20px;')}>
          {step === 'entry' && (
            <>
              <div style={css('text-align:center; padding:6px 0 4px;')}>
                <div style={css('width:84px; height:84px; border-radius:50%; background:rgba(255,107,92,.12); display:flex; align-items:center; justify-content:center; margin:0 auto;')}>
                  <span className="msf" style={css('font-size:42px; color:#FF6B5C;')}>stethoscope</span>
                </div>
                <div style={css('font:800 19px Pretendard; margin-top:16px;')}>체리 상태가 걱정되나요?</div>
                <div style={css('font:500 13px Pretendard; color:var(--muted); margin-top:8px; line-height:1.55;')}>증상을 첨부하면 AI가 참고용으로 살펴보고<br />가까운 동물병원을 안내해요.</div>
                {safety && (
                  <div style={css(`display:inline-flex; align-items:center; gap:6px; margin-top:14px; font:700 12px Pretendard; color:${r!.c}; background:var(--panel-2); border:1px solid var(--border); padding:7px 13px; border-radius:999px;`)}>
                    <span className="msf" style={css('font-size:14px;')}>thermostat</span>
                    전주 지금 {safety.temperature_c}°C · {safety.condition}
                  </div>
                )}
              </div>
              <div onClick={() => setStep('result')} style={css('margin-top:20px; background:#FF6B5C; color:#fff; font:700 14.5px Pretendard; text-align:center; padding:14px; border-radius:14px; cursor:pointer;')}>증상 살펴보기</div>
              <div onClick={() => setStep('list')} style={css('margin-top:10px; background:var(--chip); color:var(--text); font:700 14.5px Pretendard; text-align:center; padding:14px; border-radius:14px; cursor:pointer;')}>바로 병원 찾기</div>
            </>
          )}
          {step === 'result' && (
            <>
              {!safety || !r ? (
                <div style={css('color:var(--muted); font:500 13px Pretendard; padding:8px 0;')}>전주 안전 상태 확인 중…</div>
              ) : (
                <>
                  <div style={css(`background:${r.c}; border-radius:14px; padding:14px 15px; display:flex; align-items:center; gap:10px;`)}>
                    <span className="msf" style={css('font-size:24px; color:#fff;')}>{r.icon}</span>
                    <div>
                      <div style={css('font:800 14px Pretendard; color:#fff;')}>{r.title}</div>
                      <div style={css('font:500 11.5px Pretendard; color:rgba(255,255,255,.9); margin-top:2px;')}>전주 {safety.temperature_c}°C · {safety.condition} · 위험도 {safety.risk_level}</div>
                    </div>
                  </div>
                  {safety.reasons.length > 0 && (
                    <div style={css('margin-top:11px; display:flex; flex-direction:column; gap:6px;')}>
                      {safety.reasons.map((reason, i) => (
                        <div key={i} style={css('display:flex; gap:7px; align-items:flex-start; font:500 12.5px Pretendard; color:var(--text); line-height:1.5;')}>
                          <span className="msr" style={css(`font-size:16px; color:${r.c}; margin-top:1px;`)}>chevron_right</span>{reason}
                        </div>
                      ))}
                    </div>
                  )}
                  <div style={css('margin-top:11px; background:rgba(255,107,92,.1); border:1px solid rgba(255,107,92,.3); border-radius:12px; padding:12px 14px; font:500 12px Pretendard; color:#A24433; line-height:1.5;')}>AI 참고용 정보이며 진단이 아닙니다. <b>반드시 수의사 진료</b>를 받으세요.</div>
                </>
              )}
              <div onClick={() => setStep('list')} style={css('margin-top:16px; background:#FF6B5C; color:#fff; font:700 14.5px Pretendard; text-align:center; padding:14px; border-radius:14px; cursor:pointer;')}>가까운 병원 보기</div>
            </>
          )}
          {step === 'list' && (
            <>
              {hospitals === null ? (
                <div style={css('color:var(--muted); font:500 13px Pretendard; padding:8px 0;')}>전주 한옥마을 인근 동물병원 찾는 중…</div>
              ) : hospitals.length === 0 ? (
                <div style={css('color:var(--muted); font:500 13px Pretendard; padding:8px 0;')}>인근 영업 중 동물병원을 찾지 못했어요.</div>
              ) : (
                <div style={css('display:flex; flex-direction:column; gap:10px;')}>
                  {hospitals.map((h, i) => (
                    <div key={i} style={css(`background:var(--panel-2); border:${i === 0 ? '2px solid #FF6B5C' : '1px solid var(--border)'}; border-radius:14px; padding:13px 14px;`)}>
                      <div style={css('display:flex; align-items:center; gap:8px;')}>
                        <span style={css(`font:700 11px Pretendard; color:#fff; background:${i === 0 ? '#E0533F' : 'var(--faint)'}; width:20px; height:20px; border-radius:50%; display:inline-flex; align-items:center; justify-content:center; flex:none;`)}>{i + 1}</span>
                        <div style={css('font:700 14px Pretendard; min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;')}>{h.name}</div>
                        {h.is_24h && <span style={css('font:700 9.5px Pretendard; color:#fff; background:#E0533F; padding:3px 7px; border-radius:999px; flex:none;')}>24시</span>}
                      </div>
                      <div style={css('display:flex; align-items:center; gap:9px; margin-top:8px;')}>
                        {h.distance_km != null && <span style={css('font:600 11.5px Pretendard; color:var(--text);')}>{h.distance_km < 1 ? `${Math.round(h.distance_km * 1000)}m` : `${h.distance_km}km`}</span>}
                        <span style={css('display:inline-flex; align-items:center; gap:3px; font:600 11px Pretendard; color:#22A565;')}><span style={css('width:6px; height:6px; border-radius:50%; background:#22A565;')} />영업 중</span>
                        {h.phone && <a href={telHref(h.phone)} style={css('margin-left:auto; display:inline-flex; align-items:center; gap:3px; font:700 11.5px Pretendard; color:var(--accent); text-decoration:none;')}><span className="msf" style={css('font-size:14px;')}>call</span>전화</a>}
                        <a href={mapHref(h)} target="_blank" rel="noreferrer" style={css(`${h.phone ? '' : 'margin-left:auto;'} display:inline-flex; align-items:center; gap:3px; font:700 11.5px Pretendard; color:var(--accent); text-decoration:none;`)}><span className="msf" style={css('font-size:14px;')}>directions</span>길 안내</a>
                      </div>
                      {h.road_address && <div style={css('font:500 11px Pretendard; color:var(--muted); margin-top:6px;')}>{h.road_address}</div>}
                    </div>
                  ))}
                </div>
              )}
              <div style={css('font:400 10.5px Pretendard; color:var(--faint); margin-top:12px;')}>데이터: 행정안전부 전국 동물병원 표준데이터 · 현재 위치(전주 한옥마을) 거리순</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
