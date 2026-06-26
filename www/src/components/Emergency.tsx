// 응급 케어 모달 — 시안 디자인 유지 + 실데이터(safety-alert: 실 날씨 위험도 + 행안부 동물병원)
// + 증상 대화형 AI 안내(symptom-check/triage, 참고용·진단 아님).
import { useEffect, useRef, useState } from 'react';
import { css } from '../lib/css';
import { checkSafety, getNearbyHospitals, symptomTriage } from '../api/endpoints';
import type { SafetyAlertResult, AnimalHospital, SymptomTriageResult } from '../api/types';

// 데모 현재 위치 — 전주 한옥마을(실제 GPS 대체). 거리순 정렬 기준점.
const HERE = { lat: 35.8149, lng: 127.153 };
const telHref = (phone: string) => 'tel:' + (phone || '').replace(/[^0-9]/g, '');
const mapHref = (h: AnimalHospital) => `https://map.naver.com/v5/search/${encodeURIComponent(h.name)}`;

const RISK = {
  high: { c: '#E0533F', title: '지금 즉시 동물병원 방문 권장', icon: 'e911_emergency' },
  moderate: { c: '#D98A00', title: '야외 활동 주의가 필요해요', icon: 'warning' },
  low: { c: '#22A565', title: '지금은 큰 위험 신호가 없어요', icon: 'verified' },
} as const;

// 증상 대화 긴급도 → 색/문구.
const URGENCY = {
  high: { c: '#E0533F', label: '긴급 — 바로 병원' },
  medium: { c: '#D98A00', label: '주의' },
  low: { c: '#22A565', label: '경과 관찰' },
} as const;

type EmgStep = 'entry' | 'chat' | 'result' | 'list';
type ChatMsg = { role: 'user' | 'ai'; content: string; urgency?: 'low' | 'medium' | 'high'; conditions?: string[] };

export function Emergency({ step, setStep, onClose }: { step: EmgStep; setStep: (s: EmgStep) => void; onClose: () => void }) {
  const [safety, setSafety] = useState<SafetyAlertResult | null>(null);
  const [hospitals, setHospitals] = useState<AnimalHospital[] | null>(null);

  // 증상 대화 상태.
  const [chat, setChat] = useState<ChatMsg[]>([
    { role: 'ai', content: '어디가 걱정되시나요? 체리의 증상을 편하게 말씀해 주세요. 증상을 듣고 짐작되는 원인과 지금 할 수 있는 주의사항을 함께 살펴볼게요. (참고용이며 진단이 아니에요)' },
  ]);
  const [draft, setDraft] = useState('');
  const [thinking, setThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' }); }, [chat, thinking]);

  const sendSymptom = async () => {
    const text = draft.trim();
    if (!text || thinking) return;
    const next: ChatMsg[] = [...chat, { role: 'user', content: text }];
    setChat(next);
    setDraft('');
    setThinking(true);
    try {
      const wire = next.map((m) => ({ role: m.role, content: m.content }));
      const r: SymptomTriageResult = await symptomTriage(wire, '골든 리트리버', 'large');
      setChat((c) => [...c, { role: 'ai', content: r.reply, urgency: r.urgency, conditions: r.possible_conditions }]);
    } catch {
      setChat((c) => [...c, { role: 'ai', content: '안내를 불러오지 못했어요. 증상이 급하면 바로 가까운 동물병원에 연락해 주세요.', urgency: 'high' }]);
    } finally {
      setThinking(false);
    }
  };

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
              <div onClick={() => setStep('chat')} style={css('margin-top:20px; background:#FF6B5C; color:#fff; font:700 14.5px Pretendard; text-align:center; padding:14px; border-radius:14px; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:7px;')}>
                <span className="msf" style={css('font-size:18px;')}>chat</span>증상 AI에게 물어보기
              </div>
              <div onClick={() => setStep('result')} style={css('margin-top:10px; background:var(--chip); color:var(--text); font:700 14.5px Pretendard; text-align:center; padding:14px; border-radius:14px; cursor:pointer;')}>오늘 안전·날씨 보기</div>
              <div onClick={() => setStep('list')} style={css('margin-top:10px; background:var(--chip); color:var(--text); font:700 14.5px Pretendard; text-align:center; padding:14px; border-radius:14px; cursor:pointer;')}>바로 병원 찾기</div>
            </>
          )}
          {step === 'chat' && (
            <>
              <div ref={scrollRef} className="sc" style={css('max-height:46vh; min-height:230px; overflow-y:auto; display:flex; flex-direction:column; gap:11px; padding:2px;')}>
                {chat.map((m, i) =>
                  m.role === 'user' ? (
                    <div key={i} style={css('align-self:flex-end; max-width:85%; background:var(--accent); color:var(--user-text); font:500 13px Pretendard; line-height:1.55; padding:10px 13px; border-radius:14px 14px 4px 14px;')}>{m.content}</div>
                  ) : (
                    <div key={i} style={css('align-self:flex-start; max-width:90%; display:flex; gap:8px; align-items:flex-start;')}>
                      <div style={css('width:24px; height:24px; border-radius:7px; background:rgba(255,107,92,.14); flex:none; display:flex; align-items:center; justify-content:center; margin-top:1px;')}>
                        <span className="msf" style={css('font-size:14px; color:#FF6B5C;')}>stethoscope</span>
                      </div>
                      <div style={css('min-width:0;')}>
                        {m.urgency && (
                          <span style={css(`display:inline-flex; align-items:center; gap:4px; font:700 10px Pretendard; color:#fff; background:${URGENCY[m.urgency].c}; padding:3px 8px; border-radius:999px; margin-bottom:6px;`)}>
                            <span className="msf" style={css('font-size:12px;')}>{m.urgency === 'high' ? 'e911_emergency' : m.urgency === 'medium' ? 'warning' : 'verified'}</span>{URGENCY[m.urgency].label}
                          </span>
                        )}
                        <div style={css('font:500 13px Pretendard; line-height:1.6; color:var(--text);')}>{m.content}</div>
                        {m.conditions && m.conditions.length > 0 && (
                          <div style={css('display:flex; gap:5px; flex-wrap:wrap; margin-top:7px;')}>
                            {m.conditions.map((cnd) => (
                              <span key={cnd} style={css('font:600 10.5px Pretendard; color:var(--muted); background:var(--chip); padding:4px 9px; border-radius:999px;')}>{cnd}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ),
                )}
                {thinking && (
                  <div style={css('align-self:flex-start; display:flex; gap:6px; align-items:center; color:var(--muted); font:600 12px Pretendard; padding-left:32px;')}>
                    <span className="msf" style={css('font-size:14px; color:#FF6B5C;')}>auto_awesome</span>증상을 살펴보는 중…
                  </div>
                )}
              </div>
              <div style={css('margin-top:10px; display:flex; align-items:center; gap:8px; background:var(--panel-2); border:1px solid var(--border); border-radius:14px; padding:6px 6px 6px 14px;')}>
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') sendSymptom(); }}
                  placeholder="예) 아침부터 헥헥거리고 침을 흘려요"
                  style={css('flex:1; min-width:0; background:transparent; border:none; outline:none; font:500 13px Pretendard; color:var(--text);')}
                />
                <div onClick={sendSymptom} style={css(`width:34px; height:34px; border-radius:10px; background:${draft.trim() && !thinking ? '#FF6B5C' : 'var(--chip)'}; color:#fff; display:flex; align-items:center; justify-content:center; cursor:pointer; flex:none;`)}>
                  <span className="msf" style={css('font-size:18px;')}>arrow_upward</span>
                </div>
              </div>
              <div style={css('margin-top:9px; background:rgba(255,107,92,.1); border:1px solid rgba(255,107,92,.3); border-radius:11px; padding:9px 12px; font:500 11px Pretendard; color:#A24433; line-height:1.5;')}>AI 참고용 정보이며 진단이 아닙니다. <b>반드시 수의사 진료</b>를 받으세요.</div>
              <div onClick={() => setStep('list')} style={css('margin-top:10px; background:#FF6B5C; color:#fff; font:700 14px Pretendard; text-align:center; padding:13px; border-radius:14px; cursor:pointer;')}>가까운 병원 보기</div>
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
