// @ts-nocheck
// 통합 프로토타입(발자국 앱 (통합).html)에서 자동 변환된 화면 마크업.
// 디자인은 인라인 스타일 그대로 보존. 상태/핸들러는 useApp(), CSS 문자열은 css()로 처리.
import { Fragment } from 'react';
import { css } from './lib/css';
import { useApp } from './useApp';

export default function App() {
  const v = useApp();
  return (
<div style={css("min-height:100vh; display:flex; align-items:center; justify-content:center; padding:40px; font-family:Pretendard,-apple-system,sans-serif; color:#1A1A1D;")}>
  <div style={css("width:390px; height:844px; background:#F4F5F7; border-radius:40px; box-shadow:0 24px 64px rgba(20,20,29,.22); overflow:hidden; position:relative; border:1px solid #ECEEF1; display:flex; flex-direction:column;")}>

    
    <div style={css("height:50px; display:flex; align-items:center; justify-content:space-between; padding:0 26px 0 30px; flex:none; position:relative; z-index:5;")}><span style={css("font:700 15px Pretendard;")}>9:41</span><span className="msr" style={css("display:flex; gap:7px; font-size:18px;")}><span>signal_cellular_alt</span><span>wifi</span><span>battery_full</span></span></div>

    
    <div className="scr" style={css("flex:1; overflow-y:auto; position:relative;")}>

      
      {v.isPlanner ? (<>
        {v.isPlannerPrompt ? (<>
          <div data-screen-label="AI 동선 플래너 채팅" style={css("position:absolute; inset:0; z-index:15; background:#F4F5F7; display:flex; flex-direction:column;")}>
            <div style={css("padding:4px 22px 8px; flex:none; display:flex; align-items:center; gap:12px;")}><span onClick={v.backChat} className="msr" style={css("font-size:24px; color:#C7CAD0; cursor:pointer;")}>arrow_back_ios_new</span><span style={css("font:800 18px Pretendard;")}>AI 동선 플래너</span></div>

            {v.isPlannerChatEmpty ? (
              <div style={css("flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:0 30px; text-align:center;")}>
                <div style={css("width:88px; height:88px; border-radius:26px; background:#3B5BFE; display:flex; align-items:center; justify-content:center; box-shadow:0 16px 36px rgba(59,91,254,.32);")}><span className="msf" style={css("font-size:44px; color:#fff;")}>auto_awesome</span></div>
                <div style={css("font-size:26px; font-weight:800; letter-spacing:-0.02em; margin-top:24px;")}>체리와 어디로 떠날까요?</div>
                <div style={css("font:500 15px Pretendard; color:#8A8F98; margin-top:12px; line-height:1.55;")}>가고 싶은 지역·분위기를 적어주세요.<br />AI와 대화하며 펫 동반 코스를 만들어요.</div>
                <div style={css("width:100%; margin-top:28px; display:flex; flex-direction:column; gap:11px;")}>
                  {["전주 한옥마을 반나절 코스", "대형견 OK 카페 위주로", "그늘 많은 산책 코스"].map((q, $i) => (
                    <div key={$i} onClick={() => v.sendChat(q)} style={css("background:#fff; border-radius:16px; padding:15px 18px; box-shadow:0 4px 16px rgba(20,20,29,.05); display:flex; align-items:center; gap:11px; cursor:pointer;")}><span className="msf" style={css("font-size:18px; color:#3B5BFE;")}>bolt</span><span style={css("font:600 14px Pretendard;")}>{q}</span></div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="scr" style={css("flex:1; overflow-y:auto; padding:14px 18px; display:flex; flex-direction:column; gap:10px;")}>
                {v.chatMessages.map((m, $i) => (m.role === 'user' ? (
                  <div key={$i} style={css("align-self:flex-end; max-width:78%; background:#3B5BFE; color:#fff; border-radius:18px 18px 4px 18px; padding:11px 15px; font:500 14px Pretendard; line-height:1.5; white-space:pre-wrap;")}>{m.content}</div>
                ) : (
                  <Fragment key={$i}>
                    <div style={css("align-self:flex-start; max-width:82%; background:#fff; border-radius:18px 18px 18px 4px; padding:11px 15px; font:500 14px Pretendard; color:#1A1A1D; line-height:1.55; box-shadow:0 4px 16px rgba(20,20,29,.05); white-space:pre-wrap;")}>{m.content}</div>
                    {m.course ? (
                      <div style={css("align-self:flex-start; max-width:88%; background:#EEF1FF; border-radius:16px; padding:14px; display:flex; flex-direction:column; gap:9px;")}>
                        <div style={css("display:flex; align-items:center; gap:7px; font:800 14px Pretendard; color:#3B5BFE;")}><span className="msf" style={css("font-size:18px;")}>route</span>{m.course.region || '추천'} 코스 · {m.course.stop_count}곳 · {m.course.total_distance_km}km</div>
                        <div style={css("font:500 12px Pretendard; color:#5A5F68; line-height:1.5;")}>{m.course.stops.map((st) => st.name).join(' → ')}</div>
                        <div onClick={() => v.viewCourse(m.course)} style={css("margin-top:2px; background:#3B5BFE; color:#fff; font:700 13px Pretendard; text-align:center; padding:11px; border-radius:12px; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:6px;")}><span className="msf" style={css("font-size:17px;")}>map</span>동선·지도 보기</div>
                      </div>
                    ) : null}
                  </Fragment>
                )))}
                {v.chatLoading ? (<div style={css("align-self:flex-start; background:#fff; border-radius:18px; padding:11px 16px; font:500 13px Pretendard; color:#8A8F98; box-shadow:0 4px 16px rgba(20,20,29,.05);")}>체리에게 맞는 코스를 그리는 중…</div>) : null}
              </div>
            )}

            <div style={css("padding:8px 18px 14px; flex:none;")}>
              <div style={css("background:#fff; border-radius:18px; padding:6px 6px 6px 18px; box-shadow:0 6px 20px rgba(20,20,29,.08); display:flex; align-items:center; gap:10px;")}>
                <input value={v.chatInput} onChange={(e) => v.setChatInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); v.sendChat(); } }} placeholder="체리와 가고 싶은 곳을 적어보세요" style={css("flex:1; border:none; outline:none; background:transparent; font:500 15px Pretendard; color:#1A1A1D;")} />
                <div onClick={() => v.sendChat()} style={css("width:48px; height:48px; border-radius:14px; background:#3B5BFE; color:#fff; display:flex; align-items:center; justify-content:center; flex:none; cursor:pointer;")}><span className="msf" style={css("font-size:24px;")}>arrow_upward</span></div>
              </div>
              <div style={css("text-align:center; font:400 11px Pretendard; color:#A9A8A2; margin-top:10px;")}>데이터: 한국관광공사 반려동물 동반여행</div>
            </div>
          </div>
        </>) : null}
        {v.isPlannerResults ? (<>
        <div data-screen-label="플래너" style={css("padding:6px 22px 96px;")}>
          <div onClick={v.editPrompt} style={css("display:flex; align-items:center; gap:8px; cursor:pointer;")}><span className="msr" style={css("font-size:22px;")}>arrow_back_ios_new</span><span style={css("font-size:22px; font-weight:800; letter-spacing:-0.02em;")}>체리의 추천 동선</span></div>
          <div onClick={v.editPrompt} style={css("margin-top:14px; display:flex; align-items:center; gap:9px; background:#EEF1FF; border-radius:14px; padding:13px 16px; cursor:pointer;")}><span className="msf" style={css("font-size:18px; color:#3B5BFE;")}>auto_awesome</span><span style={css("flex:1; font:600 14px Pretendard; color:#1A1A1D;")}>체리랑 전주 한옥마을 반나절</span><span className="msr" style={css("font-size:18px; color:#3B5BFE;")}>edit</span></div>
          
          <div style={css("display:flex; align-items:center; justify-content:space-between; margin-top:20px;")}>
            <div style={css("font:800 17px Pretendard;")}>추천 코스 · {v.planStopCount}곳</div>
            <div style={css("display:flex; background:#ECEEF1; border-radius:999px; padding:3px;")}>
              <div onClick={v.plannerList} style={css(`display:flex; align-items:center; gap:4px; font:700 12px Pretendard; padding:7px 13px; border-radius:999px; cursor:pointer; background:${v.plannerListBg}; color:${v.plannerListTx};`)}><span className="msr" style={css("font-size:15px;")}>list</span>리스트</div>
              <div onClick={v.plannerMap} style={css(`display:flex; align-items:center; gap:4px; font:700 12px Pretendard; padding:7px 13px; border-radius:999px; cursor:pointer; background:${v.plannerMapBg}; color:${v.plannerMapTx};`)}><span className="msr" style={css("font-size:15px;")}>map</span>지도</div>
            </div>
          </div>

          
          {v.plannerIsList ? (<>
            <div style={css("margin-top:14px; display:flex; flex-direction:column; gap:12px;")}>
                {v.planLoading ? (<div style={css("padding:48px 0; text-align:center; color:#8A8F98; font:500 13px Pretendard;")}>체리에게 딱 맞는 코스를 짜는 중…</div>) : null}
                {v.planError ? (<div style={css("padding:24px; text-align:center; color:#FF6B5C; font:500 12px Pretendard;")}>코스를 불러오지 못했어요. 백엔드(:8000) 연결을 확인해 주세요.</div>) : null}
                {(v.planStops || []).map((stop, $i) => (<div key={$i} onClick={() => v.selectFacility(stop)} style={css("background:#fff; border-radius:20px; padding:12px; box-shadow:0 6px 20px rgba(20,20,29,.06); display:flex; gap:13px; cursor:pointer;")}>
                  <div style={css(`width:82px; height:82px; border-radius:14px; background:${["linear-gradient(135deg,#F6D9A6,#E7B776)","linear-gradient(135deg,#C9B6E4,#A98FD0)","linear-gradient(135deg,#BFD3F0,#8FAEE0)","linear-gradient(135deg,#EAD7C0,#D3B086)"][$i%4]}; flex:none; position:relative;`)}><div style={css("position:absolute; top:7px; left:7px; width:22px; height:22px; border-radius:50%; background:#3B5BFE; color:#fff; display:flex; align-items:center; justify-content:center; font:800 12px Pretendard;")}>{stop.order}</div></div>
                  <div style={css("flex:1; min-width:0;")}>
                    <div style={css("display:flex; align-items:center; justify-content:space-between;")}><div style={css("font:700 15px Pretendard;")}>{stop.name}</div><span style={css("display:inline-flex; align-items:center; gap:3px; font:700 12px Pretendard;")}><span className="msf" style={css("font-size:14px;")}>star</span>4.7</span></div>
                    <div style={css("font:500 12px Pretendard; color:#8A8F98; margin-top:3px;")}>{stop.category}{stop.distance_from_prev_km > 0 ? ` · 도보 ${Math.round(stop.distance_from_prev_km * 15)}분` : " · 출발"}</div>
                    <div style={css("display:flex; align-items:center; gap:7px; margin-top:9px;")}><div style={css("flex:1; height:5px; background:#ECEEF1; border-radius:999px; overflow:hidden;")}><div style={css(`width:${stop.similarity}%; height:100%; background:#3B5BFE;`)}></div></div><span style={css("font:700 11px Pretendard; color:#3B5BFE;")}>닮은 친구 {stop.similarity}%</span></div>
                  </div>
                </div>))}
              </div>
            <div style={css("margin-top:20px; margin-bottom:9px; display:flex; align-items:center; gap:6px; font:700 13px Pretendard; color:#8A8F98;")}><span className="msf" style={css("font-size:16px;")}>hotel</span>이 코스와 어울리는 숙소<span style={css("font:600 10px Pretendard; color:#C7CAD0; background:#F4F5F7; padding:2px 7px; border-radius:999px;")}>mock</span></div>
            <div onClick={v.openStay} style={css("background:#fff; border-radius:20px; padding:12px; box-shadow:0 6px 20px rgba(20,20,29,.06); display:flex; gap:13px; cursor:pointer;")}>
                <div style={css("width:82px; height:82px; border-radius:14px; background:linear-gradient(135deg,#BFD3F0,#8FAEE0); flex:none; display:flex; align-items:center; justify-content:center;")}><span className="msf" style={css("font-size:30px; color:#fff;")}>hotel</span></div>
                <div style={css("flex:1; min-width:0;")}>
                  <div style={css("display:flex; align-items:center; justify-content:space-between;")}><div style={css("font:700 15px Pretendard;")}>한옥 펜스테이</div><span style={css("display:inline-flex; align-items:center; gap:3px; font:700 12px Pretendard;")}><span className="msf" style={css("font-size:14px;")}>star</span>4.8</span></div>
                  <div style={css("font:500 12px Pretendard; color:#8A8F98; margin-top:3px;")}>숙소 · 반려견 동반 · 차량 8분</div>
                  <div style={css("display:flex; align-items:center; gap:7px; margin-top:9px;")}><div style={css("flex:1; height:5px; background:#ECEEF1; border-radius:999px; overflow:hidden;")}><div style={css("width:69%; height:100%; background:#3B5BFE;")}></div></div><span style={css("font:700 11px Pretendard; color:#3B5BFE;")}>닮은 친구 69%</span></div>
                </div>
            </div>
            <div onClick={v.openTrip} style={css("margin-top:16px; background:#3B5BFE; color:#fff; font:700 16px Pretendard; text-align:center; padding:16px; border-radius:16px; box-shadow:0 10px 24px rgba(59,91,254,.28); cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px;")}><span className="msf" style={css("font-size:20px;")}>play_arrow</span>이 코스로 여행 시작</div>
            <div style={css("font:400 11px Pretendard; color:#A9A8A2; margin-top:14px; text-align:center;")}>데이터: 한국관광공사 반려동물 동반여행</div>
          </>) : null}

          
          {v.plannerIsMap ? (<>
            <div style={css("margin-top:14px; height:420px; border-radius:20px; background:#E6E8EC; position:relative; overflow:hidden; box-shadow:0 6px 20px rgba(20,20,29,.06);")}>
              <div style={css("position:absolute; left:20px; top:40px; width:120px; height:100px; border-radius:18px; background:#DDE0E5;")}></div>
              <div style={css("position:absolute; right:14px; top:90px; width:130px; height:120px; border-radius:18px; background:#CFE4C8;")}></div>
              <div style={css("position:absolute; left:40px; bottom:40px; width:140px; height:110px; border-radius:18px; background:#DDE0E5;")}></div>
              <svg viewbox="0 0 346 420" style={css("position:absolute; inset:0; width:100%; height:100%;")}><path d="M70 80 C 130 110, 100 180, 180 180 S 280 270, 230 360" fill="none" stroke="#3B5BFE" stroke-width="4" stroke-linecap="round" stroke-dasharray="2 12"></path></svg>
              <div style={css("position:absolute; left:56px; top:64px; width:30px; height:30px; border-radius:50% 50% 50% 3px; background:#fff; box-shadow:0 4px 12px rgba(20,20,29,.18); display:flex; align-items:center; justify-content:center;")}><svg width="14" height="14" viewbox="0 0 24 24" fill="#3B5BFE"><ellipse cx="12" cy="16" rx="5.5" ry="4.5"></ellipse><ellipse cx="5.3" cy="10" rx="2.3" ry="2.9"></ellipse><ellipse cx="9.9" cy="6.4" rx="2.3" ry="2.9"></ellipse><ellipse cx="14.1" cy="6.4" rx="2.3" ry="2.9"></ellipse><ellipse cx="18.7" cy="10" rx="2.3" ry="2.9"></ellipse></svg></div>
              <div style={css("position:absolute; left:168px; top:166px; width:30px; height:30px; border-radius:50% 50% 50% 3px; background:#fff; box-shadow:0 4px 12px rgba(20,20,29,.18); display:flex; align-items:center; justify-content:center;")}><svg width="14" height="14" viewbox="0 0 24 24" fill="#3B5BFE"><ellipse cx="12" cy="16" rx="5.5" ry="4.5"></ellipse><ellipse cx="5.3" cy="10" rx="2.3" ry="2.9"></ellipse><ellipse cx="9.9" cy="6.4" rx="2.3" ry="2.9"></ellipse><ellipse cx="14.1" cy="6.4" rx="2.3" ry="2.9"></ellipse><ellipse cx="18.7" cy="10" rx="2.3" ry="2.9"></ellipse></svg></div>
              <div style={css("position:absolute; left:214px; top:344px; width:36px; height:36px; border-radius:50% 50% 50% 3px; background:#3B5BFE; box-shadow:0 6px 16px rgba(59,91,254,.4); display:flex; align-items:center; justify-content:center;")}><svg width="18" height="18" viewbox="0 0 24 24" fill="#fff"><ellipse cx="12" cy="16" rx="5.5" ry="4.5"></ellipse><ellipse cx="5.3" cy="10" rx="2.3" ry="2.9"></ellipse><ellipse cx="9.9" cy="6.4" rx="2.3" ry="2.9"></ellipse><ellipse cx="14.1" cy="6.4" rx="2.3" ry="2.9"></ellipse><ellipse cx="18.7" cy="10" rx="2.3" ry="2.9"></ellipse></svg></div>
              <div style={css("position:absolute; left:14px; top:14px; font:600 11px ui-monospace,monospace; color:#8A8F98; background:rgba(255,255,255,.85); padding:6px 10px; border-radius:8px;")}>길찾기 · 3.2km · 4시간</div>
            </div>
            <div onClick={v.openTrip} style={css("margin-top:16px; background:#3B5BFE; color:#fff; font:700 16px Pretendard; text-align:center; padding:16px; border-radius:16px; box-shadow:0 10px 24px rgba(59,91,254,.28); cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px;")}><span className="msf" style={css("font-size:20px;")}>navigation</span>길찾기 시작</div>
          </>) : null}
        </div>
        </>) : null}
      </>) : null}

      
      {v.isFacility ? (<>
        <div data-screen-label="시설 상세" style={css("padding:0 0 96px;")}>
          <div style={css("height:180px; background:linear-gradient(135deg,#F6D9A6,#E7B776); position:relative; display:flex; align-items:center; justify-content:center;")}>
            <span className="msr" style={css("font-size:56px; color:rgba(255,255,255,.5);")}>local_cafe</span>
            <div onClick={v.goPlanner} style={css("position:absolute; top:16px; left:18px; width:40px; height:40px; border-radius:50%; background:rgba(255,255,255,.92); display:flex; align-items:center; justify-content:center; cursor:pointer;")}><span className="msr" style={css("font-size:22px;")}>arrow_back_ios_new</span></div>
          </div>
          <div style={css("padding:20px 22px 0;")}>
            <div style={css("display:flex; align-items:flex-start; justify-content:space-between;")}><div><div style={css("font:800 22px Pretendard; letter-spacing:-0.02em;")}>{v.facilityName}</div><div style={css("font:500 13px Pretendard; color:#8A8F98; margin-top:4px;")}>{v.facilityDesc}</div></div><span style={css("display:inline-flex; align-items:center; gap:3px; font:800 13px Pretendard; background:#fff; border:1px solid #ECEEF1; padding:7px 11px; border-radius:999px;")}><span className="msf" style={css("font-size:15px;")}>star</span>4.7</span></div>

            <div onClick={v.openJudge} style={css("margin-top:16px; background:#EEF1FF; border-radius:16px; padding:15px 16px; display:flex; align-items:center; gap:12px; cursor:pointer;")}><div style={css("width:40px; height:40px; border-radius:12px; background:#3B5BFE; color:#fff; display:flex; align-items:center; justify-content:center; flex:none;")}><span className="msf" style={css("font-size:24px;")}>verified</span></div><div style={css("flex:1;")}><div style={css("font:800 15px Pretendard; color:#3B5BFE;")}>체리 입장 가능</div><div style={css("font:500 12px Pretendard; color:#5A5F68; margin-top:2px;")}>대형견 가능 · 목줄 필수 · 실내 동반</div></div><span className="msr" style={css("font-size:20px; color:#3B5BFE;")}>chevron_right</span></div>

            <div style={css("display:flex; align-items:center; justify-content:space-between; margin:18px 0 10px;")}><span style={css("font:600 13px Pretendard; color:#8A8F98;")}>동반 규정 · 이동약자 배려</span><span onClick={v.openBadges} style={css("font:700 12px Pretendard; color:#3B5BFE; cursor:pointer;")}>배지 안내</span></div>
            <div style={css("display:flex; gap:7px; flex-wrap:wrap;")}>
              <span style={css("display:inline-flex; align-items:center; gap:5px; font:600 12px Pretendard; background:#fff; border:1px solid #ECEEF1; padding:8px 12px; border-radius:999px;")}><span className="msf" style={css("font-size:15px; color:#3B5BFE;")}>pets</span>목줄 필수</span>
              <span style={css("display:inline-flex; align-items:center; gap:5px; font:600 12px Pretendard; background:#EEF1FF; color:#3B5BFE; padding:8px 12px; border-radius:999px;")}><span className="msf" style={css("font-size:15px;")}>check_circle</span>실내 가능</span>
              <span style={css("display:inline-flex; align-items:center; gap:5px; font:600 12px Pretendard; background:#fff; border:1px solid #ECEEF1; padding:8px 12px; border-radius:999px;")}><span className="msf" style={css("font-size:15px; color:#3B5BFE;")}>accessible</span>휠체어 접근</span>
              <span style={css("display:inline-flex; align-items:center; gap:5px; font:600 12px Pretendard; background:#fff; border:1px solid #ECEEF1; padding:8px 12px; border-radius:999px;")}><span className="msf" style={css("font-size:15px; color:#3B5BFE;")}>ramp_right</span>경사로</span>
            </div>

            <div style={css("margin-top:16px; background:#fff; border-radius:16px; padding:4px 16px; box-shadow:0 4px 16px rgba(20,20,29,.05);")}>
              <div style={css("display:flex; align-items:center; justify-content:space-between; padding:13px 0; border-bottom:1px solid #ECEEF1;")}><span style={css("font:500 14px Pretendard; color:#8A8F98;")}>추천 시간</span><span style={css("font:700 14px Pretendard;")}>1시간</span></div>
              <div style={css("display:flex; align-items:center; justify-content:space-between; padding:13px 0; border-bottom:1px solid #ECEEF1;")}><span style={css("font:500 14px Pretendard; color:#8A8F98;")}>평균 비용</span><span style={css("font:700 14px Pretendard;")}>1인 1.2만원</span></div>
              <div onClick={v.openSimilar} style={css("display:flex; align-items:center; justify-content:space-between; padding:13px 0; cursor:pointer;")}><span style={css("font:500 14px Pretendard; color:#8A8F98;")}>닮은 친구 방문율</span><span style={css("display:inline-flex; align-items:center; gap:4px; font:700 14px Pretendard; color:#3B5BFE;")}>78%<span className="msr" style={css("font-size:17px;")}>chevron_right</span></span></div>
            </div>

            <div style={css("display:flex; gap:10px; margin-top:16px;")}>
              <div onClick={v.openDine} style={css("flex:1; background:#fff; border:1px solid #ECEEF1; border-radius:14px; padding:14px; text-align:center; box-shadow:0 4px 16px rgba(20,20,29,.05); cursor:pointer;")}><span className="msf" style={css("font-size:22px; color:#3B5BFE; display:block; margin-bottom:5px;")}>event_available</span><span style={css("font:600 13px Pretendard;")}>예약하기</span></div>
              <div style={css("flex:1; background:#fff; border:1px solid #ECEEF1; border-radius:14px; padding:14px; text-align:center; box-shadow:0 4px 16px rgba(20,20,29,.05);")}><span className="msf" style={css("font-size:22px; color:#FF6B5C; display:block; margin-bottom:5px;")}>favorite</span><span style={css("font:600 13px Pretendard;")}>찜</span></div>
            </div>
          </div>
          <div style={css("padding:16px 22px 0;")}><div onClick={v.openTrip} style={css("background:#3B5BFE; color:#fff; font:700 16px Pretendard; text-align:center; padding:17px; border-radius:18px; box-shadow:0 10px 24px rgba(59,91,254,.28); cursor:pointer;")}>코스에 추가하고 시작</div></div>
        </div>
      </>) : null}

      
      {v.isTrip ? (<>
        <div data-screen-label="여행 진행" style={css("padding:6px 22px 96px;")}>
          <div style={css("display:flex; align-items:center; gap:12px;")}><div onClick={v.goPlanner} style={css("cursor:pointer;")}><span className="msr" style={css("font-size:24px;")}>arrow_back_ios_new</span></div><div style={css("font:700 16px Pretendard;")}>여행 진행 중</div></div>
          <div style={css("margin-top:14px; background:#3B5BFE; border-radius:18px; padding:18px; color:#fff; box-shadow:0 10px 24px rgba(59,91,254,.28);")}>
            <div style={css("font:600 12px Pretendard; opacity:.85;")}>다음 목적지</div>
            <div style={css("font:800 20px Pretendard; margin-top:4px;")}>오목대 전망</div>
            <div style={css("display:flex; gap:18px; margin-top:14px;")}><div><div style={css("font:800 17px Pretendard;")}>7분</div><div style={css("font:500 11px Pretendard; opacity:.8;")}>남은 거리</div></div><div><div style={css("font:800 17px Pretendard;")}>2/4</div><div style={css("font:500 11px Pretendard; opacity:.8;")}>방문</div></div></div>
          </div>

          <div style={css("display:flex; align-items:center; justify-content:space-between; margin:20px 0 12px;")}><div style={css("font:800 16px Pretendard;")}>케어 알림</div><div style={css("display:flex; align-items:center; gap:8px;")}><span style={css("display:inline-flex; align-items:center; gap:4px; font:600 11px Pretendard; color:#3B5BFE; background:#EEF1FF; padding:5px 10px; border-radius:999px;")}><span className="msf" style={css("font-size:13px;")}>auto_awesome</span>AI 자동 알림</span><div onClick={v.openCare} style={css("width:34px; height:34px; border-radius:50%; background:#fff; border:1px solid #ECEEF1; display:flex; align-items:center; justify-content:center; cursor:pointer;")}><span className="msr" style={css("font-size:19px; color:#5A5F68;")}>settings</span></div></div></div>

          <div style={css("display:flex; flex-direction:column; gap:10px;")}>
            <div style={css("background:#fff; border-radius:14px; padding:13px 15px; box-shadow:0 4px 16px rgba(20,20,29,.05); display:flex; gap:11px; align-items:center;")}><div style={css("width:34px; height:34px; border-radius:10px; background:#EEF1FF; color:#3B5BFE; display:flex; align-items:center; justify-content:center; flex:none;")}><span className="msf" style={css("font-size:18px;")}>water_drop</span></div><div style={css("flex:1;")}><div style={css("font:700 13px Pretendard;")}>물 마실 시간</div><div style={css("font:500 12px Pretendard; color:#8A8F98;")}>"꿀꺽꿀꺽, 시원하다!"</div></div><span style={css("font:600 11px Pretendard; color:#8A8F98;")}>13:10</span></div>
            <div style={css("background:#fff; border-radius:14px; padding:13px 15px; box-shadow:0 4px 16px rgba(20,20,29,.05); display:flex; gap:11px; align-items:center;")}><div style={css("width:34px; height:34px; border-radius:10px; background:#EEF1FF; color:#3B5BFE; display:flex; align-items:center; justify-content:center; flex:none;")}><span className="msf" style={css("font-size:18px;")}>chair</span></div><div style={css("flex:1;")}><div style={css("font:700 13px Pretendard;")}>휴식 권장</div><div style={css("font:500 12px Pretendard; color:#8A8F98;")}>"잠깐 그늘에서 쉬자"</div></div><span style={css("font:600 11px Pretendard; color:#8A8F98;")}>13:40</span></div>
            <div style={css("background:#FFF1EF; border:1px solid #FFD8D1; border-radius:14px; padding:13px 15px; display:flex; gap:11px; align-items:center;")}><div style={css("width:34px; height:34px; border-radius:10px; background:#FF6B5C; color:#fff; display:flex; align-items:center; justify-content:center; flex:none;")}><span className="msf" style={css("font-size:18px;")}>sunny</span></div><div style={css("flex:1;")}><div style={css("font:700 13px Pretendard; color:#E0533F;")}>폭염 주의 <span style={css("font:500 10px Pretendard; color:#fff; background:#FF6B5C; padding:2px 7px; border-radius:999px;")}>AI 예측</span></div><div style={css("font:500 12px Pretendard; color:#A24433;")}>"그늘에서 10분 쉬어가자"</div></div><span style={css("font:600 11px Pretendard; color:#E0533F;")}>지금</span></div>
          </div>

          <div style={css("display:flex; align-items:center; justify-content:space-between; margin:22px 0 6px;")}><div style={css("font:800 16px Pretendard;")}>지금 기록하기</div><span style={css("font:500 12px Pretendard; color:#8A8F98;")}>버튼 → AI 학습</span></div>
          <div style={css("font:500 12px Pretendard; color:#8A8F98; margin-bottom:12px;")}>급여·휴식 때 버튼을 누르면 여행 경과 시각이 자동 기록돼요.</div>
          <div style={css("display:flex; gap:10px;")}>
            <div onClick={v.recordFeed} style={css("flex:1; background:#fff; border:1px solid #ECEEF1; border-radius:16px; padding:14px; text-align:center; box-shadow:0 4px 16px rgba(20,20,29,.05); cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px;")}><span className="msf" style={css("font-size:20px; color:#3B5BFE;")}>water_drop</span><span style={css("font:700 14px Pretendard;")}>급여 기록</span></div>
            <div onClick={v.recordRest} style={css("flex:1; background:#fff; border:1px solid #ECEEF1; border-radius:16px; padding:14px; text-align:center; box-shadow:0 4px 16px rgba(20,20,29,.05); cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px;")}><span className="msf" style={css("font-size:20px; color:#3B5BFE;")}>chair</span><span style={css("font:700 14px Pretendard;")}>휴식 기록</span></div>
          </div>
          {v.hasLogs ? (<>
            <div style={css("margin-top:14px; background:#fff; border-radius:16px; padding:6px 16px; box-shadow:0 4px 16px rgba(20,20,29,.05);")}>
              <div style={css("display:flex; align-items:center; justify-content:space-between; padding:12px 0 8px;")}><span style={css("font:700 13px Pretendard;")}>오늘 기록</span><span onClick={v.clearLogs} style={css("font:600 12px Pretendard; color:#8A8F98; cursor:pointer;")}>전체 삭제</span></div>
              {(v.careLogsView||[]).map((log, $i) => (<Fragment key={$i}>
                <div style={css("display:flex; align-items:center; gap:11px; padding:11px 0; border-top:1px solid #F1F2F4;")}><div style={css("width:32px; height:32px; border-radius:9px; background:#EEF1FF; color:#3B5BFE; display:flex; align-items:center; justify-content:center; flex:none;")}><span className="msf" style={css("font-size:17px;")}>{log.icon}</span></div><div style={css("flex:1;")}><div style={css("font:700 13px Pretendard;")}>{log.label}</div><div style={css("font:500 11px Pretendard; color:#8A8F98; margin-top:1px;")}>{log.elapsed}</div></div><span className="msf" style={css("font-size:18px; color:#22A565;")}>check_circle</span></div>
              </Fragment>))}
              <div style={css("display:flex; align-items:center; gap:7px; padding:11px 2px 13px;")}><span className="msf" style={css("font-size:16px; color:#3B5BFE;")}>auto_awesome</span><span style={css("font:500 12px Pretendard; color:#5A5F68;")}>이 기록으로 체리의 급여·휴식 패턴을 학습해요.</span></div>
            </div>
          </>) : null}
        </div>
      </>) : null}

      
      {v.isExplore ? (<>
        <div data-screen-label="둘러보기" style={css("padding:6px 22px 96px;")}>
          <div style={css("font-size:26px; font-weight:800; letter-spacing:-0.02em;")}>둘러보기</div>
          <div style={css("font:500 14px Pretendard; color:#8A8F98; margin-top:6px;")}>공공 문화데이터로 즐기는 전주</div>

          <div style={css("display:flex; align-items:center; justify-content:space-between; margin-top:18px;")}>
            <div style={css("font:800 16px Pretendard;")}>문화 데이터 허브</div>
            <div style={css("display:flex; background:#ECEEF1; border-radius:999px; padding:3px;")}>
              <div onClick={v.exploreList} style={css(`font:700 12px Pretendard; padding:7px 13px; border-radius:999px; cursor:pointer; background:${v.exploreListBg}; color:${v.exploreListTx};`)}>리스트</div>
              <div onClick={v.exploreMap} style={css(`font:700 12px Pretendard; padding:7px 13px; border-radius:999px; cursor:pointer; background:${v.exploreMapBg}; color:${v.exploreMapTx};`)}>지도</div>
            </div>
          </div>

          {v.exploreIsList ? (<>
            <div style={css("margin-top:14px; display:grid; grid-template-columns:1fr 1fr; gap:12px;")}>
              <div onClick={v.openFest} style={css("background:#fff; border-radius:18px; padding:16px; box-shadow:0 6px 20px rgba(20,20,29,.06); cursor:pointer;")}><div style={css("width:44px; height:44px; border-radius:13px; background:#EEF1FF; color:#3B5BFE; display:flex; align-items:center; justify-content:center;")}><span className="msf" style={css("font-size:24px;")}>festival</span></div><div style={css("font:700 15px Pretendard; margin-top:12px;")}>축제 캘린더</div><div style={css("font:500 12px Pretendard; color:#8A8F98; margin-top:3px;")}>동반 가능일 표시</div></div>
              <div onClick={v.openTrail} style={css("background:#fff; border-radius:18px; padding:16px; box-shadow:0 6px 20px rgba(20,20,29,.06); cursor:pointer;")}><div style={css("width:44px; height:44px; border-radius:13px; background:#EAF6EE; color:#22A565; display:flex; align-items:center; justify-content:center;")}><span className="msf" style={css("font-size:24px;")}>forest</span></div><div style={css("font:700 15px Pretendard; margin-top:12px;")}>둘레길 코스</div><div style={css("font:500 12px Pretendard; color:#8A8F98; margin-top:3px;")}>평지·그늘 배지</div></div>
              <div onClick={v.openStamp} style={css("background:#fff; border-radius:18px; padding:16px; box-shadow:0 6px 20px rgba(20,20,29,.06); cursor:pointer;")}><div style={css("width:44px; height:44px; border-radius:13px; background:#FFF4E5; color:#C68A1E; display:flex; align-items:center; justify-content:center;")}><span className="msf" style={css("font-size:24px;")}>approval</span></div><div style={css("font:700 15px Pretendard; margin-top:12px;")}>문화시설 스탬프</div><div style={css("font:500 12px Pretendard; color:#8A8F98; margin-top:3px;")}>7/12 방문</div></div>
              <div onClick={v.openVlog} style={css("background:#fff; border-radius:18px; padding:16px; box-shadow:0 6px 20px rgba(20,20,29,.06); cursor:pointer;")}><div style={css("width:44px; height:44px; border-radius:13px; background:#F3ECFB; color:#8B5CF6; display:flex; align-items:center; justify-content:center;")}><span className="msf" style={css("font-size:24px;")}>movie</span></div><div style={css("font:700 15px Pretendard; margin-top:12px;")}>강아지 브이로그</div><div style={css("font:500 12px Pretendard; color:#8A8F98; margin-top:3px;")}>강아지 시점 영상</div></div>
            </div>
            <div onClick={v.openAccess} style={css("margin-top:12px; background:#fff; border-radius:18px; padding:16px; box-shadow:0 6px 20px rgba(20,20,29,.06); display:flex; align-items:center; gap:13px; cursor:pointer;")}><div style={css("width:44px; height:44px; border-radius:13px; background:#EEF6FF; color:#3B5BFE; display:flex; align-items:center; justify-content:center; flex:none;")}><span className="msf" style={css("font-size:24px;")}>accessible</span></div><div style={css("flex:1;")}><div style={css("font:700 15px Pretendard;")}>이동약자 배려 시설</div><div style={css("font:500 12px Pretendard; color:#8A8F98; margin-top:2px;")}>시니어·장애 보호자와 함께</div></div><span className="msr" style={css("font-size:20px; color:#C7CAD0;")}>chevron_right</span></div>
            <div onClick={v.openQR} style={css("margin-top:12px; background:#fff; border-radius:18px; padding:16px; box-shadow:0 6px 20px rgba(20,20,29,.06); display:flex; align-items:center; gap:13px; cursor:pointer;")}><div style={css("width:44px; height:44px; border-radius:13px; background:#EEF1FF; color:#3B5BFE; display:flex; align-items:center; justify-content:center; flex:none;")}><span className="msf" style={css("font-size:24px;")}>qr_code_scanner</span></div><div style={css("flex:1;")}><div style={css("font:700 15px Pretendard;")}>현장 QR 스캔</div><div style={css("font:500 12px Pretendard; color:#8A8F98; margin-top:2px;")}>관광지 QR을 찍으면 체리가 안내해요</div></div><span className="msr" style={css("font-size:20px; color:#C7CAD0;")}>chevron_right</span></div>
            <div style={css("margin-top:16px; font:800 16px Pretendard;")}>이번 달 축제</div>
            <div onClick={v.openFest} style={css("margin-top:12px; background:#fff; border-radius:18px; overflow:hidden; box-shadow:0 6px 20px rgba(20,20,29,.06); cursor:pointer;")}>
              <div style={css("height:110px; background:linear-gradient(135deg,#F4C6BE,#E89B8E); position:relative;")}><span style={css("position:absolute; top:12px; left:14px; font:600 11px Pretendard; color:#fff; background:rgba(0,0,0,.3); padding:5px 10px; border-radius:999px;")}>반려동물 동반 가능</span></div>
              <div style={css("padding:14px 16px;")}><div style={css("font:700 16px Pretendard;")}>전주비빔밥축제</div><div style={css("font:500 12px Pretendard; color:#8A8F98; margin-top:4px;")}>10.16–10.19 · 전주 풍남문광장</div><div style={css("font:400 11px Pretendard; color:#A9A8A2; margin-top:10px;")}>데이터: 한국관광공사 반려동물 동반여행</div></div>
            </div>
          </>) : null}
          {v.exploreIsMap ? (<>
            <div style={css("margin-top:14px; height:440px; border-radius:20px; background:#E6E8EC; position:relative; overflow:hidden; box-shadow:0 6px 20px rgba(20,20,29,.06);")}>
              <div style={css("position:absolute; left:24px; top:50px; width:120px; height:100px; border-radius:18px; background:#DDE0E5;")}></div>
              <div style={css("position:absolute; right:18px; top:120px; width:130px; height:120px; border-radius:18px; background:#CFE4C8;")}></div>
              <div style={css("position:absolute; left:50px; bottom:50px; width:140px; height:100px; border-radius:18px; background:#DDE0E5;")}></div>
              <div style={css("position:absolute; left:70px; top:80px; width:34px; height:34px; border-radius:50% 50% 50% 3px; background:#3B5BFE; box-shadow:0 4px 12px rgba(59,91,254,.4); display:flex; align-items:center; justify-content:center; color:#fff;")}><span className="msf" style={css("font-size:17px;")}>festival</span></div>
              <div style={css("position:absolute; right:60px; top:160px; width:34px; height:34px; border-radius:50% 50% 50% 3px; background:#22A565; box-shadow:0 4px 12px rgba(34,165,101,.4); display:flex; align-items:center; justify-content:center; color:#fff;")}><span className="msf" style={css("font-size:17px;")}>forest</span></div>
              <div style={css("position:absolute; left:120px; bottom:90px; width:34px; height:34px; border-radius:50% 50% 50% 3px; background:#C68A1E; box-shadow:0 4px 12px rgba(198,138,30,.4); display:flex; align-items:center; justify-content:center; color:#fff;")}><span className="msf" style={css("font-size:17px;")}>approval</span></div>
              <div style={css("position:absolute; left:14px; top:14px; font:600 11px ui-monospace,monospace; color:#8A8F98; background:rgba(255,255,255,.85); padding:6px 10px; border-radius:8px;")}>전주 일대 문화 장소</div>
            </div>
          </>) : null}
        </div>
      </>) : null}

      
      {v.isCommunity ? (<>
        <div data-screen-label="커뮤니티" style={css("padding:6px 22px 96px;")}>
          <div style={css("display:flex; align-items:center; justify-content:space-between;")}><div style={css("font-size:26px; font-weight:800; letter-spacing:-0.02em;")}>커뮤니티</div><span className="msr" style={css("font-size:24px; color:#8A8F98;")}>search</span></div>
          <div style={css("font:500 14px Pretendard; color:#8A8F98; margin-top:6px;")}>다른 강아지들의 코스를 발견해요.</div>

          
          <div style={css("display:flex; gap:12px; margin-top:18px; overflow:hidden;")}>
            <div style={css("text-align:center; flex:none;")}><div style={css("width:62px; height:62px; border-radius:50%; padding:3px; background:linear-gradient(135deg,#3B5BFE,#7B93FF);")}><div style={css("width:100%; height:100%; border-radius:50%; background:linear-gradient(135deg,#F5CE96,#E3A865); border:2px solid #fff;")}></div></div><div style={css("font:500 11px Pretendard; margin-top:5px;")}>콩이</div></div>
            <div style={css("text-align:center; flex:none;")}><div style={css("width:62px; height:62px; border-radius:50%; padding:3px; background:linear-gradient(135deg,#3B5BFE,#7B93FF);")}><div style={css("width:100%; height:100%; border-radius:50%; background:linear-gradient(135deg,#C9DFC0,#9CCB90); border:2px solid #fff;")}></div></div><div style={css("font:500 11px Pretendard; margin-top:5px;")}>보리</div></div>
            <div style={css("text-align:center; flex:none;")}><div style={css("width:62px; height:62px; border-radius:50%; padding:3px; background:linear-gradient(135deg,#3B5BFE,#7B93FF);")}><div style={css("width:100%; height:100%; border-radius:50%; background:linear-gradient(135deg,#CBD3F7,#9EAEF0); border:2px solid #fff;")}></div></div><div style={css("font:500 11px Pretendard; margin-top:5px;")}>마루</div></div>
            <div style={css("text-align:center; flex:none;")}><div style={css("width:62px; height:62px; border-radius:50%; padding:3px; background:linear-gradient(135deg,#3B5BFE,#7B93FF);")}><div style={css("width:100%; height:100%; border-radius:50%; background:linear-gradient(135deg,#F3D6C0,#DDB08C); border:2px solid #fff;")}></div></div><div style={css("font:500 11px Pretendard; margin-top:5px;")}>초코</div></div>
          </div>

          
          <div onClick={v.openClips} style={css("margin-top:16px; background:#fff; border-radius:16px; padding:14px 16px; box-shadow:0 6px 20px rgba(20,20,29,.06); display:flex; align-items:center; gap:11px; cursor:pointer;")}><div style={css("width:44px; height:44px; border-radius:13px; background:#F3ECFB; color:#8B5CF6; display:flex; align-items:center; justify-content:center; flex:none;")}><span className="msf" style={css("font-size:24px;")}>movie</span></div><div style={css("flex:1;")}><div style={css("font:700 14px Pretendard;")}>발자국 클립</div><div style={css("font:500 12px Pretendard; color:#8A8F98; margin-top:2px;")}>강아지 시점 짧은 영상 모아보기</div></div><span className="msr" style={css("font-size:20px; color:#C7CAD0;")}>chevron_right</span></div>
          {(v.communityPosts || []).map((post, $i) => (<div key={post.id ?? $i} onClick={() => v.openPost(post)} style={css("margin-top:16px; background:#fff; border-radius:20px; overflow:hidden; box-shadow:0 6px 20px rgba(20,20,29,.06); cursor:pointer;")}>
            <div style={css("display:flex; align-items:center; gap:10px; padding:14px 16px;")}><div style={css("width:36px; height:36px; border-radius:50%; background:linear-gradient(135deg,#F5CE96,#E3A865);")}></div><div style={css("flex:1;")}><div style={css("font:700 13px Pretendard;")}>{post.title}</div><div style={css("font:500 11px Pretendard; color:#8A8F98;")}>전주 한옥마을 · {post.created_at}</div></div><span className="msr" style={css("font-size:20px; color:#C7CAD0;")}>more_horiz</span></div>
            <div style={css("height:200px; background:linear-gradient(135deg,#F6D9A6,#E0A867); position:relative;")}><div style={css("position:absolute; bottom:12px; left:14px; background:rgba(0,0,0,.45); color:#fff; font:600 11px Pretendard; padding:6px 11px; border-radius:999px; display:inline-flex; align-items:center; gap:5px;")}><span className="msf" style={css("font-size:13px;")}>route</span>코스 4곳 · 3.2km</div></div>
            <div style={css("padding:12px 16px;")}>
              <div style={css("display:flex; align-items:center; gap:16px;")}><span style={css("display:inline-flex; align-items:center; gap:5px; font:700 13px Pretendard;")}><span className="msf" style={css("font-size:20px; color:#FF6B5C;")}>favorite</span>{post.like_count}</span><span style={css("display:inline-flex; align-items:center; gap:5px; font:700 13px Pretendard; color:#8A8F98;")}><span className="msr" style={css("font-size:20px;")}>chat_bubble</span>24</span><span style={css("margin-left:auto; font:700 12px Pretendard; color:#3B5BFE; background:#EEF1FF; padding:7px 13px; border-radius:999px;")}>이 코스 담기</span></div>
              <div style={css("font:500 13px Pretendard; color:#5A5F68; margin-top:10px; line-height:1.5;")}>{post.body}</div>
            </div>
          </div>))}
        </div>
      </>) : null}

      
      {v.isDog ? (<>
        <div data-screen-label="내 강아지" style={css("padding:0 0 96px;")}>
          
          <div style={css("background:linear-gradient(180deg,#EEF1FF,#F4F5F7); padding:8px 22px 22px; text-align:center;")}>
            <div style={css("width:128px; height:128px; margin:0 auto;")}><video src={v.petModelSrc} poster="/pet-3d-mvp.png" autoPlay loop muted playsInline style={css("width:100%; height:100%; object-fit:contain; filter:drop-shadow(0 10px 20px rgba(59,91,254,.16));")} /></div>
            <div style={css("font:800 24px Pretendard; letter-spacing:-0.02em; margin-top:14px;")}>체리</div>
            <div style={css("font:500 13px Pretendard; color:#8A8F98; margin-top:2px;")}>골든 리트리버 · 3살</div>
            <div style={css("display:flex; gap:6px; justify-content:center; flex-wrap:wrap; margin-top:12px;")}>
              <span style={css("font:600 12px Pretendard; background:#fff; border:1px solid #ECEEF1; padding:7px 12px; border-radius:999px;")}>대형견</span>
              <span style={css("font:600 12px Pretendard; background:#fff; border:1px solid #ECEEF1; padding:7px 12px; border-radius:999px;")}>{v.taSocial}</span>
              <span style={css("display:inline-flex; align-items:center; gap:4px; font:600 12px Pretendard; background:#FFF1EF; color:#FF6B5C; padding:7px 12px; border-radius:999px;")}><span className="msf" style={css("font-size:13px;")}>{v.taBody === '추위 취약' ? 'ac_unit' : v.taBody === '관절 주의' ? 'healing' : 'sunny'}</span>{v.taBody}</span>
              <span onClick={v.openEditTraits} style={css("display:inline-flex; align-items:center; gap:4px; font:600 12px Pretendard; background:#EEF1FF; color:#3B5BFE; padding:7px 12px; border-radius:999px; cursor:pointer;")}><span className="msf" style={css("font-size:13px;")}>edit</span>특징 편집</span>
            </div>
          </div>

          
          <div style={css("padding:18px 22px 0;")}>
            <div style={css("display:flex; background:#ECEEF1; border-radius:14px; padding:4px;")}>
              <div onClick={v.walletView} style={css(`flex:1; text-align:center; font:700 14px Pretendard; padding:10px; border-radius:11px; cursor:pointer; background:${v.walletBg}; color:${v.walletTx};`)}>프로필</div>
              <div onClick={v.dressView} style={css(`flex:1; text-align:center; font:700 14px Pretendard; padding:10px; border-radius:11px; cursor:pointer; background:${v.dressBg}; color:${v.dressTx};`)}>꾸미기</div>
            </div>
          </div>

          
          {v.dogIsWallet ? (<>
            <div style={css("padding:16px 22px 0;")}>
              
              <div style={css("display:flex; gap:10px;")}>
                <div onClick={v.openEmg} style={css("flex:1; background:#fff; border:1px solid #FFD8D1; border-radius:14px; padding:14px 8px; text-align:center; box-shadow:0 4px 16px rgba(20,20,29,.05); cursor:pointer;")}><span className="msf" style={css("font-size:24px; color:#FF6B5C; display:block; margin-bottom:6px;")}>emergency</span><span style={css("font:600 12px Pretendard;")}>응급</span></div>
                <div onClick={v.openTrip} style={css("flex:1; background:#fff; border:1px solid #ECEEF1; border-radius:14px; padding:14px 8px; text-align:center; box-shadow:0 4px 16px rgba(20,20,29,.05); cursor:pointer;")}><span className="msf" style={css("font-size:24px; color:#3B5BFE; display:block; margin-bottom:6px;")}>notifications_active</span><span style={css("font:600 12px Pretendard;")}>케어 알림</span></div>
                <div style={css("flex:1; background:#fff; border:1px solid #ECEEF1; border-radius:14px; padding:14px 8px; text-align:center; box-shadow:0 4px 16px rgba(20,20,29,.05);")}><span className="msf" style={css("font-size:24px; color:#C68A1E; display:block; margin-bottom:6px;")}>approval</span><span style={css("font:600 12px Pretendard;")}>스탬프 7/12</span></div>
              </div>

              
              <div style={css("font:800 16px Pretendard; margin:20px 0 12px;")}>기본 정보</div>
              <div style={css("background:#fff; border-radius:16px; padding:4px 16px; box-shadow:0 4px 16px rgba(20,20,29,.05);")}>
                <div style={css("display:flex; align-items:center; justify-content:space-between; padding:13px 0; border-bottom:1px solid #ECEEF1;")}><span style={css("font:500 14px Pretendard; color:#8A8F98;")}>견종</span><span style={css("font:700 14px Pretendard;")}>골든 리트리버</span></div>
                <div style={css("display:flex; align-items:center; justify-content:space-between; padding:13px 0; border-bottom:1px solid #ECEEF1;")}><span style={css("font:500 14px Pretendard; color:#8A8F98;")}>체중</span><span style={css("font:700 14px Pretendard;")}>28kg</span></div>
                <div style={css("display:flex; align-items:center; justify-content:space-between; padding:13px 0; border-bottom:1px solid #ECEEF1;")}><span style={css("font:500 14px Pretendard; color:#8A8F98;")}>나이</span><span style={css("font:700 14px Pretendard;")}>3살</span></div>
                <div style={css("display:flex; align-items:center; justify-content:space-between; padding:13px 0;")}><span style={css("font:500 14px Pretendard; color:#8A8F98;")}>중성화</span><span style={css("font:700 14px Pretendard;")}>완료</span></div>
              </div>

              
              <div style={css("font:800 16px Pretendard; margin:20px 0 12px;")}>추억</div>
              <div style={css("display:grid; grid-template-columns:1fr 1fr; gap:12px;")}>
                <div onClick={v.openPawmap} style={css("background:#fff; border-radius:16px; padding:15px; box-shadow:0 4px 16px rgba(20,20,29,.05); cursor:pointer;")}><span className="msf" style={css("font-size:22px; color:#3B5BFE;")}>map</span><div style={css("font:700 14px Pretendard; margin-top:9px;")}>발자국 지도</div><div style={css("font:500 11px Pretendard; color:#8A8F98; margin-top:2px;")}>다녀온 14곳</div></div>
                <div onClick={v.openRecap} style={css("background:#fff; border-radius:16px; padding:15px; box-shadow:0 4px 16px rgba(20,20,29,.05); cursor:pointer;")}><span className="msf" style={css("font-size:22px; color:#3B5BFE;")}>auto_stories</span><div style={css("font:700 14px Pretendard; margin-top:9px;")}>연말 결산</div><div style={css("font:500 11px Pretendard; color:#8A8F98; margin-top:2px;")}>2025 발자국</div></div>
                <div onClick={v.openFigure} style={css("background:#fff; border-radius:16px; padding:15px; box-shadow:0 4px 16px rgba(20,20,29,.05); cursor:pointer;")}><span className="msf" style={css("font-size:22px; color:#3B5BFE;")}>deployed_code</span><div style={css("font:700 14px Pretendard; margin-top:9px;")}>3D 피규어</div><div style={css("font:500 11px Pretendard; color:#8A8F98; margin-top:2px;")}>굿즈 만들기</div></div>
                <div onClick={v.openPassport} style={css("background:#fff; border-radius:16px; padding:15px; box-shadow:0 4px 16px rgba(20,20,29,.05); cursor:pointer;")}><span className="msf" style={css("font-size:22px; color:#3B5BFE;")}>badge</span><div style={css("font:700 14px Pretendard; margin-top:9px;")}>펫 패스포트</div><div style={css("font:500 11px Pretendard; color:#8A8F98; margin-top:2px;")}>스탬프·배지 요약</div></div>
              </div>

              
              <div onClick={v.openCare} style={css("margin-top:18px; background:#fff; border-radius:16px; padding:16px; box-shadow:0 4px 16px rgba(20,20,29,.05); display:flex; align-items:center; gap:12px; cursor:pointer;")}><div style={css("width:40px; height:40px; border-radius:12px; background:#EEF1FF; color:#3B5BFE; display:flex; align-items:center; justify-content:center;")}><span className="msf" style={css("font-size:22px;")}>settings</span></div><div style={css("flex:1;")}><div style={css("font:700 14px Pretendard;")}>케어 알림 설정</div><div style={css("font:500 12px Pretendard; color:#8A8F98; margin-top:2px;")}>급여·휴식 간격 · AI 학습 68%</div></div><span className="msr" style={css("font-size:20px; color:#C7CAD0;")}>chevron_right</span></div>
            </div>
          </>) : null}

          
          {v.dogIsDress ? (<>
            {v.dressIsMain ? (<>
            <div style={css("padding:16px 22px 0;")}>
              <div style={css("background:linear-gradient(135deg,#EEF1FF,#F4F5F7); border-radius:20px; padding:24px; text-align:center;")}>
                {v.decoIs3d
                  ? (<div onMouseDown={v.onDragStart} onTouchStart={v.onDragStart} style={css(`width:100%; height:260px; background:url(${v.decoImage}) center/contain no-repeat; filter:drop-shadow(0 16px 28px rgba(59,91,254,.22)); cursor:grab; touch-action:none; ${v.fig3dRotate}`)}></div>)
                  : (<div style={css(`width:100%; height:260px; border-radius:16px; background:url(${v.decoImage}) center/contain no-repeat;`)}></div>)}
                <div style={css("font:700 14px Pretendard; margin-top:14px;")}>{v.decoCaption}</div>
                {v.decoIs3d ? (<div style={css("margin-top:6px; display:inline-flex; align-items:center; gap:5px; font:500 11px Pretendard; color:#8A8F98;")}><span className="msf" style={css("font-size:14px; color:#3B5BFE;")}>3d_rotation</span>드래그하면 돌아가요</div>) : null}
              </div>

              <div style={css("display:flex; gap:8px; margin-top:18px; overflow:hidden;")}>
                {(v.decorationTemplates || []).map((t, $i) => ($i === 0
                  ? (<span key={t.id} style={css("font:700 13px Pretendard; background:#1A1A1D; color:#fff; padding:9px 15px; border-radius:999px; flex:none;")}>{t.name}</span>)
                  : (<span key={t.id} style={css("font:600 13px Pretendard; background:#fff; border:1px solid #DfE2E6; padding:9px 15px; border-radius:999px; flex:none;")}>{t.name}</span>)
                ))}
              </div>

              <div style={css("display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-top:16px;")}>
                <div onClick={v.selectDeco('pink')} style={css(`background:#fff; border:${v.decoSel === 'pink' ? '2px solid #3B5BFE' : '1px solid #ECEEF1'}; border-radius:16px; padding:8px; cursor:pointer; ${v.decoSel === 'pink' ? 'box-shadow:0 6px 20px rgba(59,91,254,.12);' : ''}`)}><div style={css("aspect-ratio:1; border-radius:11px; overflow:hidden; position:relative;")}><div style={css("position:absolute; inset:0; background:url(/deco-pink.jpg) center/cover; filter:blur(16px); transform:scale(1.3);")}></div></div><div style={css("font:600 12px Pretendard; text-align:center; margin-top:8px;")}>분홍 저고리</div></div>
                <div onClick={v.selectDeco('navy')} style={css(`background:#fff; border:${v.decoSel === 'navy' ? '2px solid #3B5BFE' : '1px solid #ECEEF1'}; border-radius:16px; padding:8px; cursor:pointer; ${v.decoSel === 'navy' ? 'box-shadow:0 6px 20px rgba(59,91,254,.12);' : ''}`)}><div style={css("aspect-ratio:1; border-radius:11px; overflow:hidden; position:relative;")}><div style={css("position:absolute; inset:0; background:url(/deco-navy.jpg) center/cover; filter:blur(9px); transform:scale(1.2);")}></div></div><div style={css("font:600 12px Pretendard; text-align:center; margin-top:8px;")}>남색 도포</div></div>
                <div onClick={v.selectDeco('photobook')} style={css(`background:#fff; border:${v.decoSel === 'photobook' ? '2px solid #3B5BFE' : '1px solid #ECEEF1'}; border-radius:16px; padding:8px; position:relative; cursor:pointer;`)}><div style={css("aspect-ratio:1; border-radius:11px; background:linear-gradient(135deg,#E9D7B8,#CBB182); position:relative;")}><span className="msf" style={css("position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); font-size:30px; color:rgba(255,255,255,.7);")}>photo_album</span><div style={css("position:absolute; top:7px; right:7px; width:24px; height:24px; border-radius:50%; background:rgba(0,0,0,.4); display:flex; align-items:center; justify-content:center; color:#fff;")}><span className="msf" style={css("font-size:14px;")}>lock</span></div></div><div style={css("display:flex; align-items:center; justify-content:center; gap:5px; margin-top:8px;")}><span style={css("font:600 12px Pretendard;")}>포토북</span><span style={css("font:600 10px Pretendard; color:#3B5BFE; background:#EEF1FF; padding:2px 7px; border-radius:999px;")}>구매</span></div></div>
                <div onClick={v.selectDeco('figure')} style={css(`background:#fff; border:${v.decoSel === 'figure' ? '2px solid #3B5BFE' : '1px solid #ECEEF1'}; border-radius:16px; padding:8px; position:relative; cursor:pointer;`)}><div style={css("aspect-ratio:1; border-radius:11px; background:linear-gradient(135deg,#D7C0E9,#B088D0); position:relative;")}><span className="msf" style={css("position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); font-size:30px; color:rgba(255,255,255,.7);")}>deployed_code</span><div style={css("position:absolute; top:7px; right:7px; width:24px; height:24px; border-radius:50%; background:rgba(0,0,0,.4); display:flex; align-items:center; justify-content:center; color:#fff;")}><span className="msf" style={css("font-size:14px;")}>lock</span></div></div><div style={css("display:flex; align-items:center; justify-content:center; gap:5px; margin-top:8px;")}><span style={css("font:600 12px Pretendard;")}>3D 피규어</span><span style={css("font:600 10px Pretendard; color:#3B5BFE; background:#EEF1FF; padding:2px 7px; border-radius:999px;")}>구매</span></div></div>
              </div>

              <div style={css("display:flex; gap:10px; margin-top:18px;")}>
                <div onClick={v.dressApply} style={css("flex:1; background:#3B5BFE; color:#fff; font:700 15px Pretendard; text-align:center; padding:15px; border-radius:16px; box-shadow:0 10px 24px rgba(59,91,254,.28); cursor:pointer;")}>적용</div>
                <div style={css("width:54px; flex:none; background:#fff; border:1px solid #ECEEF1; display:flex; align-items:center; justify-content:center; border-radius:16px;")}><span className="msf" style={css("font-size:22px; color:#3B5BFE;")}>ios_share</span></div>
              </div>
            </div>
            </>) : null}
            {v.dressIsApplying ? (<>
              <div style={css("padding:0 22px; flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; min-height:420px;")}>
                <div style={css("position:relative; width:110px; height:110px;")}><div style={css("position:absolute; inset:0; border-radius:50%; border:5px solid #EEF1FF;")}></div><div style={css("position:absolute; inset:0; border-radius:50%; border:5px solid transparent; border-top-color:#3B5BFE; border-right-color:#3B5BFE; transform:rotate(48deg);")}></div><div style={css("position:absolute; inset:0; display:flex; align-items:center; justify-content:center; color:#3B5BFE;")}><span className="msf" style={css("font-size:42px;")}>checkroom</span></div></div>
                <div style={css("font:800 21px Pretendard; letter-spacing:-0.02em; margin-top:24px;")}>선택한 버전 적용 중...</div>
                <div style={css("font:500 14px Pretendard; color:#8A8F98; margin-top:8px;")}>체리에게 한복을 입혀보고 있어요</div>
                <div onClick={v.dressDone} style={css("margin-top:22px; background:#EEF1FF; color:#3B5BFE; font:700 15px Pretendard; padding:14px 28px; border-radius:16px; cursor:pointer;")}>결과 보기</div>
              </div>
            </>) : null}
            {v.dressIsResult ? (<>
              <div style={css("padding:16px 22px 0;")}>
                <div style={css("height:300px; border-radius:24px; background:linear-gradient(135deg,#EEF1FF,#F4F5F7); position:relative; box-shadow:0 12px 30px rgba(20,20,29,.12); overflow:hidden;")}>
                  <div style={css(`position:absolute; inset:16px 16px 40px; background:url(${v.decoImage}) center/contain no-repeat; ${v.decoIs3d ? 'filter:drop-shadow(0 14px 24px rgba(59,91,254,.22));' : ''}`)}></div>
                  <span style={css("position:absolute; bottom:14px; left:50%; transform:translateX(-50%); font:700 13px Pretendard; color:#1A1A1D;")}>{v.decoCaption}</span>
                </div>
                <div style={css("font:800 18px Pretendard; margin-top:16px; text-align:center;")}>완성! 잘 어울려요 🐕</div>
                <div style={css("display:flex; gap:10px; margin-top:16px;")}><div style={css("flex:1; background:#fff; border:1px solid #ECEEF1; border-radius:14px; padding:14px; text-align:center; box-shadow:0 4px 16px rgba(20,20,29,.05);")}><span className="msf" style={css("font-size:22px; color:#3B5BFE; display:block; margin-bottom:5px;")}>download</span><span style={css("font:600 13px Pretendard;")}>저장</span></div><div style={css("flex:1; background:#fff; border:1px solid #ECEEF1; border-radius:14px; padding:14px; text-align:center; box-shadow:0 4px 16px rgba(20,20,29,.05);")}><span className="msf" style={css("font-size:22px; color:#3B5BFE; display:block; margin-bottom:5px;")}>ios_share</span><span style={css("font:600 13px Pretendard;")}>공유</span></div></div>
                <div onClick={v.dressReset} style={css("margin-top:12px; background:#3B5BFE; color:#fff; font:700 15px Pretendard; text-align:center; padding:15px; border-radius:16px; box-shadow:0 10px 24px rgba(59,91,254,.28); cursor:pointer;")}>다른 테마 입혀보기</div>
              </div>
            </>) : null}
          </>) : null}
        </div>
      </>) : null}

    </div>

    
    {v.emgOpen ? (<>
      <div data-screen-label="응급" style={css("position:absolute; inset:0; z-index:45; background:#F4F5F7; display:flex; flex-direction:column;")}>
        <div style={css("height:50px; display:flex; align-items:center; justify-content:space-between; padding:0 26px 0 30px; flex:none;")}><span style={css("font:700 15px Pretendard;")}>9:41</span><span className="msr" style={css("display:flex; gap:7px; font-size:18px;")}><span>signal_cellular_alt</span><span>wifi</span><span>battery_full</span></span></div>

        
        {v.emgIsEntry ? (<>
          <div style={css("padding:4px 24px 8px; flex:none; display:flex; align-items:center; gap:12px;")}><div onClick={v.closeEmg} style={css("cursor:pointer;")}><span className="msr" style={css("font-size:24px;")}>close</span></div><span style={css("font:700 16px Pretendard;")}>응급 케어</span></div>
          <div style={css("flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:0 34px; text-align:center;")}>
            <div style={css("width:108px; height:108px; border-radius:50%; background:#FFF1EF; display:flex; align-items:center; justify-content:center; box-shadow:0 14px 34px rgba(255,107,92,.22);")}><span className="msf" style={css("font-size:54px; color:#FF6B5C;")}>emergency</span></div>
            <div style={css("font-size:26px; font-weight:800; letter-spacing:-0.02em; margin-top:26px;")}>우리 아이가 아파요</div>
            <div style={css("font:500 15px Pretendard; color:#8A8F98; margin-top:12px; line-height:1.55;")}>증상을 촬영하면 AI가 살펴보고,<br />가까운 병원을 안내해요.</div>
          </div>
          <div style={css("padding:0 24px 22px; flex:none;")}>
            <div onClick={v.emgToAttach} style={css("background:#FF6B5C; color:#fff; font:700 16px Pretendard; text-align:center; padding:17px; border-radius:18px; box-shadow:0 10px 24px rgba(255,107,92,.32); cursor:pointer;")}>증상 살펴보기</div>
            <div onClick={v.emgToList} style={css("margin-top:11px; background:#fff; border:1px solid #DfE2E6; color:#1A1A1D; font:700 16px Pretendard; text-align:center; padding:17px; border-radius:18px; cursor:pointer;")}>바로 병원 찾기</div>
          </div>
        </>) : null}

        
        {v.emgIsAttach ? (<>
          <div style={css("padding:4px 24px 8px; flex:none; display:flex; align-items:center; gap:12px;")}><div onClick={v.emgBackEntry} style={css("cursor:pointer;")}><span className="msr" style={css("font-size:24px;")}>arrow_back_ios_new</span></div><span style={css("font:700 16px Pretendard;")}>증상 첨부</span></div>
          <div className="scr" style={css("flex:1; overflow-y:auto; padding:6px 24px 16px;")}>
            <div style={css("display:flex; gap:10px;")}><div style={css("flex:1; height:130px; border-radius:18px; border:2px dashed #C7CAD0; background:#fff; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:8px;")}><span className="msr" style={css("font-size:30px; color:#8A8F98;")}>photo_camera</span><span style={css("font:600 12px Pretendard; color:#8A8F98;")}>촬영</span></div><div style={css("flex:1; height:130px; border-radius:18px; border:2px dashed #C7CAD0; background:#fff; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:8px;")}><span className="msr" style={css("font-size:30px; color:#8A8F98;")}>videocam</span><span style={css("font:600 12px Pretendard; color:#8A8F98;")}>영상</span></div><div style={css("flex:1; height:130px; border-radius:18px; background:linear-gradient(135deg,#F6D9A6,#E7B776); position:relative;")}><span style={css("position:absolute; bottom:8px; left:50%; transform:translateX(-50%); font:600 10px ui-monospace,monospace; color:rgba(138,94,34,.8);")}>PHOTO</span></div></div>
            <div style={css("font:600 13px Pretendard; color:#8A8F98; margin:20px 0 10px;")}>증상 부위</div>
            <div style={css("display:flex; gap:8px; flex-wrap:wrap;")}><span style={css("font:600 13px Pretendard; background:#1A1A1D; color:#fff; padding:9px 15px; border-radius:999px;")}>다리·발</span><span style={css("font:500 13px Pretendard; background:#fff; border:1px solid #DfE2E6; padding:9px 15px; border-radius:999px;")}>눈·귀</span><span style={css("font:500 13px Pretendard; background:#fff; border:1px solid #DfE2E6; padding:9px 15px; border-radius:999px;")}>피부</span><span style={css("font:500 13px Pretendard; background:#fff; border:1px solid #DfE2E6; padding:9px 15px; border-radius:999px;")}>소화기</span></div>
            <div style={css("font:600 13px Pretendard; color:#8A8F98; margin:20px 0 10px;")}>빠른 체크</div>
            <div style={css("display:flex; gap:8px; flex-wrap:wrap;")}><span style={css("display:inline-flex; align-items:center; gap:5px; font:600 13px Pretendard; background:#FFF1EF; color:#E0533F; padding:8px 13px; border-radius:999px;")}><span className="msf" style={css("font-size:14px;")}>check</span>절뚝임</span><span style={css("font:500 13px Pretendard; background:#fff; border:1px solid #DfE2E6; padding:8px 13px; border-radius:999px;")}>구토</span><span style={css("font:500 13px Pretendard; background:#fff; border:1px solid #DfE2E6; padding:8px 13px; border-radius:999px;")}>설사</span><span style={css("font:500 13px Pretendard; background:#fff; border:1px solid #DfE2E6; padding:8px 13px; border-radius:999px;")}>기력없음</span><span style={css("font:500 13px Pretendard; background:#fff; border:1px solid #DfE2E6; padding:8px 13px; border-radius:999px;")}>호흡 이상</span></div>
            <div style={css("font:600 13px Pretendard; color:#8A8F98; margin:20px 0 10px;")}>증상 메모 <span style={css("color:#C7CAD0;")}>· 선택</span></div>
            <div style={css("background:#fff; border:1px solid #ECEEF1; border-radius:14px; padding:14px 16px; font:500 14px Pretendard; color:#8A8F98; min-height:70px;")}>산책 후 오른쪽 뒷다리를 들고 걸어요…</div>
          </div>
          <div style={css("padding:6px 24px 22px; flex:none;")}><div onClick={v.emgToAnalyzing} style={css("background:#FF6B5C; color:#fff; font:700 16px Pretendard; text-align:center; padding:17px; border-radius:18px; box-shadow:0 10px 24px rgba(255,107,92,.32); cursor:pointer;")}>AI 분석 시작</div></div>
        </>) : null}

        
        {v.emgIsAnalyzing ? (<>
          <div style={css("flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:0 40px; text-align:center;")}>
            <div style={css("position:relative; width:120px; height:120px;")}><div style={css("position:absolute; inset:0; border-radius:50%; border:5px solid #FFE3DD;")}></div><div style={css("position:absolute; inset:0; border-radius:50%; border:5px solid transparent; border-top-color:#FF6B5C; border-right-color:#FF6B5C; transform:rotate(48deg);")}></div><div style={css("position:absolute; inset:0; display:flex; align-items:center; justify-content:center; color:#FF6B5C;")}><span className="msf" style={css("font-size:46px;")}>stethoscope</span></div></div>
            <div style={css("font-size:22px; font-weight:800; letter-spacing:-0.02em; margin-top:28px;")}>체리 상태를 살펴보는 중...</div>
            <div style={css("font:500 14px Pretendard; color:#8A8F98; margin-top:8px;")}>사진과 증상을 함께 분석하고 있어요</div>
            <div onClick={v.emgToResult} style={css("margin-top:24px; background:#FFF1EF; color:#E0533F; font:700 15px Pretendard; padding:14px 28px; border-radius:16px; cursor:pointer;")}>결과 보기</div>
          </div>
        </>) : null}

        
        {v.emgIsResult ? (<>
          <div style={css("padding:4px 24px 8px; flex:none; display:flex; align-items:center; gap:12px;")}><div onClick={v.emgBackAttach} style={css("cursor:pointer;")}><span className="msr" style={css("font-size:24px;")}>arrow_back_ios_new</span></div><span style={css("font:700 16px Pretendard;")}>AI 분석 결과</span></div>
          <div className="scr" style={css("flex:1; overflow-y:auto; padding:6px 24px 16px;")}>
            <div style={css("background:#E0533F; border-radius:16px; padding:15px 16px; display:flex; align-items:center; gap:11px; box-shadow:0 10px 24px rgba(224,83,63,.28);")}><span className="msf" style={css("font-size:26px; color:#fff;")}>e911_emergency</span><div><div style={css("font:800 15px Pretendard; color:#fff;")}>지금 즉시 동물병원에 방문하세요</div><div style={css("font:500 12px Pretendard; color:rgba(255,255,255,.9); margin-top:2px;")}>통증·보행 이상 신호가 감지됐어요</div></div></div>
            <div style={css("margin-top:12px; background:#FFF1EF; border:1px solid #FFD8D1; border-radius:14px; padding:13px 15px; display:flex; gap:9px;")}><span className="msf" style={css("font-size:18px; color:#FF6B5C; flex:none;")}>info</span><span style={css("font:400 12px Pretendard; color:#A24433; line-height:1.5;")}>AI 참고용 정보이며 진단이 아닙니다. 반드시 수의사 진료를 받으세요.</span></div>
            <div style={css("font:800 16px Pretendard; margin:18px 0 10px;")}>추정 가능성 <span style={css("font:500 11px Pretendard; color:#8A8F98;")}>· 참고용</span></div>
            <div style={css("background:#fff; border-radius:16px; padding:4px 16px; box-shadow:0 4px 16px rgba(20,20,29,.05);")}>
              {(v.symptomChecks || []).map((s, $i) => (
              <div key={$i} style={css(`display:flex; align-items:center; justify-content:space-between; padding:13px 0; ${$i < (v.symptomChecks || []).length - 1 ? "border-bottom:1px solid #ECEEF1;" : ""}`)}><span style={css("font:600 14px Pretendard;")}>{s.ai_result_text}</span><span style={css("font:500 12px Pretendard; color:#8A8F98;")}>{s.severity}</span></div>
              ))}
            </div>
            <div style={css("font:800 16px Pretendard; margin:18px 0 10px;")}>집에서 할 수 있는 임시 대처</div>
            <div style={css("display:flex; flex-direction:column; gap:9px;")}>
              <div style={css("background:#fff; border-radius:14px; padding:13px 15px; box-shadow:0 4px 16px rgba(20,20,29,.05); display:flex; gap:10px; align-items:center;")}><span className="msf" style={css("font-size:19px; color:#3B5BFE;")}>self_improvement</span><span style={css("font:500 13px Pretendard; color:#5A5F68;")}>무리한 보행·점프를 멈추고 안정시켜요</span></div>
              <div style={css("background:#fff; border-radius:14px; padding:13px 15px; box-shadow:0 4px 16px rgba(20,20,29,.05); display:flex; gap:10px; align-items:center;")}><span className="msf" style={css("font-size:19px; color:#3B5BFE;")}>search</span><span style={css("font:500 13px Pretendard; color:#5A5F68;")}>발바닥에 상처·가시가 있는지 살펴봐요</span></div>
            </div>
          </div>
          <div style={css("padding:6px 24px 22px; flex:none;")}><div onClick={v.emgToList} style={css("background:#FF6B5C; color:#fff; font:700 16px Pretendard; text-align:center; padding:17px; border-radius:18px; box-shadow:0 10px 24px rgba(255,107,92,.32); cursor:pointer;")}>가까운 병원 보기</div></div>
        </>) : null}

        
        {v.emgIsList ? (<>
          <div style={css("padding:4px 24px 8px; flex:none; display:flex; align-items:center; gap:12px;")}><div onClick={v.emgBackResult} style={css("cursor:pointer;")}><span className="msr" style={css("font-size:24px;")}>arrow_back_ios_new</span></div><span style={css("font:700 16px Pretendard;")}>가까운 동물병원</span></div>
          <div className="scr" style={css("flex:1; overflow-y:auto; padding:6px 24px 16px;")}>
            {v.hasSafety ? (<div style={css("margin-bottom:12px; background:#FFF1EF; border-radius:14px; padding:12px 15px; display:flex; align-items:center; gap:9px;")}><span className="msf" style={css("font-size:18px; color:#FF6B5C;")}>local_hospital</span><span style={css("font:600 12px Pretendard; color:#5A5F68;")}>전주 영업 중 동물병원 {v.safetyHospitalCount}곳 · 최근접 {v.safetyNearestHospital}</span></div>) : null}
            <div style={css("display:flex; flex-direction:column; gap:11px;")}>
              <div onClick={v.emgToDetail} style={css("background:#fff; border:2px solid #FF6B5C; border-radius:16px; padding:15px; box-shadow:0 6px 20px rgba(255,107,92,.12); cursor:pointer;")}>
                <div style={css("display:flex; align-items:center; justify-content:space-between;")}><div style={css("font:700 15px Pretendard;")}>전주24시동물메디컬센터</div><span style={css("font:500 11px Pretendard; color:#fff; background:#E0533F; padding:5px 10px; border-radius:999px;")}>24시</span></div>
                <div style={css("display:flex; align-items:center; gap:10px; margin-top:8px;")}><span style={css("font:400 12px Pretendard; color:#8A8F98;")}>0.4km · 차량 3분</span><span style={css("display:inline-flex; align-items:center; gap:3px; font:500 11px Pretendard; color:#22A565;")}><span style={css("width:6px; height:6px; border-radius:50%; background:#22A565;")}></span>영업 중</span></div>
              </div>
              <div onClick={v.emgToDetail} style={css("background:#fff; border:1px solid #ECEEF1; border-radius:16px; padding:15px; box-shadow:0 4px 16px rgba(20,20,29,.05); cursor:pointer;")}>
                <div style={css("display:flex; align-items:center; justify-content:space-between;")}><div style={css("font:700 15px Pretendard;")}>전주중앙동물메디컬</div><span className="msr" style={css("font-size:20px; color:#C7CAD0;")}>chevron_right</span></div>
                <div style={css("display:flex; align-items:center; gap:10px; margin-top:8px;")}><span style={css("font:400 12px Pretendard; color:#8A8F98;")}>0.6km · 도보 8분</span><span style={css("display:inline-flex; align-items:center; gap:3px; font:500 11px Pretendard; color:#22A565;")}><span style={css("width:6px; height:6px; border-radius:50%; background:#22A565;")}></span>영업 중</span></div>
              </div>
              <div onClick={v.emgToDetail} style={css("background:#fff; border:1px solid #ECEEF1; border-radius:16px; padding:15px; box-shadow:0 4px 16px rgba(20,20,29,.05); cursor:pointer;")}>
                <div style={css("display:flex; align-items:center; justify-content:space-between;")}><div style={css("font:700 15px Pretendard;")}>한옥마을 동물병원</div><span className="msr" style={css("font-size:20px; color:#C7CAD0;")}>chevron_right</span></div>
                <div style={css("display:flex; align-items:center; gap:10px; margin-top:8px;")}><span style={css("font:400 12px Pretendard; color:#8A8F98;")}>1.1km · 차량 5분</span><span style={css("display:inline-flex; align-items:center; gap:3px; font:500 11px Pretendard; color:#E0533F;")}><span style={css("width:6px; height:6px; border-radius:50%; background:#E0533F;")}></span>마감</span></div>
              </div>
            </div>
            <div style={css("font:400 11px Pretendard; color:#A9A8A2; margin-top:14px;")}>데이터: 행정안전부 전국 동물병원 표준데이터</div>
          </div>
        </>) : null}

        
        {v.emgIsDetail ? (<>
          <div style={css("padding:4px 24px 8px; flex:none; display:flex; align-items:center; gap:12px;")}><div onClick={v.emgBackList} style={css("cursor:pointer;")}><span className="msr" style={css("font-size:24px;")}>arrow_back_ios_new</span></div><span style={css("font:700 16px Pretendard;")}>병원 정보</span></div>
          <div className="scr" style={css("flex:1; overflow-y:auto; padding:6px 24px 16px;")}>
            <div style={css("display:flex; align-items:flex-start; justify-content:space-between;")}><div><div style={css("font:800 21px Pretendard; letter-spacing:-0.02em;")}>전주24시동물메디컬센터</div><div style={css("font:500 13px Pretendard; color:#8A8F98; margin-top:4px;")}>전주 완산구 · 응급 진료</div></div><span style={css("font:500 11px Pretendard; color:#fff; background:#E0533F; padding:6px 11px; border-radius:999px;")}>24시</span></div>
            <div style={css("margin-top:14px; background:#E5F6EE; border-radius:14px; padding:14px 16px; display:flex; align-items:center; gap:10px;")}><span style={css("width:8px; height:8px; border-radius:50%; background:#22A565;")}></span><span style={css("font:700 14px Pretendard; color:#1B8A55;")}>지금 영업 중</span><span style={css("font:500 13px Pretendard; color:#5A5F68;")}>· 24시간 진료</span></div>
            <div style={css("margin-top:14px; background:#fff; border-radius:16px; padding:4px 16px; box-shadow:0 4px 16px rgba(20,20,29,.05);")}>
              <div style={css("display:flex; align-items:center; justify-content:space-between; padding:13px 0; border-bottom:1px solid #ECEEF1;")}><span style={css("font:500 14px Pretendard; color:#8A8F98;")}>영업시간</span><span style={css("font:700 14px Pretendard;")}>24시간 (연중무휴)</span></div>
              <div style={css("display:flex; align-items:center; justify-content:space-between; padding:13px 0; border-bottom:1px solid #ECEEF1;")}><span style={css("font:500 14px Pretendard; color:#8A8F98;")}>거리</span><span style={css("font:700 14px Pretendard;")}>0.4km · 차량 3분</span></div>
              <div style={css("display:flex; align-items:center; justify-content:space-between; padding:13px 0;")}><span style={css("font:500 14px Pretendard; color:#8A8F98;")}>전화</span><span style={css("font:700 14px Pretendard; color:#3B5BFE;")}>063-000-0000</span></div>
            </div>
            <div style={css("font:400 11px Pretendard; color:#A9A8A2; margin-top:14px;")}>데이터: 행정안전부 전국 동물병원 표준데이터</div>
          </div>
          <div style={css("padding:6px 24px 22px; flex:none; display:flex; gap:10px;")}><div style={css("flex:1; background:#FF6B5C; color:#fff; font:700 15px Pretendard; text-align:center; padding:16px; border-radius:16px; display:flex; align-items:center; justify-content:center; gap:7px;")}><span className="msf" style={css("font-size:18px;")}>call</span>전화 걸기</div><div style={css("flex:1; background:#fff; border:1px solid #ECEEF1; color:#1A1A1D; font:700 15px Pretendard; text-align:center; padding:16px; border-radius:16px; display:flex; align-items:center; justify-content:center; gap:7px;")}><span className="msf" style={css("font-size:18px; color:#3B5BFE;")}>directions</span>길찾기</div></div>
        </>) : null}

      </div>
    </>) : null}

    
    {v.isLogin ? (<>
      <div data-screen-label="로그인" style={css("position:absolute; inset:0; z-index:40; background:#F4F5F7; display:flex; flex-direction:column;")}>
        <div style={css("height:50px; display:flex; align-items:center; justify-content:space-between; padding:0 26px 0 30px; flex:none;")}><span style={css("font:700 15px Pretendard;")}>9:41</span><span className="msr" style={css("display:flex; gap:7px; font-size:18px;")}><span>signal_cellular_alt</span><span>wifi</span><span>battery_full</span></span></div>
        <div style={css("flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:0 40px; text-align:center;")}>
          <div style={css("width:108px; height:108px; border-radius:32px; background:#3B5BFE; display:flex; align-items:center; justify-content:center; box-shadow:0 16px 40px rgba(59,91,254,.35);")}><svg width="54" height="54" viewbox="0 0 24 24" fill="#fff"><ellipse cx="12" cy="16" rx="5.5" ry="4.5"></ellipse><ellipse cx="5.3" cy="10" rx="2.3" ry="2.9"></ellipse><ellipse cx="9.9" cy="6.4" rx="2.3" ry="2.9"></ellipse><ellipse cx="14.1" cy="6.4" rx="2.3" ry="2.9"></ellipse><ellipse cx="18.7" cy="10" rx="2.3" ry="2.9"></ellipse></svg></div>
          <div style={css("font-size:36px; font-weight:800; letter-spacing:-0.03em; margin-top:26px;")}>발자국</div>
          <div style={css("font:500 15px Pretendard; color:#8A8F98; margin-top:12px; line-height:1.5;")}>반려견과 함께, 어디든.<br />우리 아이에게 맞는 동선을 AI가 그려요.</div>
        </div>
        <div style={css("padding:0 28px 20px; flex:none;")}>
          <div onClick={v.startApp} style={css("background:#FEE500; color:#1A1A1D; font:700 16px Pretendard; text-align:center; padding:16px; border-radius:14px; display:flex; align-items:center; justify-content:center; gap:8px; cursor:pointer;")}><span className="msf" style={css("font-size:20px;")}>chat_bubble</span>카카오로 시작</div>
          <div onClick={v.startApp} style={css("margin-top:11px; background:#fff; border:1px solid #DfE2E6; color:#1A1A1D; font:700 16px Pretendard; text-align:center; padding:16px; border-radius:14px; cursor:pointer;")}>게스트로 둘러보기</div>
          <div style={css("text-align:center; font:400 11px Pretendard; color:#A9A8A2; margin-top:22px;")}>문화체육관광부 공공데이터 제공</div>
        </div>
      </div>
    </>) : null}

    
    {v.isName ? (<>
      <div data-screen-label="이름 입력" style={css("position:absolute; inset:0; z-index:40; background:#F4F5F7; display:flex; flex-direction:column;")}>
        <div style={css("height:50px; display:flex; align-items:center; justify-content:space-between; padding:0 26px 0 30px; flex:none;")}><span style={css("font:700 15px Pretendard;")}>9:41</span><span className="msr" style={css("display:flex; gap:7px; font-size:18px;")}><span>signal_cellular_alt</span><span>wifi</span><span>battery_full</span></span></div>
        <div style={css("padding:8px 28px 0; flex:none; display:flex; align-items:center; gap:14px;")}><div onClick={v.backLogin} style={css("cursor:pointer;")}><span className="msr" style={css("font-size:24px;")}>arrow_back_ios_new</span></div></div>
        <div style={css("flex:1; padding:24px 28px 0;")}>
          <div style={css("font-size:27px; font-weight:800; letter-spacing:-0.02em; line-height:1.25;")}>반려견의 이름은<br />무엇인가요?</div>
          <div style={css("font:500 15px Pretendard; color:#8A8F98; margin-top:10px;")}>발자국이 이 이름으로 동선·페르소나를 만들어요.</div>
          <div style={css("margin-top:32px; display:flex; flex-direction:column; align-items:center;")}>
            <div style={css("width:96px; height:96px; border-radius:50%; background:linear-gradient(135deg,#5B79FF,#3B5BFE); display:flex; align-items:center; justify-content:center; box-shadow:0 14px 30px rgba(59,91,254,.30);")}><svg width="48" height="48" viewbox="0 0 24 24" fill="#fff"><ellipse cx="12" cy="16" rx="5.5" ry="4.5"></ellipse><ellipse cx="5.3" cy="10" rx="2.3" ry="2.9"></ellipse><ellipse cx="9.9" cy="6.4" rx="2.3" ry="2.9"></ellipse><ellipse cx="14.1" cy="6.4" rx="2.3" ry="2.9"></ellipse><ellipse cx="18.7" cy="10" rx="2.3" ry="2.9"></ellipse></svg></div>
          </div>
          <div style={css("margin-top:28px; font:600 13px Pretendard; color:#8A8F98; margin-bottom:8px;")}>반려견 이름</div>
          <input value={v.petName} onChange={v.setPetName} placeholder="이름을 입력해주세요" style={css("width:100%; box-sizing:border-box; background:#fff; border:2px solid #3B5BFE; border-radius:14px; padding:15px 16px; font:700 17px Pretendard; color:#1A1A1D; outline:none; box-shadow:0 8px 22px rgba(59,91,254,.12);")} />
          <div style={css("margin-top:14px; background:#EEF1FF; border-radius:12px; padding:12px 15px; display:flex; align-items:center; gap:9px;")}><span className="msf" style={css("font-size:18px; color:#3B5BFE;")}>info</span><span style={css("font:500 12px Pretendard; color:#5A5F68;")}>이름은 나중에 프로필에서 바꿀 수 있어요.</span></div>
        </div>
        <div style={css("padding:14px 28px 22px; flex:none;")}><div onClick={v.goMethod} style={css("background:#3B5BFE; color:#fff; font:700 16px Pretendard; text-align:center; padding:17px; border-radius:18px; box-shadow:0 10px 24px rgba(59,91,254,.28); cursor:pointer;")}>다음</div></div>
      </div>
    </>) : null}

    
    {v.isMethod ? (<>
      <div data-screen-label="시작 방법" style={css("position:absolute; inset:0; z-index:40; background:#F4F5F7; display:flex; flex-direction:column;")}>
        <div style={css("height:50px; display:flex; align-items:center; justify-content:space-between; padding:0 26px 0 30px; flex:none;")}><span style={css("font:700 15px Pretendard;")}>9:41</span><span className="msr" style={css("display:flex; gap:7px; font-size:18px;")}><span>signal_cellular_alt</span><span>wifi</span><span>battery_full</span></span></div>
        <div style={css("padding:8px 28px 0; flex:none; display:flex; align-items:center; gap:14px;")}><div onClick={v.backLogin} style={css("cursor:pointer;")}><span className="msr" style={css("font-size:24px;")}>arrow_back_ios_new</span></div><div style={css("flex:1; height:6px; background:#ECEEF1; border-radius:999px; overflow:hidden;")}><div style={css("width:25%; height:100%; background:#3B5BFE; border-radius:999px;")}></div></div><span style={css("font:600 13px Pretendard; color:#8A8F98;")}>1/4</span></div>
        <div style={css("flex:1; padding:30px 28px 0;")}>
          <div style={css("font-size:26px; font-weight:800; letter-spacing:-0.02em;")}>어떻게 시작할까요?</div>
          <div style={css("font:500 14px Pretendard; color:#8A8F98; margin-top:10px;")}>사진 한 장이면 견종까지 자동으로 채워드려요.</div>
          <div onClick={v.goUpload} style={css("margin-top:28px; background:#fff; border:2px solid #3B5BFE; border-radius:22px; padding:22px; box-shadow:0 10px 30px rgba(59,91,254,.14); cursor:pointer;")}><div style={css("width:52px; height:52px; border-radius:16px; background:#EEF1FF; color:#3B5BFE; display:flex; align-items:center; justify-content:center;")}><span className="msr" style={css("font-size:28px;")}>photo_camera</span></div><div style={css("font:700 19px Pretendard; margin-top:16px;")}>사진으로 빠르게</div><div style={css("font:500 14px Pretendard; color:#8A8F98; margin-top:6px; line-height:1.5;")}>AI가 견종을 인식하고 프로필을 채워줘요.</div></div>
          <div onClick={v.goProfile} style={css("margin-top:16px; background:#fff; border:1px solid #ECEEF1; border-radius:22px; padding:22px; cursor:pointer;")}><div style={css("width:52px; height:52px; border-radius:16px; background:#F4F5F7; color:#8A8F98; display:flex; align-items:center; justify-content:center;")}><span className="msr" style={css("font-size:28px;")}>edit_note</span></div><div style={css("font:700 19px Pretendard; margin-top:16px;")}>직접 입력할게요</div><div style={css("font:500 14px Pretendard; color:#8A8F98; margin-top:6px; line-height:1.5;")}>견종·체중·나이·성향을 하나씩 입력해요.</div></div>
        </div>
      </div>
    </>) : null}

    
    {v.isUpload ? (<>
      <div data-screen-label="사진 업로드" style={css("position:absolute; inset:0; z-index:40; background:#F4F5F7; display:flex; flex-direction:column;")}>
        <div style={css("height:50px; display:flex; align-items:center; justify-content:space-between; padding:0 26px 0 30px; flex:none;")}><span style={css("font:700 15px Pretendard;")}>9:41</span><span className="msr" style={css("display:flex; gap:7px; font-size:18px;")}><span>signal_cellular_alt</span><span>wifi</span><span>battery_full</span></span></div>
        <div style={css("padding:8px 28px 0; flex:none; display:flex; align-items:center; gap:14px;")}><div onClick={v.backMethod} style={css("cursor:pointer;")}><span className="msr" style={css("font-size:24px;")}>arrow_back_ios_new</span></div><div style={css("flex:1; height:6px; background:#ECEEF1; border-radius:999px; overflow:hidden;")}><div style={css("width:50%; height:100%; background:#3B5BFE; border-radius:999px;")}></div></div><span style={css("font:600 13px Pretendard; color:#8A8F98;")}>2/4</span></div>
        <div style={css("flex:1; padding:24px 28px 0;")}>
          <div style={css("font-size:24px; font-weight:800; letter-spacing:-0.02em;")}>{v.petName} 사진을 올려주세요</div>
          <div style={css("font:500 14px Pretendard; color:#8A8F98; margin-top:10px;")}>정면 얼굴이 잘 보이면 인식률이 높아요.</div>
          <label htmlFor="petPhotoInput" style={css(`margin-top:24px; height:300px; border-radius:24px; border:2px dashed #C7CAD0; background:linear-gradient(135deg,#FBEAC9,#F3D199); display:flex; flex-direction:column; align-items:center; justify-content:center; gap:14px; cursor:pointer; overflow:hidden; ${v.photoStyle}`)}>{v.noPhoto ? (<><div style={css("width:64px; height:64px; border-radius:20px; background:rgba(255,255,255,.7); display:flex; align-items:center; justify-content:center; color:#C68A3A;")}><span className="msr" style={css("font-size:34px;")}>add_a_photo</span></div><div style={css("font:700 15px Pretendard; color:#8A5E22;")}>사진 촬영 · 앨범에서 선택</div></>) : null}</label>
          <input id="petPhotoInput" type="file" accept="image/*" onChange={v.onPhoto} style={css("display:none;")} />
          <div style={css("font:600 13px Pretendard; color:#8A8F98; margin:22px 0 12px;")}>최근 사진</div>
          <div style={css("display:flex; gap:10px;")}><div onClick={v.goBreed} style={css("flex:1; aspect-ratio:1; border-radius:14px; background:linear-gradient(135deg,#F6D9A6,#E9B873); cursor:pointer;")}></div><div style={css("flex:1; aspect-ratio:1; border-radius:14px; background:linear-gradient(135deg,#EAD7C0,#D8B894);")}></div><div style={css("flex:1; aspect-ratio:1; border-radius:14px; background:linear-gradient(135deg,#F3E1C2,#E5C896);")}></div><div style={css("flex:1; aspect-ratio:1; border-radius:14px; background:linear-gradient(135deg,#F8DEB5,#EFC07A);")}></div></div>
        </div>
        <div style={css("padding:14px 28px 22px; flex:none;")}><div onClick={v.goBreed} style={css("background:#3B5BFE; color:#fff; font:700 16px Pretendard; text-align:center; padding:17px; border-radius:18px; box-shadow:0 10px 24px rgba(59,91,254,.28); cursor:pointer;")}>AI 견종 분석 시작</div></div>
      </div>
    </>) : null}

    
    {v.isBreed ? (<>
      <div data-screen-label="견종 인식" style={css("position:absolute; inset:0; z-index:40; background:#F4F5F7; display:flex; flex-direction:column;")}>
        <div style={css("height:50px; display:flex; align-items:center; justify-content:space-between; padding:0 26px 0 30px; flex:none;")}><span style={css("font:700 15px Pretendard;")}>9:41</span><span className="msr" style={css("display:flex; gap:7px; font-size:18px;")}><span>signal_cellular_alt</span><span>wifi</span><span>battery_full</span></span></div>
        <div style={css("padding:8px 28px 0; flex:none; display:flex; align-items:center; gap:14px;")}><div onClick={v.backUpload} style={css("cursor:pointer;")}><span className="msr" style={css("font-size:24px;")}>arrow_back_ios_new</span></div><div style={css("flex:1; height:6px; background:#ECEEF1; border-radius:999px; overflow:hidden;")}><div style={css("width:75%; height:100%; background:#3B5BFE; border-radius:999px;")}></div></div><span style={css("font:600 13px Pretendard; color:#8A8F98;")}>3/4</span></div>
        <div style={css("flex:1; padding:18px 28px 0; overflow-y:auto;")} className="scr">
          <div style={css("height:300px; border-radius:20px; background:url(/pet-breed.png) center/contain no-repeat;")}></div>
          <div style={css("display:inline-flex; align-items:center; gap:6px; font:700 12px Pretendard; color:#3B5BFE; background:#EEF1FF; padding:7px 13px; border-radius:999px; margin-top:18px;")}><span className="msf" style={css("font-size:15px;")}>auto_awesome</span>AI 분석 완료</div>
          <div style={css("display:flex; align-items:flex-end; justify-content:space-between; margin-top:14px;")}><div style={css("font-size:26px; font-weight:800; letter-spacing:-0.02em;")}>{v.predictions[0]?.candidate_breed || '골든 리트리버'}</div><div style={css("font:800 22px Pretendard; color:#3B5BFE;")}>{v.predictions[0] ? Math.round(v.predictions[0].similarity * 100) : 96}<span style={css("font-size:14px;")}>% 일치</span></div></div>
          <div style={css("margin-top:8px; height:8px; background:#ECEEF1; border-radius:999px; overflow:hidden;")}><div style={css(`width:${v.predictions[0] ? Math.round(v.predictions[0].similarity * 100) : 96}%; height:100%; background:#3B5BFE; border-radius:999px;`)}></div></div>
          <div style={css("font:600 13px Pretendard; color:#8A8F98; margin:22px 0 12px;")}>품종 특성 · 자동 안내</div>
          <div style={css("display:flex; gap:8px; flex-wrap:wrap;")}>
            <span style={css("display:inline-flex; align-items:center; gap:5px; font:600 13px Pretendard; background:#fff; border:1px solid #ECEEF1; padding:9px 14px; border-radius:999px;")}><span className="msr" style={css("font-size:16px; color:#3B5BFE;")}>straighten</span>대형견</span>
            <span style={css("display:inline-flex; align-items:center; gap:5px; font:600 13px Pretendard; background:#fff; border:1px solid #ECEEF1; padding:9px 14px; border-radius:999px;")}><span className="msr" style={css("font-size:16px; color:#3B5BFE;")}>directions_run</span>활동량 높음</span>
            <span style={css("display:inline-flex; align-items:center; gap:5px; font:600 13px Pretendard; background:#fff; border:1px solid #ECEEF1; padding:9px 14px; border-radius:999px;")}><span className="msr" style={css("font-size:16px; color:#FF6B5C;")}>sunny</span>더위 취약</span>
            <span style={css("display:inline-flex; align-items:center; gap:5px; font:600 13px Pretendard; background:#fff; border:1px solid #ECEEF1; padding:9px 14px; border-radius:999px;")}><span className="msr" style={css("font-size:16px; color:#3B5BFE;")}>cleaning_services</span>털빠짐 많음</span>
          </div>
          <div style={css("margin-top:16px; background:#fff; border-radius:16px; padding:16px; font:500 14px Pretendard; color:#5A5F68; line-height:1.6; box-shadow:0 4px 16px rgba(20,20,29,.05);")}>사람을 좋아하는 사교형이에요. 여름엔 <b style={css("color:#FF6B5C;")}>폭염 동선</b>을 피해 그늘·실내 위주로 추천할게요.</div>
        </div>
        <div style={css("padding:16px 28px 22px; flex:none; display:flex; gap:10px;")}><div onClick={v.backUpload} style={css("flex:none; background:#fff; border:1px solid #DfE2E6; color:#1A1A1D; font:700 15px Pretendard; text-align:center; padding:16px 20px; border-radius:18px; cursor:pointer;")}>다른 견종</div><div onClick={v.goProfile} style={css("flex:1; background:#3B5BFE; color:#fff; font:700 15px Pretendard; text-align:center; padding:16px; border-radius:18px; box-shadow:0 10px 24px rgba(59,91,254,.28); cursor:pointer;")}>맞아요, 계속</div></div>
      </div>
    </>) : null}

    
    {v.isProfile ? (<>
      <div data-screen-label="프로필 입력" style={css("position:absolute; inset:0; z-index:40; background:#F4F5F7; display:flex; flex-direction:column;")}>
        <div style={css("height:50px; display:flex; align-items:center; justify-content:space-between; padding:0 26px 0 30px; flex:none;")}><span style={css("font:700 15px Pretendard;")}>9:41</span><span className="msr" style={css("display:flex; gap:7px; font-size:18px;")}><span>signal_cellular_alt</span><span>wifi</span><span>battery_full</span></span></div>
        <div style={css("padding:8px 28px 0; flex:none; display:flex; align-items:center; gap:14px;")}><div onClick={v.backBreed} style={css("cursor:pointer;")}><span className="msr" style={css("font-size:24px;")}>arrow_back_ios_new</span></div><div style={css("flex:1; height:6px; background:#ECEEF1; border-radius:999px; overflow:hidden;")}><div style={css("width:100%; height:100%; background:#3B5BFE; border-radius:999px;")}></div></div><span style={css("font:600 13px Pretendard; color:#8A8F98;")}>4/4</span></div>
        <div style={css("flex:1; padding:22px 28px 0; overflow-y:auto;")} className="scr">
          <div style={css("font-size:24px; font-weight:800; letter-spacing:-0.02em;")}>{v.petName}를 알려주세요</div>
          <div style={css("margin-top:20px;")}><div style={css("font:600 13px Pretendard; color:#8A8F98; margin-bottom:8px;")}>견종</div><div style={css("background:#fff; border:1px solid #ECEEF1; border-radius:14px; padding:13px 16px; display:flex; align-items:center; justify-content:space-between;")}><span style={css("font:700 16px Pretendard;")}>골든 리트리버</span><span style={css("display:inline-flex; align-items:center; gap:4px; font:600 11px Pretendard; color:#3B5BFE; background:#EEF1FF; padding:5px 9px; border-radius:999px;")}><span className="msf" style={css("font-size:13px;")}>auto_awesome</span>AI 인식됨</span></div></div>
          <div style={css("display:flex; gap:12px; margin-top:14px;")}><div style={css("flex:1;")}><div style={css("font:600 13px Pretendard; color:#8A8F98; margin-bottom:8px;")}>체중</div><div style={css("background:#fff; border:1px solid #ECEEF1; border-radius:14px; padding:13px 16px;")}><span style={css("font:700 16px Pretendard;")}>28</span><span style={css("font:600 13px Pretendard; color:#8A8F98;")}> kg</span></div></div><div style={css("flex:1;")}><div style={css("font:600 13px Pretendard; color:#8A8F98; margin-bottom:8px;")}>나이</div><div style={css("background:#fff; border:1px solid #ECEEF1; border-radius:14px; padding:13px 16px;")}><span style={css("font:700 16px Pretendard;")}>3</span><span style={css("font:600 13px Pretendard; color:#8A8F98;")}> 살</span></div></div></div>
          <div style={css("margin-top:18px;")}><div style={css("display:flex; align-items:center; gap:6px; font:600 13px Pretendard; color:#8A8F98; margin-bottom:10px;")}>강아지 특징 <span style={css("display:inline-flex; align-items:center; gap:3px; font:600 11px Pretendard; color:#3B5BFE; background:#EEF1FF; padding:4px 9px; border-radius:999px;")}><span className="msf" style={css("font-size:12px;")}>auto_awesome</span>견종 분석</span></div><div style={css("display:flex; gap:8px; flex-wrap:wrap;")}><span style={css("display:inline-flex; align-items:center; gap:5px; font:600 13px Pretendard; background:#EEF1FF; color:#3B5BFE; padding:9px 14px; border-radius:999px;")}><span className="msf" style={css("font-size:15px;")}>directions_run</span>활동량 많음</span><span style={css("display:inline-flex; align-items:center; gap:5px; font:600 13px Pretendard; background:#EEF1FF; color:#3B5BFE; padding:9px 14px; border-radius:999px;")}><span className="msf" style={css("font-size:15px;")}>favorite</span>사람 좋아함</span><span style={css("display:inline-flex; align-items:center; gap:5px; font:600 13px Pretendard; background:#FFF1EF; color:#FF6B5C; padding:9px 14px; border-radius:999px;")}><span className="msf" style={css("font-size:15px;")}>sunny</span>더위 취약</span></div></div>
          <div style={css("margin-top:20px; background:#EEF1FF; border-radius:14px; padding:14px 16px; display:flex; align-items:center; gap:10px;")}><span className="msf" style={css("font-size:20px; color:#3B5BFE;")}>bolt</span><span style={css("font:600 13px Pretendard; color:#1A1A1D;")}>자동 분류 · <b>대형견</b> · 성견</span></div>
        </div>
        <div style={css("padding:14px 28px 22px; flex:none;")}><div onClick={v.goComplete} style={css("background:#3B5BFE; color:#fff; font:700 16px Pretendard; text-align:center; padding:17px; border-radius:18px; box-shadow:0 10px 24px rgba(59,91,254,.28); cursor:pointer;")}>완료</div></div>
      </div>
    </>) : null}

    
    {v.isComplete ? (<>
      <div data-screen-label="프로필 완성" style={css("position:absolute; inset:0; z-index:40; background:linear-gradient(180deg,#EEF1FF 0%,#F4F5F7 38%); display:flex; flex-direction:column;")}>
        <div style={css("height:50px; display:flex; align-items:center; justify-content:space-between; padding:0 26px 0 30px; flex:none;")}><span style={css("font:700 15px Pretendard;")}>9:41</span><span className="msr" style={css("display:flex; gap:7px; font-size:18px;")}><span>signal_cellular_alt</span><span>wifi</span><span>battery_full</span></span></div>
        <div style={css("flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:0 32px; text-align:center;")}>
          <video src={v.petModelSrc} poster="/pet-3d-mvp.png" autoPlay loop muted playsInline style={css("width:300px; height:300px; object-fit:contain; filter:drop-shadow(0 18px 30px rgba(59,91,254,.20));")} /><div style={css("display:inline-flex; align-items:center; gap:5px; font:700 11px Pretendard; color:#3B5BFE; background:#EEF1FF; padding:6px 12px; border-radius:999px;")}><span className="msf" style={css("font-size:13px;")}>view_in_ar</span>AI 3D 모델 미리보기 · 360° 회전 (MVP)</div>
          <div style={css("font-size:28px; font-weight:800; letter-spacing:-0.02em; margin-top:22px;")}>프로필 완성!</div>
          <div style={css("font:500 15px Pretendard; color:#8A8F98; margin-top:10px;")}>{v.petName}에게 맞는 동선을 추천할게요.</div>
          <div style={css("width:100%; background:#fff; border-radius:20px; padding:20px; margin-top:26px; box-shadow:0 8px 24px rgba(20,20,29,.06); text-align:left;")}><div style={css("font:700 18px Pretendard;")}>{v.petName} · {v.breedName}</div><div style={css("display:flex; gap:7px; flex-wrap:wrap; margin-top:14px;")}><span style={css("font:600 12px Pretendard; background:#F4F5F7; padding:7px 12px; border-radius:999px; border:1px solid #ECEEF1;")}>{v.breedSizeLabel}</span><span style={css("font:600 12px Pretendard; background:#F4F5F7; padding:7px 12px; border-radius:999px; border:1px solid #ECEEF1;")}>28kg · 3살</span><span style={css("display:inline-flex; align-items:center; gap:4px; font:600 12px Pretendard; background:#FFF1EF; color:#FF6B5C; padding:7px 12px; border-radius:999px;")}><span className="msf" style={css("font-size:13px;")}>sunny</span>더위 취약</span></div></div>
        </div>
        <div style={css("padding:0 28px 22px; flex:none;")}><div onClick={v.goPersona} style={css("background:#3B5BFE; color:#fff; font:700 16px Pretendard; text-align:center; padding:17px; border-radius:18px; box-shadow:0 10px 24px rgba(59,91,254,.28); cursor:pointer;")}>페르소나 만나기</div></div>
      </div>
    </>) : null}

    
    {v.isPersona ? (<>
      <div data-screen-label="페르소나" style={css("position:absolute; inset:0; z-index:40; background:#F4F5F7; display:flex; flex-direction:column;")}>
        <div style={css("height:50px; display:flex; align-items:center; justify-content:space-between; padding:0 26px 0 30px; flex:none;")}><span style={css("font:700 15px Pretendard;")}>9:41</span><span className="msr" style={css("display:flex; gap:7px; font-size:18px;")}><span>signal_cellular_alt</span><span>wifi</span><span>battery_full</span></span></div>
        <div style={css("padding:10px 28px 0; flex:none; display:flex; justify-content:center;")}><div style={css("display:flex; background:#ECEEF1; border-radius:999px; padding:3px;")}><div onClick={v.personaMascot} style={css(`font:700 12px Pretendard; padding:8px 16px; border-radius:999px; cursor:pointer; background:${v.pMascotBg}; color:${v.pMascotTx};`)}>마스코트</div><div onClick={v.personaReal} style={css(`font:700 12px Pretendard; padding:8px 16px; border-radius:999px; cursor:pointer; background:${v.pRealBg}; color:${v.pRealTx};`)}>실사</div></div></div>
        <div className="scr" style={css("flex:1; overflow-y:auto; padding:16px 28px 0; display:flex; flex-direction:column; align-items:center;")}>
          {v.personaIsMascot ? (<>
            <div onMouseDown={v.onDragStart} onTouchStart={v.onDragStart} style={css(`width:240px; height:260px; background:url(/pet-mascot.png) center/contain no-repeat; filter:drop-shadow(0 18px 30px rgba(59,91,254,.22)); cursor:grab; touch-action:none; ${v.fig3dRotate}`)}></div>
          </>) : null}
          {v.personaIsReal ? (<>
            <div onMouseDown={v.onDragStart} onTouchStart={v.onDragStart} style={css(`width:240px; height:260px; background:url(/pet-real.png) center/contain no-repeat; filter:drop-shadow(0 18px 30px rgba(59,91,254,.22)); cursor:grab; touch-action:none; ${v.fig3dRotate}`)}></div>
          </>) : null}
          <div style={css("margin-top:10px; display:flex; align-items:center; gap:6px; font:500 11px Pretendard; color:#8A8F98;")}><span className="msf" style={css("font-size:14px; color:#3B5BFE;")}>3d_rotation</span>드래그하면 돌아가요</div>
          <div style={css("background:#1A1A1D; color:#fff; font:600 14px Pretendard; padding:11px 18px; border-radius:18px 18px 18px 4px; margin-top:18px;")}>안녕, 나는 {v.petName}야. 같이 다닐 준비 됐어?</div>
          <div style={css("width:100%; background:#fff; border-radius:22px; padding:22px; margin-top:22px; box-shadow:0 10px 30px rgba(20,20,29,.07);")}>
            <div style={css("display:flex; align-items:center; justify-content:space-between;")}><div style={css("font:800 21px Pretendard;")}>{v.petName}</div><span style={css("display:inline-flex; align-items:center; gap:5px; font:700 12px Pretendard; color:#3B5BFE; background:#EEF1FF; padding:7px 12px; border-radius:999px;")}><span className="msf" style={css("font-size:14px;")}>favorite</span>사교형 모험가</span></div>
            <div style={css("font:500 14px Pretendard; color:#5A5F68; line-height:1.65; margin-top:14px;")}>{v.persona?.intro_text || '새로운 냄새라면 어디든! 사람 많은 카페도 좋아하지만, 더운 날엔 그늘이 필요해요.'}</div>
            <div style={css("display:flex; gap:7px; flex-wrap:wrap; margin-top:16px;")}>{[v.taActivity, v.taSocial, v.taBody].map((t, $i) => (<span key={$i} style={css("font:600 12px Pretendard; background:#F4F5F7; border:1px solid #ECEEF1; padding:7px 12px; border-radius:999px;")}>{t}</span>))}</div>
            <div onClick={v.openEditTraits} style={css("display:flex; align-items:center; justify-content:center; gap:6px; margin-top:16px; background:#EEF1FF; color:#3B5BFE; font:700 13px Pretendard; padding:12px; border-radius:12px; cursor:pointer;")}><span className="msr" style={css("font-size:16px;")}>edit</span>특징 수정하기</div>
          </div>
        </div>
        <div style={css("padding:16px 28px 22px; flex:none;")}><div onClick={v.finishOb} style={css("background:#3B5BFE; color:#fff; font:700 16px Pretendard; text-align:center; padding:17px; border-radius:18px; box-shadow:0 10px 24px rgba(59,91,254,.28); cursor:pointer;")}>{v.petName} 동선 받기</div></div>
      </div>
    </>) : null}

    
    {v.isRecap ? (<>
      <div data-screen-label="연말 결산" style={css("position:absolute; inset:0; z-index:30; background:linear-gradient(170deg,#1A1A1D 0%,#23306B 60%,#3B5BFE 100%); display:flex; flex-direction:column; color:#fff;")}>
        <div style={css("height:50px; display:flex; align-items:center; justify-content:space-between; padding:0 26px 0 30px; flex:none;")}><span style={css("font:700 15px Pretendard;")}>9:41</span><span className="msr" style={css("display:flex; gap:7px; font-size:18px;")}><span>signal_cellular_alt</span><span>wifi</span><span>battery_full</span></span></div>
        <div style={css("padding:6px 22px 0; flex:none; display:flex; align-items:center; gap:8px;")}><div style={css(`flex:1; height:3px; border-radius:999px; background:${v.recapDot0Bg};`)}></div><div style={css(`flex:1; height:3px; border-radius:999px; background:${v.recapDot1Bg};`)}></div><div style={css(`flex:1; height:3px; border-radius:999px; background:${v.recapDot2Bg};`)}></div><div onClick={v.closeMemory} style={css("cursor:pointer; margin-left:6px;")}><span className="msr" style={css("font-size:22px; color:#fff;")}>close</span></div></div>
        <div onClick={v.recapNext} style={css("flex:1; cursor:pointer; position:relative;")}>
          {v.recapS0 ? (<>
            <div style={css("position:absolute; inset:0; padding:0 34px; display:flex; flex-direction:column; justify-content:center;")}><div style={css("display:inline-flex; align-self:flex-start; align-items:center; gap:6px; font:700 12px Pretendard; background:rgba(255,255,255,.16); padding:8px 14px; border-radius:999px;")}><span className="msf" style={css("font-size:15px;")}>pets</span>AI 연말 결산</div><div style={css("font-size:72px; font-weight:800; letter-spacing:-0.03em; line-height:.95; margin-top:24px;")}>{v.recapYear}</div><div style={css("font-size:32px; font-weight:800; margin-top:4px;")}>{v.petName}의 발자국</div><div style={css("font:500 15px Pretendard; opacity:.85; margin-top:16px;")}>올해 함께한 모든 길을 모았어요. 탭해서 넘겨보세요.</div></div>
          </>) : null}
          {v.recapS1 ? (<>
            <div style={css("position:absolute; inset:0; padding:0 34px; display:flex; flex-direction:column; justify-content:center;")}><div style={css("font:700 13px Pretendard; opacity:.8;")}>올 한 해, 우리는</div><div style={css("display:flex; gap:12px; margin-top:20px;")}><div style={css("flex:1; background:rgba(255,255,255,.14); border-radius:16px; padding:16px;")}><div style={css("font:800 26px Pretendard;")}>{v.recapPlacesCount}</div><div style={css("font:500 11px Pretendard; opacity:.75; margin-top:3px;")}>다녀온 곳</div></div><div style={css("flex:1; background:rgba(255,255,255,.14); border-radius:16px; padding:16px;")}><div style={css("font:800 26px Pretendard;")}>{v.recapDistanceKm}km</div><div style={css("font:500 11px Pretendard; opacity:.75; margin-top:3px;")}>함께 걸음</div></div></div><div style={css("margin-top:18px; height:230px; border-radius:18px; background:rgba(255,255,255,.1); position:relative; overflow:hidden;")}><svg viewbox="0 0 320 230" style={css("position:absolute; inset:0; width:100%; height:100%;")}><path d="M50 50 C 110 70, 80 140, 160 130 S 250 190, 210 210" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-dasharray="2 11"></path></svg><div style={css("position:absolute; left:40px; top:36px; width:26px; height:26px; border-radius:50% 50% 50% 3px; background:#fff; display:flex; align-items:center; justify-content:center;")}><svg width="12" height="12" viewbox="0 0 24 24" fill="#3B5BFE"><ellipse cx="12" cy="16" rx="5.5" ry="4.5"></ellipse><ellipse cx="5.3" cy="10" rx="2.3" ry="2.9"></ellipse><ellipse cx="9.9" cy="6.4" rx="2.3" ry="2.9"></ellipse><ellipse cx="14.1" cy="6.4" rx="2.3" ry="2.9"></ellipse><ellipse cx="18.7" cy="10" rx="2.3" ry="2.9"></ellipse></svg></div><div style={css("position:absolute; right:50px; bottom:20px; width:30px; height:30px; border-radius:50% 50% 50% 3px; background:#fff; display:flex; align-items:center; justify-content:center;")}><svg width="14" height="14" viewbox="0 0 24 24" fill="#3B5BFE"><ellipse cx="12" cy="16" rx="5.5" ry="4.5"></ellipse><ellipse cx="5.3" cy="10" rx="2.3" ry="2.9"></ellipse><ellipse cx="9.9" cy="6.4" rx="2.3" ry="2.9"></ellipse><ellipse cx="14.1" cy="6.4" rx="2.3" ry="2.9"></ellipse><ellipse cx="18.7" cy="10" rx="2.3" ry="2.9"></ellipse></svg></div><div style={css("position:absolute; left:14px; bottom:12px; font:600 11px Pretendard; opacity:.85;")}>전주 일대 발자국 지도</div></div></div>
          </>) : null}
          {v.recapS2 ? (<>
            <div style={css("position:absolute; inset:0; padding:0 34px; display:flex; flex-direction:column; justify-content:center;")}><div style={css("display:inline-flex; align-self:flex-start; align-items:center; gap:6px; font:700 12px Pretendard; background:rgba(255,255,255,.16); padding:8px 14px; border-radius:999px;")}>올해의 순간</div><div style={css("font-size:30px; font-weight:800; letter-spacing:-0.02em; line-height:1.2; margin-top:18px;")}>자만벽화마을<br />첫 나들이</div><div style={css("font:500 14px Pretendard; opacity:.9; margin-top:10px;")}>2025.09.14 · 전주 한옥마을 · 4.9★</div><div onClick={v.openPhotocard} style={css("background:#fff; color:#3B5BFE; font:700 15px Pretendard; text-align:center; padding:16px; border-radius:16px; margin-top:26px; cursor:pointer;")}>포토카드로 저장</div></div>
          </>) : null}
        </div>
      </div>
    </>) : null}

    
    {v.isFigure ? (<>
      <div data-screen-label="3D 피규어" style={css("position:absolute; inset:0; z-index:30; background:#F4F5F7; display:flex; flex-direction:column;")}>
        <div style={css("height:50px; display:flex; align-items:center; justify-content:space-between; padding:0 26px 0 30px; flex:none;")}><span style={css("font:700 15px Pretendard;")}>9:41</span><span className="msr" style={css("display:flex; gap:7px; font-size:18px;")}><span>signal_cellular_alt</span><span>wifi</span><span>battery_full</span></span></div>
        <div style={css("padding:4px 24px 8px; flex:none; display:flex; align-items:center; gap:12px;")}><div onClick={v.closeMemory} style={css("cursor:pointer;")}><span className="msr" style={css("font-size:24px;")}>close</span></div><span style={css("font:700 16px Pretendard;")}>3D 피규어 만들기</span></div>
        {v.figIsPhoto ? (<>
          <div style={css("flex:1; padding:14px 24px 0;")}><div style={css("font-size:23px; font-weight:800; letter-spacing:-0.02em;")}>체리 사진을 골라요</div><div style={css("font:500 14px Pretendard; color:#8A8F98; margin-top:8px;")}>정면·전신 사진일수록 입체가 잘 나와요.</div><label style={css("margin-top:20px; display:block; height:240px; border-radius:24px; border:2px dashed #C7CAD0; background:linear-gradient(135deg,#FBEAC9,#F3D199); cursor:pointer; position:relative; overflow:hidden;")}><input type="file" accept="image/*" onChange={v.onPhoto} style={css("position:absolute; inset:0; opacity:0; cursor:pointer;")} /><div style={css(`position:absolute; inset:0; background-color:#F3D199; ${v.photoStyle}`)}></div>{v.hasPhoto ? (<><div style={css("position:absolute; bottom:10px; left:50%; transform:translateX(-50%); display:inline-flex; align-items:center; gap:5px; font:600 11px Pretendard; color:#fff; background:rgba(0,0,0,.45); padding:6px 12px; border-radius:999px;")}><span className="msf" style={css("font-size:13px;")}>check</span>사진 선택됨 · 다시 선택</div></>) : null}</label><div style={css("margin-top:12px; display:flex; align-items:center; gap:8px; font:500 12px Pretendard; color:#8A8F98;")}><span className="msr" style={css("font-size:16px; color:#3B5BFE;")}>view_in_ar</span>업로드한 사진을 입체 모델로 변환해요.</div></div>
          <div style={css("padding:14px 24px 22px; flex:none;")}><div onClick={v.figToStyle} style={css("background:#3B5BFE; color:#fff; font:700 16px Pretendard; text-align:center; padding:17px; border-radius:18px; box-shadow:0 10px 24px rgba(59,91,254,.28); cursor:pointer;")}>다음</div></div>
        </>) : null}
        {v.figIsStyle ? (<>
          <div style={css("flex:1; padding:14px 24px 0;")}><div style={css("font-size:23px; font-weight:800; letter-spacing:-0.02em;")}>스타일 선택</div><div style={css("font:500 14px Pretendard; color:#8A8F98; margin-top:8px;")}>어떤 피규어로 만들까요?</div><div style={css("display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-top:20px;")}><div style={css("background:#fff; border:2px solid #3B5BFE; border-radius:16px; padding:8px; box-shadow:0 6px 20px rgba(59,91,254,.12);")}><div style={css("aspect-ratio:1; border-radius:11px; background:linear-gradient(135deg,#F4C6BE,#E0809A); display:flex; align-items:center; justify-content:center;")}><span className="msf" style={css("font-size:34px; color:rgba(255,255,255,.7);")}>toys</span></div><div style={css("font:600 12px Pretendard; text-align:center; margin-top:8px;")}>미니 피규어</div></div><div style={css("background:#fff; border:1px solid #ECEEF1; border-radius:16px; padding:8px;")}><div style={css("aspect-ratio:1; border-radius:11px; background:linear-gradient(135deg,#BFD3F0,#8FAEE0); display:flex; align-items:center; justify-content:center;")}><span className="msf" style={css("font-size:34px; color:rgba(255,255,255,.7);")}>deployed_code</span></div><div style={css("font:600 12px Pretendard; text-align:center; margin-top:8px;")}>클레이</div></div><div style={css("background:#fff; border:1px solid #ECEEF1; border-radius:16px; padding:8px;")}><div style={css("aspect-ratio:1; border-radius:11px; background:linear-gradient(135deg,#C9E6C2,#94CB9C); display:flex; align-items:center; justify-content:center;")}><span className="msf" style={css("font-size:34px; color:rgba(255,255,255,.7);")}>interests</span></div><div style={css("font:600 12px Pretendard; text-align:center; margin-top:8px;")}>한복 피규어</div></div><div style={css("background:#fff; border:1px solid #ECEEF1; border-radius:16px; padding:8px;")}><div style={css("aspect-ratio:1; border-radius:11px; background:linear-gradient(135deg,#E9D7B8,#CBB182); display:flex; align-items:center; justify-content:center;")}><span className="msf" style={css("font-size:34px; color:rgba(255,255,255,.7);")}>animation</span></div><div style={css("font:600 12px Pretendard; text-align:center; margin-top:8px;")}>카툰</div></div></div></div>
          <div style={css("padding:14px 24px 22px; flex:none;")}><div onClick={v.figToGen} style={css("background:#3B5BFE; color:#fff; font:700 16px Pretendard; text-align:center; padding:17px; border-radius:18px; box-shadow:0 10px 24px rgba(59,91,254,.28); cursor:pointer;")}>생성하기</div></div>
        </>) : null}
        {v.figIsGen ? (<>
          <div style={css("flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:0 40px; text-align:center;")}><div style={css("position:relative; width:120px; height:120px;")}><div style={css("position:absolute; inset:0; border-radius:50%; border:5px solid #EEF1FF;")}></div><div style={css("position:absolute; inset:0; border-radius:50%; border:5px solid transparent; border-top-color:#3B5BFE; border-right-color:#3B5BFE; transform:rotate(48deg);")}></div><div style={css("position:absolute; inset:0; display:flex; align-items:center; justify-content:center; color:#3B5BFE;")}><span className="msf" style={css("font-size:46px;")}>deployed_code</span></div></div><div style={css("font-size:22px; font-weight:800; letter-spacing:-0.02em; margin-top:28px;")}>체리 피규어를 빚는 중...</div><div style={css("font:500 14px Pretendard; color:#8A8F98; margin-top:8px;")}>입체 모델을 생성하고 있어요</div><div onClick={v.figToReveal} style={css("margin-top:24px; background:#EEF1FF; color:#3B5BFE; font:700 15px Pretendard; padding:14px 28px; border-radius:16px; cursor:pointer;")}>미리 보기</div></div>
        </>) : null}
        {v.figIsReveal ? (<>
          <div style={css("flex:1; padding:14px 24px 0; overflow-y:auto;")} className="scr"><div style={css("height:300px; border-radius:24px; background:radial-gradient(circle at 50% 38%, #EEF1FF, #DCE3FB); position:relative; display:flex; align-items:center; justify-content:center; box-shadow:inset 0 0 0 1px #E4E9FF; overflow:hidden;")}>{v.hasPhoto ? (<><div onMouseDown={v.onDragStart} onTouchStart={v.onDragStart} style={css(`width:170px; height:200px; border-radius:18px; ${v.fig3dStyle} box-shadow:0 26px 50px rgba(59,91,254,.3), inset 0 0 0 4px rgba(255,255,255,.7); cursor:grab; touch-action:none;`)}></div></>) : null}{v.noPhoto ? (<><div onMouseDown={v.onDragStart} onTouchStart={v.onDragStart} style={css(`position:relative; width:150px; height:150px; filter:drop-shadow(0 14px 24px rgba(59,91,254,.22)); cursor:grab; touch-action:none; ${v.fig3dStyle}`)}><div style={css("position:absolute; inset:0; border-radius:50%; background:#fff;")}></div><div style={css("position:absolute; left:26px; top:18px; width:34px; height:48px; border-radius:60% 40% 50% 50%; background:radial-gradient(circle at 40% 28%, #EEBE82, #E0A867 58%, #C68A45);")}></div><div style={css("position:absolute; right:26px; top:18px; width:34px; height:48px; border-radius:40% 60% 50% 50%; background:radial-gradient(circle at 40% 28%, #EEBE82, #E0A867 58%, #C68A45);")}></div><div style={css("position:absolute; left:33px; top:28px; width:84px; height:84px; border-radius:50%; background:radial-gradient(circle at 38% 28%, #FCE6BC, #F4C98A 52%, #DFA45E);")}></div><div style={css("position:absolute; left:52px; top:56px; width:12px; height:12px; border-radius:50%; background:#2A2A2A;")}></div><div style={css("position:absolute; right:52px; top:56px; width:12px; height:12px; border-radius:50%; background:#2A2A2A;")}></div><div style={css("position:absolute; left:50%; top:76px; transform:translateX(-50%); width:18px; height:12px; border-radius:50%; background:#2A2A2A;")}></div></div></>) : null}<div style={css("position:absolute; bottom:14px; left:50%; transform:translateX(-50%); display:inline-flex; align-items:center; gap:6px; font:600 11px Pretendard; color:#3B5BFE; background:rgba(255,255,255,.8); padding:7px 13px; border-radius:999px;")}><span className="msf" style={css("font-size:14px;")}>360</span>드래그해서 돌려보기</div></div><div style={css("font:800 19px Pretendard; margin-top:18px;")}>체리 3D 피규어 완성!</div><div style={css("display:flex; gap:10px; margin-top:14px;")}><div style={css("flex:1; background:#fff; border:1px solid #ECEEF1; border-radius:14px; padding:14px; text-align:center; box-shadow:0 4px 16px rgba(20,20,29,.05);")}><span className="msf" style={css("font-size:22px; color:#3B5BFE; display:block; margin-bottom:5px;")}>download</span><span style={css("font:600 12px Pretendard;")}>저장</span></div><div style={css("flex:1; background:#fff; border:1px solid #ECEEF1; border-radius:14px; padding:14px; text-align:center; box-shadow:0 4px 16px rgba(20,20,29,.05);")}><span className="msf" style={css("font-size:22px; color:#3B5BFE; display:block; margin-bottom:5px;")}>ios_share</span><span style={css("font:600 12px Pretendard;")}>공유</span></div><div style={css("flex:1; background:#fff; border:1px solid #ECEEF1; border-radius:14px; padding:14px; text-align:center; box-shadow:0 4px 16px rgba(20,20,29,.05); position:relative;")}><span className="msf" style={css("font-size:22px; color:#C68A1E; display:block; margin-bottom:5px;")}>redeem</span><span style={css("font:600 12px Pretendard;")}>굿즈 주문</span><span style={css("position:absolute; top:8px; right:8px; font:600 9px Pretendard; color:#3B5BFE; background:#EEF1FF; padding:2px 6px; border-radius:999px;")}>구매</span></div></div></div>
          <div style={css("padding:14px 24px 22px; flex:none;")}><div onClick={v.figToCustom} style={css("background:#3B5BFE; color:#fff; font:700 16px Pretendard; text-align:center; padding:17px; border-radius:18px; box-shadow:0 10px 24px rgba(59,91,254,.28); cursor:pointer;")}>커스터마이즈</div></div>
        </>) : null}
        {v.figIsCustom ? (<>
          <div style={css("padding:4px 24px 8px; flex:none; display:flex; align-items:center; gap:12px;")}><div onClick={v.figToReveal} style={css("cursor:pointer;")}><span className="msr" style={css("font-size:24px;")}>arrow_back_ios_new</span></div><span style={css("font:700 16px Pretendard;")}>커스터마이즈</span></div>
          <div className="scr" style={css("flex:1; overflow-y:auto; padding:6px 24px 16px;")}>
            <div style={css("height:200px; border-radius:24px; background:radial-gradient(circle at 50% 40%, #EEF1FF, #DCE3FB); position:relative; display:flex; align-items:center; justify-content:center;")}><div style={css("position:relative; width:120px; height:120px; filter:drop-shadow(0 12px 22px rgba(59,91,254,.2));")}><div style={css("position:absolute; inset:0; border-radius:50%; background:#fff;")}></div><div style={css("position:absolute; left:21px; top:14px; width:27px; height:38px; border-radius:60% 40% 50% 50%; background:radial-gradient(circle at 40% 28%, #EEBE82, #E0A867 58%, #C68A45); transform:rotate(-20deg);")}></div><div style={css("position:absolute; right:21px; top:14px; width:27px; height:38px; border-radius:40% 60% 50% 50%; background:radial-gradient(circle at 40% 28%, #EEBE82, #E0A867 58%, #C68A45); transform:rotate(20deg);")}></div><div style={css("position:absolute; left:27px; top:22px; width:66px; height:66px; border-radius:50%; background:radial-gradient(circle at 38% 28%, #FCE6BC, #F4C98A 52%, #DFA45E);")}></div><div style={css("position:absolute; left:42px; top:44px; width:10px; height:10px; border-radius:50%; background:#2A2A2A;")}></div><div style={css("position:absolute; right:42px; top:44px; width:10px; height:10px; border-radius:50%; background:#2A2A2A;")}></div><div style={css("position:absolute; left:50%; top:60px; transform:translateX(-50%); width:15px; height:10px; border-radius:50%; background:#2A2A2A;")}></div></div></div>
            <div style={css("font:600 13px Pretendard; color:#8A8F98; margin:20px 0 10px;")}>배경</div>
            <div style={css("display:flex; gap:8px;")}><div style={css("width:40px; height:40px; border-radius:12px; background:#EEF1FF; border:2px solid #3B5BFE;")}></div><div style={css("width:40px; height:40px; border-radius:12px; background:#FDE9D0;")}></div><div style={css("width:40px; height:40px; border-radius:12px; background:#E5F6EE;")}></div><div style={css("width:40px; height:40px; border-radius:12px; background:#F4E4F1;")}></div></div>
            <div style={css("font:600 13px Pretendard; color:#8A8F98; margin:20px 0 10px;")}>포즈</div>
            <div style={css("display:flex; gap:8px; flex-wrap:wrap;")}><span style={css("font:600 13px Pretendard; background:#1A1A1D; color:#fff; padding:9px 15px; border-radius:999px;")}>앉기</span><span style={css("font:500 13px Pretendard; background:#fff; border:1px solid #DfE2E6; padding:9px 15px; border-radius:999px;")}>서기</span><span style={css("font:500 13px Pretendard; background:#fff; border:1px solid #DfE2E6; padding:9px 15px; border-radius:999px;")}>엎드리기</span></div>
            <div style={css("font:600 13px Pretendard; color:#8A8F98; margin:20px 0 10px;")}>소품</div>
            <div style={css("display:flex; gap:8px; flex-wrap:wrap;")}><span style={css("font:500 13px Pretendard; background:#fff; border:1px solid #DfE2E6; padding:9px 15px; border-radius:999px;")}>없음</span><span style={css("font:600 13px Pretendard; background:#1A1A1D; color:#fff; padding:9px 15px; border-radius:999px;")}>한복</span><span style={css("font:500 13px Pretendard; background:#fff; border:1px solid #DfE2E6; padding:9px 15px; border-radius:999px;")}>갓</span><span style={css("font:500 13px Pretendard; background:#fff; border:1px solid #DfE2E6; padding:9px 15px; border-radius:999px;")}>목도리</span></div>
          </div>
          <div style={css("padding:6px 24px 22px; flex:none; display:flex; gap:10px;")}>
            <div style={css("flex:1; background:#fff; border:1px solid #ECEEF1; border-radius:16px; padding:15px; text-align:center; font:700 13px Pretendard;")}><span className="msf" style={css("font-size:20px; color:#3B5BFE; display:block; margin-bottom:4px;")}>download</span>저장</div>
            <div style={css("flex:1; background:#fff; border:1px solid #ECEEF1; border-radius:16px; padding:15px; text-align:center; font:700 13px Pretendard;")}><span className="msf" style={css("font-size:20px; color:#3B5BFE; display:block; margin-bottom:4px;")}>ios_share</span>공유</div>
            <div style={css("flex:1; background:#3B5BFE; color:#fff; border-radius:16px; padding:15px; text-align:center; font:700 13px Pretendard; position:relative; box-shadow:0 10px 24px rgba(59,91,254,.28);")}><span className="msf" style={css("font-size:20px; display:block; margin-bottom:4px;")}>redeem</span>굿즈 주문<span style={css("position:absolute; top:8px; right:10px; font:600 9px Pretendard; color:#3B5BFE; background:#fff; padding:2px 6px; border-radius:999px;")}>구매</span></div>
          </div>
        </>) : null}
      </div>
    </>) : null}

    
    {v.isPhotocard ? (<>
      <div data-screen-label="포토카드" style={css("position:absolute; inset:0; z-index:31; background:#1A1A1D; display:flex; flex-direction:column;")}>
        <div style={css("position:absolute; inset:0; background:linear-gradient(180deg,#E9C794,#C8965A);")}></div>
        <div style={css("position:absolute; inset:0; background:linear-gradient(180deg,rgba(0,0,0,.15),rgba(0,0,0,0) 30%,rgba(0,0,0,.55));")}></div>
        <span className="msr" style={css("position:absolute; top:38%; left:50%; transform:translate(-50%,-50%); font-size:84px; color:rgba(255,255,255,.45);")}>pets</span>
        <div style={css("height:50px; display:flex; align-items:center; justify-content:space-between; padding:0 26px 0 30px; flex:none; position:relative; z-index:1; color:#fff;")}><span style={css("font:700 15px Pretendard;")}>9:41</span><span className="msr" style={css("display:flex; gap:7px; font-size:18px;")}><span>signal_cellular_alt</span><span>wifi</span><span>battery_full</span></span></div>
        <div onClick={v.closeMemory} style={css("position:absolute; top:54px; right:22px; z-index:2; width:36px; height:36px; border-radius:50%; background:rgba(0,0,0,.35); display:flex; align-items:center; justify-content:center; color:#fff; cursor:pointer;")}><span className="msr" style={css("font-size:20px;")}>close</span></div>
        <div style={css("flex:1;")}></div>
        <div style={css("padding:0 30px 24px; position:relative; z-index:1; color:#fff;")}><div style={css("display:inline-flex; align-items:center; gap:6px; font:700 12px Pretendard; background:rgba(255,255,255,.2); padding:7px 13px; border-radius:999px;")}>올해의 순간</div><div style={css("font-size:30px; font-weight:800; letter-spacing:-0.02em; line-height:1.2; margin-top:16px; text-shadow:0 2px 14px rgba(0,0,0,.3);")}>자만벽화마을<br />첫 나들이</div><div style={css("font:500 14px Pretendard; opacity:.9; margin-top:10px;")}>2025.09.14 · 전주 한옥마을 · 4.9★</div><div style={css("display:flex; gap:10px; margin-top:22px;")}><div style={css("flex:1; background:#fff; color:#3B5BFE; font:700 15px Pretendard; text-align:center; padding:16px; border-radius:16px; display:flex; align-items:center; justify-content:center; gap:7px;")}><span className="msf" style={css("font-size:19px;")}>ios_share</span>스토리 공유</div><div style={css("width:54px; flex:none; background:rgba(255,255,255,.22); color:#fff; display:flex; align-items:center; justify-content:center; border-radius:16px;")}><span className="msf" style={css("font-size:22px;")}>download</span></div></div></div>
      </div>
    </>) : null}

    
    {v.isFest ? (<>
      <div data-screen-label="축제 캘린더" style={css("position:absolute; inset:0; z-index:30; background:#F4F5F7; display:flex; flex-direction:column;")}>
        <div style={css("height:50px; display:flex; align-items:center; justify-content:space-between; padding:0 26px 0 30px; flex:none;")}><span style={css("font:700 15px Pretendard;")}>9:41</span><span className="msr" style={css("display:flex; gap:7px; font-size:18px;")}><span>signal_cellular_alt</span><span>wifi</span><span>battery_full</span></span></div>
        <div style={css("padding:4px 22px 10px; flex:none; display:flex; align-items:center; gap:12px;")}><div onClick={v.closeSub} style={css("cursor:pointer;")}><span className="msr" style={css("font-size:24px;")}>arrow_back_ios_new</span></div><span style={css("font:800 18px Pretendard;")}>축제 캘린더</span><div style={css("margin-left:auto; display:flex; background:#ECEEF1; border-radius:999px; padding:3px;")}><div onClick={v.festCal} style={css(`font:700 12px Pretendard; padding:7px 13px; border-radius:999px; cursor:pointer; background:${v.festCalBg}; color:${v.festCalTx};`)}>달력</div><div onClick={v.festList} style={css(`font:700 12px Pretendard; padding:7px 13px; border-radius:999px; cursor:pointer; background:${v.festListBg}; color:${v.festListTx};`)}>리스트</div></div></div>
        <div style={css("padding:0 22px 12px; flex:none; display:flex; gap:8px; overflow:hidden;")}><span style={css("font:700 13px Pretendard; background:#1A1A1D; color:#fff; padding:8px 14px; border-radius:999px; flex:none;")}>전북</span><span style={css("font:600 13px Pretendard; background:#fff; border:1px solid #DfE2E6; padding:8px 14px; border-radius:999px; flex:none;")}>전주</span><span style={css("font:600 13px Pretendard; background:#fff; border:1px solid #DfE2E6; padding:8px 14px; border-radius:999px; flex:none;")}>군산</span></div>
        <div className="scr" style={css("flex:1; overflow-y:auto; padding:6px 22px 28px;")}>
          {v.festIsCal ? (<>
            <div style={css("background:#fff; border-radius:20px; padding:18px; box-shadow:0 6px 20px rgba(20,20,29,.06);")}>
              <div style={css("display:flex; align-items:center; justify-content:space-between; margin-bottom:14px;")}><span className="msr" style={css("font-size:20px; color:#8A8F98;")}>chevron_left</span><span style={css("font:800 16px Pretendard;")}>2025년 10월</span><span className="msr" style={css("font-size:20px; color:#8A8F98;")}>chevron_right</span></div>
              <div style={css("display:grid; grid-template-columns:repeat(7,1fr); gap:2px; font:600 11px Pretendard; color:#8A8F98; text-align:center; margin-bottom:8px;")}><div>일</div><div>월</div><div>화</div><div>수</div><div>목</div><div>금</div><div>토</div></div>
              <div style={css("display:grid; grid-template-columns:repeat(7,1fr); gap:2px; text-align:center;")}>
                <div style={css("padding:7px 0; font:500 13px Pretendard; color:#C7CAD0;")}>28</div><div style={css("padding:7px 0; font:500 13px Pretendard; color:#C7CAD0;")}>29</div><div style={css("padding:7px 0; font:500 13px Pretendard; color:#C7CAD0;")}>30</div>
                <div style={css("padding:7px 0; font:500 13px Pretendard;")}>1</div><div style={css("padding:7px 0; font:500 13px Pretendard;")}>2</div><div style={css("padding:7px 0; font:500 13px Pretendard;")}>3</div><div style={css("padding:7px 0; font:500 13px Pretendard;")}>4</div>
                <div style={css("padding:7px 0; font:500 13px Pretendard;")}>5</div><div style={css("padding:7px 0; font:500 13px Pretendard;")}>6</div><div style={css("padding:7px 0; font:500 13px Pretendard;")}>7</div><div style={css("padding:7px 0; font:500 13px Pretendard;")}>8</div><div style={css("padding:7px 0; font:500 13px Pretendard; position:relative;")}>9<div style={css("position:absolute; bottom:1px; left:50%; transform:translateX(-50%); width:5px; height:5px; border-radius:50%; background:#3B5BFE;")}></div></div><div style={css("padding:7px 0; font:500 13px Pretendard; position:relative;")}>10<div style={css("position:absolute; bottom:1px; left:50%; transform:translateX(-50%); width:5px; height:5px; border-radius:50%; background:#3B5BFE;")}></div></div><div style={css("padding:7px 0; font:500 13px Pretendard; position:relative;")}>11<div style={css("position:absolute; bottom:1px; left:50%; transform:translateX(-50%); width:5px; height:5px; border-radius:50%; background:#3B5BFE;")}></div></div>
                <div style={css("padding:7px 0; font:500 13px Pretendard;")}>12</div><div style={css("padding:7px 0; font:500 13px Pretendard;")}>13</div><div style={css("padding:7px 0; font:500 13px Pretendard;")}>14</div><div style={css("padding:7px 0; font:500 13px Pretendard;")}>15</div><div style={css("padding:7px 0; font:700 13px Pretendard; color:#fff; position:relative;")}><div style={css("position:absolute; inset:2px 8px; background:#3B5BFE; border-radius:9px;")}></div><span style={css("position:relative;")}>16</span></div><div style={css("padding:7px 0; font:500 13px Pretendard; position:relative;")}>17<div style={css("position:absolute; bottom:1px; left:50%; transform:translateX(-50%); width:5px; height:5px; border-radius:50%; background:#3B5BFE;")}></div></div><div style={css("padding:7px 0; font:500 13px Pretendard; position:relative;")}>18<div style={css("position:absolute; bottom:1px; left:50%; transform:translateX(-50%); width:5px; height:5px; border-radius:50%; background:#3B5BFE;")}></div></div>
                <div style={css("padding:7px 0; font:500 13px Pretendard; position:relative;")}>19<div style={css("position:absolute; bottom:1px; left:50%; transform:translateX(-50%); width:5px; height:5px; border-radius:50%; background:#3B5BFE;")}></div></div><div style={css("padding:7px 0; font:500 13px Pretendard;")}>20</div><div style={css("padding:7px 0; font:500 13px Pretendard;")}>21</div><div style={css("padding:7px 0; font:500 13px Pretendard;")}>22</div><div style={css("padding:7px 0; font:500 13px Pretendard;")}>23</div><div style={css("padding:7px 0; font:500 13px Pretendard;")}>24</div><div style={css("padding:7px 0; font:500 13px Pretendard;")}>25</div>
              </div>
              <div style={css("display:flex; align-items:center; gap:6px; margin-top:14px; font:500 12px Pretendard; color:#8A8F98;")}><span style={css("width:6px; height:6px; border-radius:50%; background:#3B5BFE;")}></span>반려동물 동반 가능일</div>
            </div>
          </>) : null}
          <div style={css("margin-top:16px; display:flex; flex-direction:column; gap:12px;")}>
            {(v.festivals || []).map((f, $i) => (
            <div key={$i} style={css("background:#fff; border-radius:18px; overflow:hidden; box-shadow:0 6px 20px rgba(20,20,29,.06);")}>
              <div style={css(`height:120px; background:${$i % 2 === 0 ? "linear-gradient(135deg,#E7D2A6,#D2B16E)" : "linear-gradient(135deg,#F4C6BE,#E89B8E)"}; position:relative;`)}>{f.pet_allowed ? (<span style={css("position:absolute; top:12px; left:14px; font:600 11px Pretendard; color:#fff; background:rgba(0,0,0,.32); padding:5px 10px; border-radius:999px;")}>반려동물 동반 가능</span>) : null}</div>
              <div style={css("padding:14px 16px;")}><div style={css("display:flex; align-items:center; justify-content:space-between;")}><div style={css("font:700 16px Pretendard;")}>{f.name}</div><span className="msf" style={css("font-size:20px; color:#FF6B5C;")}>favorite_border</span></div><div style={css("font:500 12px Pretendard; color:#8A8F98; margin-top:4px;")}>{f.start_date}–{f.end_date} · {f.region}</div><div style={css("margin-top:12px; background:#3B5BFE; color:#fff; font:700 13px Pretendard; text-align:center; padding:11px; border-radius:12px;")}>코스에 추가</div><div style={css("font:400 11px Pretendard; color:#A9A8A2; margin-top:10px;")}>데이터: {f.source}</div></div>
            </div>
            ))}
          </div>
        </div>
      </div>
    </>) : null}

    
    {v.isTrail ? (<>
      <div data-screen-label="둘레길 코스" style={css("position:absolute; inset:0; z-index:30; background:#F4F5F7; display:flex; flex-direction:column;")}>
        <div style={css("height:230px; flex:none; background:#E6E8EC; position:relative;")}>
          <div style={css("position:absolute; left:30px; top:60px; width:120px; height:90px; border-radius:18px; background:#CFE4C8;")}></div>
          <div style={css("position:absolute; right:24px; top:90px; width:120px; height:100px; border-radius:18px; background:#DDE0E5;")}></div>
          <svg viewbox="0 0 390 230" style={css("position:absolute; inset:0; width:100%; height:100%;")}><path d="M70 70 C 130 90, 110 150, 190 150 S 300 180, 250 200" fill="none" stroke="#22A565" stroke-width="4" stroke-linecap="round" stroke-dasharray="2 12"></path></svg>
          <div style={css("position:absolute; left:56px; top:54px; width:30px; height:30px; border-radius:50% 50% 50% 3px; background:#fff; box-shadow:0 4px 12px rgba(20,20,29,.18); display:flex; align-items:center; justify-content:center;")}><svg width="14" height="14" viewbox="0 0 24 24" fill="#22A565"><ellipse cx="12" cy="16" rx="5.5" ry="4.5"></ellipse><ellipse cx="5.3" cy="10" rx="2.3" ry="2.9"></ellipse><ellipse cx="9.9" cy="6.4" rx="2.3" ry="2.9"></ellipse><ellipse cx="14.1" cy="6.4" rx="2.3" ry="2.9"></ellipse><ellipse cx="18.7" cy="10" rx="2.3" ry="2.9"></ellipse></svg></div>
          <div style={css("position:absolute; right:60px; top:184px; width:34px; height:34px; border-radius:50% 50% 50% 3px; background:#22A565; box-shadow:0 6px 16px rgba(34,165,101,.4); display:flex; align-items:center; justify-content:center;")}><svg width="16" height="16" viewbox="0 0 24 24" fill="#fff"><ellipse cx="12" cy="16" rx="5.5" ry="4.5"></ellipse><ellipse cx="5.3" cy="10" rx="2.3" ry="2.9"></ellipse><ellipse cx="9.9" cy="6.4" rx="2.3" ry="2.9"></ellipse><ellipse cx="14.1" cy="6.4" rx="2.3" ry="2.9"></ellipse><ellipse cx="18.7" cy="10" rx="2.3" ry="2.9"></ellipse></svg></div>
          <div style={css("height:50px; display:flex; align-items:center; padding:0 22px; position:relative; z-index:1;")}><div onClick={v.closeSub} style={css("width:40px; height:40px; border-radius:50%; background:rgba(255,255,255,.92); display:flex; align-items:center; justify-content:center; cursor:pointer;")}><span className="msr" style={css("font-size:22px;")}>arrow_back_ios_new</span></div></div>
        </div>
        <div className="scr" style={css("flex:1; overflow-y:auto; padding:18px 22px 28px; background:#F4F5F7; border-radius:24px 24px 0 0; margin-top:-22px; position:relative; z-index:1;")}>
          <div style={css("font:800 22px Pretendard; letter-spacing:-0.02em;")}>{(v.trails || [])[0]?.name || "한옥마을~오목대 산책길"}</div>
          <div style={css("font:500 13px Pretendard; color:#8A8F98; margin-top:4px;")}>{(v.trails || [])[0]?.region || "전주 한옥마을"} · 둘레길</div>
          <div style={css("display:flex; gap:7px; flex-wrap:wrap; margin-top:14px;")}>
            <span style={css("display:inline-flex; align-items:center; gap:5px; font:600 12px Pretendard; background:#EAF6EE; color:#22A565; padding:8px 12px; border-radius:999px;")}><span className="msf" style={css("font-size:14px;")}>landscape</span>평지</span>
            <span style={css("display:inline-flex; align-items:center; gap:5px; font:600 12px Pretendard; background:#EAF6EE; color:#22A565; padding:8px 12px; border-radius:999px;")}><span className="msf" style={css("font-size:14px;")}>park</span>그늘 많음</span>
            <span style={css("display:inline-flex; align-items:center; gap:5px; font:600 12px Pretendard; background:#fff; border:1px solid #ECEEF1; padding:8px 12px; border-radius:999px;")}><span className="msf" style={css("font-size:14px; color:#3B5BFE;")}>pets</span>펫 적합</span>
          </div>
          <div style={css("margin-top:16px; background:#fff; border-radius:16px; padding:4px 16px; box-shadow:0 4px 16px rgba(20,20,29,.05);")}>
            <div style={css("display:flex; align-items:center; justify-content:space-between; padding:13px 0; border-bottom:1px solid #ECEEF1;")}><span style={css("font:500 14px Pretendard; color:#8A8F98;")}>거리</span><span style={css("font:700 14px Pretendard;")}>{(v.trails || [])[0] ? `${(v.trails || [])[0].distance_km}km` : "2.4km"}</span></div>
            <div style={css("display:flex; align-items:center; justify-content:space-between; padding:13px 0; border-bottom:1px solid #ECEEF1;")}><span style={css("font:500 14px Pretendard; color:#8A8F98;")}>도보 시간</span><span style={css("font:700 14px Pretendard;")}>{(v.trails || [])[0]?.duration || "약 50분"}</span></div>
            <div style={css("display:flex; align-items:center; justify-content:space-between; padding:13px 0;")}><span style={css("font:500 14px Pretendard; color:#8A8F98;")}>난이도</span><span style={css("font:700 14px Pretendard; color:#22A565;")}>{(v.trails || [])[0]?.difficulty || "쉬움"}</span></div>
          </div>
          <div style={css("font:800 16px Pretendard; margin:20px 0 12px;")}>구간</div>
          <div style={css("display:flex; flex-direction:column; gap:10px;")}>
            {(v.trailStops || []).map((stop) => (<div key={stop.$index} style={css("background:#fff; border-radius:14px; padding:13px 15px; box-shadow:0 4px 16px rgba(20,20,29,.05); display:flex; gap:12px; align-items:center;")}><div style={css(`width:30px; height:30px; border-radius:50%; ${stop.last ? "background:#22A565; color:#fff;" : "background:#EAF6EE; color:#22A565;"} display:flex; align-items:center; justify-content:center; font:800 13px Pretendard;`)}>{stop.$index + 1}</div><div style={css("flex:1;")}><div style={css("font:700 14px Pretendard;")}>{stop.name}</div><div style={css("font:500 12px Pretendard; color:#8A8F98;")}>{stop.sub}</div></div></div>))}
            {v.trailStopsHasMore ? (<div onClick={v.toggleTrailStops} style={css("background:#fff; border:1px solid #ECEEF1; border-radius:14px; padding:13px 15px; box-shadow:0 4px 16px rgba(20,20,29,.05); display:flex; gap:6px; align-items:center; justify-content:center; cursor:pointer;")}><span style={css("font:700 13px Pretendard; color:#22A565;")}>{v.trailStopsExpanded ? "접기" : `경유지 ${v.trailStopsMoreCount}곳 더보기`}</span><span className="msr" style={css("font-size:20px; color:#22A565;")}>{v.trailStopsExpanded ? "expand_less" : "expand_more"}</span></div>) : null}
          </div>
          <div style={css("font:400 11px Pretendard; color:#A9A8A2; margin-top:16px;")}>데이터: 한국관광공사 두루누비(걷기길)</div>
          <div style={css("margin-top:14px; background:#3B5BFE; color:#fff; font:700 16px Pretendard; text-align:center; padding:17px; border-radius:18px; box-shadow:0 10px 24px rgba(59,91,254,.28);")}>코스에 추가</div>
        </div>
      </div>
    </>) : null}

    
    {v.isStamp ? (<>
      <div data-screen-label="스탬프 컬렉션" style={css("position:absolute; inset:0; z-index:30; background:#F4F5F7; display:flex; flex-direction:column;")}>
        <div style={css("height:50px; display:flex; align-items:center; justify-content:space-between; padding:0 26px 0 30px; flex:none;")}><span style={css("font:700 15px Pretendard;")}>9:41</span><span className="msr" style={css("display:flex; gap:7px; font-size:18px;")}><span>signal_cellular_alt</span><span>wifi</span><span>battery_full</span></span></div>
        <div style={css("padding:4px 22px 10px; flex:none; display:flex; align-items:center; gap:12px;")}><div onClick={v.closeSub} style={css("cursor:pointer;")}><span className="msr" style={css("font-size:24px;")}>arrow_back_ios_new</span></div><span style={css("font:800 18px Pretendard;")}>문화시설 스탬프</span></div>
        <div className="scr" style={css("flex:1; overflow-y:auto; padding:6px 22px 28px;")}>
          <div style={css("background:#fff; border-radius:20px; padding:20px; box-shadow:0 6px 20px rgba(20,20,29,.06);")}>
            <div style={css("display:flex; align-items:center; justify-content:space-between; margin-bottom:12px;")}><span style={css("font:700 15px Pretendard;")}>전주 문화시설 투어</span><span style={css("font:800 15px Pretendard; color:#C68A1E;")}>5/{(v.stamps || []).length || 12}</span></div>
            <div style={css("height:9px; background:#ECEEF1; border-radius:999px; overflow:hidden;")}><div style={css(`width:${Math.round(5 / ((v.stamps || []).length || 12) * 100)}%; height:100%; background:#C68A1E; border-radius:999px;`)}></div></div>
            <div style={css("display:grid; grid-template-columns:repeat(4,1fr); gap:12px; margin-top:18px;")}>
              <div style={css("aspect-ratio:1; border-radius:14px; background:#FFF4E5; display:flex; align-items:center; justify-content:center;")}><svg width="26" height="26" viewbox="0 0 24 24" fill="#C68A1E"><ellipse cx="12" cy="16" rx="5.5" ry="4.5"></ellipse><ellipse cx="5.3" cy="10" rx="2.3" ry="2.9"></ellipse><ellipse cx="9.9" cy="6.4" rx="2.3" ry="2.9"></ellipse><ellipse cx="14.1" cy="6.4" rx="2.3" ry="2.9"></ellipse><ellipse cx="18.7" cy="10" rx="2.3" ry="2.9"></ellipse></svg></div>
              <div style={css("aspect-ratio:1; border-radius:14px; background:#FFF4E5; display:flex; align-items:center; justify-content:center;")}><svg width="26" height="26" viewbox="0 0 24 24" fill="#C68A1E"><ellipse cx="12" cy="16" rx="5.5" ry="4.5"></ellipse><ellipse cx="5.3" cy="10" rx="2.3" ry="2.9"></ellipse><ellipse cx="9.9" cy="6.4" rx="2.3" ry="2.9"></ellipse><ellipse cx="14.1" cy="6.4" rx="2.3" ry="2.9"></ellipse><ellipse cx="18.7" cy="10" rx="2.3" ry="2.9"></ellipse></svg></div>
              <div style={css("aspect-ratio:1; border-radius:14px; background:#FFF4E5; display:flex; align-items:center; justify-content:center;")}><svg width="26" height="26" viewbox="0 0 24 24" fill="#C68A1E"><ellipse cx="12" cy="16" rx="5.5" ry="4.5"></ellipse><ellipse cx="5.3" cy="10" rx="2.3" ry="2.9"></ellipse><ellipse cx="9.9" cy="6.4" rx="2.3" ry="2.9"></ellipse><ellipse cx="14.1" cy="6.4" rx="2.3" ry="2.9"></ellipse><ellipse cx="18.7" cy="10" rx="2.3" ry="2.9"></ellipse></svg></div>
              <div style={css("aspect-ratio:1; border-radius:14px; background:#FFF4E5; display:flex; align-items:center; justify-content:center;")}><svg width="26" height="26" viewbox="0 0 24 24" fill="#C68A1E"><ellipse cx="12" cy="16" rx="5.5" ry="4.5"></ellipse><ellipse cx="5.3" cy="10" rx="2.3" ry="2.9"></ellipse><ellipse cx="9.9" cy="6.4" rx="2.3" ry="2.9"></ellipse><ellipse cx="14.1" cy="6.4" rx="2.3" ry="2.9"></ellipse><ellipse cx="18.7" cy="10" rx="2.3" ry="2.9"></ellipse></svg></div>
              <div style={css("aspect-ratio:1; border-radius:14px; background:#FFF4E5; display:flex; align-items:center; justify-content:center;")}><svg width="26" height="26" viewbox="0 0 24 24" fill="#C68A1E"><ellipse cx="12" cy="16" rx="5.5" ry="4.5"></ellipse><ellipse cx="5.3" cy="10" rx="2.3" ry="2.9"></ellipse><ellipse cx="9.9" cy="6.4" rx="2.3" ry="2.9"></ellipse><ellipse cx="14.1" cy="6.4" rx="2.3" ry="2.9"></ellipse><ellipse cx="18.7" cy="10" rx="2.3" ry="2.9"></ellipse></svg></div>
              <div style={css("aspect-ratio:1; border-radius:14px; background:#F4F5F7; border:2px dashed #DfE2E6; display:flex; align-items:center; justify-content:center;")}><svg width="26" height="26" viewbox="0 0 24 24" fill="#D5D8DD"><ellipse cx="12" cy="16" rx="5.5" ry="4.5"></ellipse><ellipse cx="5.3" cy="10" rx="2.3" ry="2.9"></ellipse><ellipse cx="9.9" cy="6.4" rx="2.3" ry="2.9"></ellipse><ellipse cx="14.1" cy="6.4" rx="2.3" ry="2.9"></ellipse><ellipse cx="18.7" cy="10" rx="2.3" ry="2.9"></ellipse></svg></div>
              <div style={css("aspect-ratio:1; border-radius:14px; background:#F4F5F7; border:2px dashed #DfE2E6; display:flex; align-items:center; justify-content:center;")}><svg width="26" height="26" viewbox="0 0 24 24" fill="#D5D8DD"><ellipse cx="12" cy="16" rx="5.5" ry="4.5"></ellipse><ellipse cx="5.3" cy="10" rx="2.3" ry="2.9"></ellipse><ellipse cx="9.9" cy="6.4" rx="2.3" ry="2.9"></ellipse><ellipse cx="14.1" cy="6.4" rx="2.3" ry="2.9"></ellipse><ellipse cx="18.7" cy="10" rx="2.3" ry="2.9"></ellipse></svg></div>
              <div style={css("aspect-ratio:1; border-radius:14px; background:#F4F5F7; border:2px dashed #DfE2E6; display:flex; align-items:center; justify-content:center;")}><svg width="26" height="26" viewbox="0 0 24 24" fill="#D5D8DD"><ellipse cx="12" cy="16" rx="5.5" ry="4.5"></ellipse><ellipse cx="5.3" cy="10" rx="2.3" ry="2.9"></ellipse><ellipse cx="9.9" cy="6.4" rx="2.3" ry="2.9"></ellipse><ellipse cx="14.1" cy="6.4" rx="2.3" ry="2.9"></ellipse><ellipse cx="18.7" cy="10" rx="2.3" ry="2.9"></ellipse></svg></div>
            </div>
          </div>
          <div style={css("font:800 16px Pretendard; margin:20px 0 12px;")}>미방문 문화시설</div>
          <div style={css("display:flex; flex-direction:column; gap:11px;")}>
            {(v.stamps || []).map((s, $i) => (
            <div key={$i} style={css("background:#fff; border-radius:14px; padding:13px 15px; box-shadow:0 4px 16px rgba(20,20,29,.05); display:flex; align-items:center; gap:12px;")}><div style={css("width:40px; height:40px; border-radius:11px; background:#FFF4E5; color:#C68A1E; display:flex; align-items:center; justify-content:center;")}><span className="msf" style={css("font-size:21px;")}>{["museum","auto_stories","festival"][$i % 3]}</span></div><div style={css("flex:1;")}><div style={css("font:700 14px Pretendard;")}>{s.name}</div><div style={css("font:500 12px Pretendard; color:#8A8F98;")}>{s.theme}</div></div><div style={css("font:700 12px Pretendard; color:#3B5BFE; background:#EEF1FF; padding:8px 13px; border-radius:999px;")}>방문 인증</div></div>
            ))}
          </div>
          <div style={css("font:400 11px Pretendard; color:#A9A8A2; margin-top:16px;")}>데이터: 지역문화통합정보시스템</div>
        </div>
      </div>
    </>) : null}

    
    {v.isVlog ? (<>
      {v.vlogIsCourse ? (<>
        <div data-screen-label="브이로그 코스" style={css("position:absolute; inset:0; z-index:30; background:#F4F5F7; display:flex; flex-direction:column;")}>
          <div style={css("height:50px; display:flex; align-items:center; justify-content:space-between; padding:0 26px 0 30px; flex:none;")}><span style={css("font:700 15px Pretendard;")}>9:41</span><span className="msr" style={css("display:flex; gap:7px; font-size:18px;")}><span>signal_cellular_alt</span><span>wifi</span><span>battery_full</span></span></div>
          <div style={css("padding:4px 22px 6px; flex:none; display:flex; align-items:center; gap:8px;")}><div onClick={v.closeSub} style={css("cursor:pointer;")}><span className="msr" style={css("font-size:24px;")}>close</span></div><span style={css("font:700 16px Pretendard;")}>브이로그 만들기</span></div>
          <div style={css("padding:6px 22px 14px; flex:none; display:flex; gap:6px;")}><div style={css("flex:1; height:3px; background:#3B5BFE; border-radius:999px;")}></div><div style={css("flex:1; height:3px; background:#E0E2E6; border-radius:999px;")}></div><div style={css("flex:1; height:3px; background:#E0E2E6; border-radius:999px;")}></div></div>
          <div className="scr" style={css("flex:1; overflow-y:auto; padding:0 22px 0;")}>
            <div style={css("font-size:23px; font-weight:800; letter-spacing:-0.02em;")}>어떤 코스로 만들까요?</div>
            <div style={css("font:500 14px Pretendard; color:#8A8F98; margin-top:8px;")}>다녀온 코스에서 강아지 시점 영상을 만들어요.</div>
            <div onClick={v.vlogToClips} style={css("margin-top:18px; background:#fff; border:2px solid #3B5BFE; border-radius:18px; padding:14px; box-shadow:0 8px 22px rgba(59,91,254,.12); display:flex; gap:13px; align-items:center; cursor:pointer;")}><div style={css("width:60px; height:60px; border-radius:14px; background:linear-gradient(135deg,#F6D9A6,#E7B776); flex:none;")}></div><div style={css("flex:1;")}><div style={css("font:700 15px Pretendard;")}>전주 한옥마을 반나절</div><div style={css("font:500 12px Pretendard; color:#8A8F98; margin-top:3px;")}>2025.09.14 · 4곳 · 3.2km</div></div><span className="msf" style={css("font-size:24px; color:#3B5BFE;")}>check_circle</span></div>
            <div onClick={v.vlogToClips} style={css("margin-top:12px; background:#fff; border:1px solid #ECEEF1; border-radius:18px; padding:14px; display:flex; gap:13px; align-items:center; cursor:pointer;")}><div style={css("width:60px; height:60px; border-radius:14px; background:linear-gradient(135deg,#CDE6C2,#A7D49A); flex:none;")}></div><div style={css("flex:1;")}><div style={css("font:700 15px Pretendard;")}>전주천변 산책길</div><div style={css("font:500 12px Pretendard; color:#8A8F98; margin-top:3px;")}>2025.08.30 · 2곳 · 1.8km</div></div><span className="msr" style={css("font-size:24px; color:#C7CAD0;")}>radio_button_unchecked</span></div>
          </div>
          <div style={css("padding:14px 22px 22px; flex:none;")}><div onClick={v.vlogToClips} style={css("background:#3B5BFE; color:#fff; font:700 16px Pretendard; text-align:center; padding:17px; border-radius:18px; box-shadow:0 10px 24px rgba(59,91,254,.28); cursor:pointer;")}>다음</div></div>
        </div>
      </>) : null}
      {v.vlogIsClips ? (<>
        <div data-screen-label="클립 선택" style={css("position:absolute; inset:0; z-index:30; background:#F4F5F7; display:flex; flex-direction:column;")}>
          <div style={css("height:50px; display:flex; align-items:center; justify-content:space-between; padding:0 26px 0 30px; flex:none;")}><span style={css("font:700 15px Pretendard;")}>9:41</span><span className="msr" style={css("display:flex; gap:7px; font-size:18px;")}><span>signal_cellular_alt</span><span>wifi</span><span>battery_full</span></span></div>
          <div style={css("padding:4px 22px 6px; flex:none; display:flex; align-items:center; gap:8px;")}><div onClick={v.vlogBackCourse} style={css("cursor:pointer;")}><span className="msr" style={css("font-size:24px;")}>arrow_back_ios_new</span></div><span style={css("font:700 16px Pretendard;")}>담을 순간 고르기</span></div>
          <div style={css("padding:6px 22px 14px; flex:none; display:flex; gap:6px;")}><div style={css("flex:1; height:3px; background:#3B5BFE; border-radius:999px;")}></div><div style={css("flex:1; height:3px; background:#3B5BFE; border-radius:999px;")}></div><div style={css("flex:1; height:3px; background:#E0E2E6; border-radius:999px;")}></div></div>
          <div className="scr" style={css("flex:1; overflow-y:auto; padding:0 22px 0;")}>
            <div style={css("font:500 14px Pretendard; color:#8A8F98;")}>영상에 넣을 장면을 골라요.</div>
            <div style={css("display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-top:16px;")}>
              <div style={css("position:relative; border-radius:16px; overflow:hidden; aspect-ratio:1; background:linear-gradient(135deg,#F6D9A6,#E7B776);")}><div style={css("position:absolute; inset:0; background:linear-gradient(180deg,rgba(0,0,0,0) 50%,rgba(0,0,0,.4));")}></div><div style={css("position:absolute; left:10px; bottom:9px; font:700 12px Pretendard; color:#fff;")}>펟카페</div><div style={css("position:absolute; top:9px; right:9px; width:24px; height:24px; border-radius:50%; background:#3B5BFE; display:flex; align-items:center; justify-content:center;")}><span className="msf" style={css("font-size:15px; color:#fff;")}>check</span></div></div>
              <div style={css("position:relative; border-radius:16px; overflow:hidden; aspect-ratio:1; background:linear-gradient(135deg,#C9B6E4,#A98FD0);")}><div style={css("position:absolute; inset:0; background:linear-gradient(180deg,rgba(0,0,0,0) 50%,rgba(0,0,0,.4));")}></div><div style={css("position:absolute; left:10px; bottom:9px; font:700 12px Pretendard; color:#fff;")}>벽화마을</div><div style={css("position:absolute; top:9px; right:9px; width:24px; height:24px; border-radius:50%; background:#3B5BFE; display:flex; align-items:center; justify-content:center;")}><span className="msf" style={css("font-size:15px; color:#fff;")}>check</span></div></div>
              <div style={css("position:relative; border-radius:16px; overflow:hidden; aspect-ratio:1; background:linear-gradient(135deg,#EAD7C0,#D3B086);")}><div style={css("position:absolute; inset:0; background:linear-gradient(180deg,rgba(0,0,0,0) 50%,rgba(0,0,0,.4));")}></div><div style={css("position:absolute; left:10px; bottom:9px; font:700 12px Pretendard; color:#fff;")}>오목대</div><div style={css("position:absolute; top:9px; right:9px; width:24px; height:24px; border-radius:50%; background:rgba(255,255,255,.55);")}></div></div>
              <div style={css("position:relative; border-radius:16px; overflow:hidden; aspect-ratio:1; background:linear-gradient(135deg,#BFD8C2,#94BE9C);")}><div style={css("position:absolute; inset:0; background:linear-gradient(180deg,rgba(0,0,0,0) 50%,rgba(0,0,0,.4));")}></div><div style={css("position:absolute; left:10px; bottom:9px; font:700 12px Pretendard; color:#fff;")}>펟스테이</div><div style={css("position:absolute; top:9px; right:9px; width:24px; height:24px; border-radius:50%; background:#3B5BFE; display:flex; align-items:center; justify-content:center;")}><span className="msf" style={css("font-size:15px; color:#fff;")}>check</span></div></div>
            </div>
            <div style={css("margin-top:16px; background:#EEF1FF; border-radius:14px; padding:13px 16px; display:flex; align-items:center; gap:9px;")}><span className="msf" style={css("font-size:19px; color:#3B5BFE;")}>movie</span><span style={css("font:600 13px Pretendard; color:#1A1A1D;")}>{v.vlogClipCount || 3}개 클립 선택됨 · 예상 길이 약 0:32</span></div>
          </div>
          <div style={css("padding:14px 22px 22px; flex:none;")}><div onClick={v.vlogToTone} style={css("background:#3B5BFE; color:#fff; font:700 16px Pretendard; text-align:center; padding:17px; border-radius:18px; box-shadow:0 10px 24px rgba(59,91,254,.28); cursor:pointer;")}>다음</div></div>
        </div>
      </>) : null}
      {v.vlogIsTone ? (<>
        <div data-screen-label="톤 선택" style={css("position:absolute; inset:0; z-index:30; background:#F4F5F7; display:flex; flex-direction:column;")}>
          <div style={css("height:50px; display:flex; align-items:center; justify-content:space-between; padding:0 26px 0 30px; flex:none;")}><span style={css("font:700 15px Pretendard;")}>9:41</span><span className="msr" style={css("display:flex; gap:7px; font-size:18px;")}><span>signal_cellular_alt</span><span>wifi</span><span>battery_full</span></span></div>
          <div style={css("padding:4px 22px 6px; flex:none; display:flex; align-items:center; gap:8px;")}><div onClick={v.vlogBackClips} style={css("cursor:pointer;")}><span className="msr" style={css("font-size:24px;")}>arrow_back_ios_new</span></div><span style={css("font:700 16px Pretendard;")}>체리 목소리 톤</span></div>
          <div style={css("padding:6px 22px 14px; flex:none; display:flex; gap:6px;")}><div style={css("flex:1; height:3px; background:#3B5BFE; border-radius:999px;")}></div><div style={css("flex:1; height:3px; background:#3B5BFE; border-radius:999px;")}></div><div style={css("flex:1; height:3px; background:#3B5BFE; border-radius:999px;")}></div></div>
          <div className="scr" style={css("flex:1; overflow-y:auto; padding:0 22px 0;")}>
            <div style={css("font:600 13px Pretendard; color:#8A8F98; margin-bottom:10px;")}>말투 톤</div>
            <div style={css("display:flex; gap:8px; flex-wrap:wrap;")}><span style={css("font:600 13px Pretendard; background:#1A1A1D; color:#fff; padding:9px 15px; border-radius:999px;")}>발랄·귀엽</span><span style={css("font:500 13px Pretendard; background:#fff; border:1px solid #DfE2E6; padding:9px 15px; border-radius:999px;")}>차분·다정</span><span style={css("font:500 13px Pretendard; background:#fff; border:1px solid #DfE2E6; padding:9px 15px; border-radius:999px;")}>코믹</span></div>
            <div style={css("font:600 13px Pretendard; color:#8A8F98; margin:20px 0 10px;")}>배경 음악</div>
            <div style={css("display:flex; flex-direction:column; gap:10px;")}><div style={css("background:#fff; border:2px solid #3B5BFE; border-radius:14px; padding:13px 15px; display:flex; align-items:center; gap:11px;")}><div style={css("width:36px; height:36px; border-radius:10px; background:#EEF1FF; color:#3B5BFE; display:flex; align-items:center; justify-content:center;")}><span className="msf" style={css("font-size:19px;")}>music_note</span></div><span style={css("flex:1; font:700 14px Pretendard;")}>산책하는 기분</span><span className="msf" style={css("font-size:22px; color:#3B5BFE;")}>check_circle</span></div><div style={css("background:#fff; border:1px solid #ECEEF1; border-radius:14px; padding:13px 15px; display:flex; align-items:center; gap:11px;")}><div style={css("width:36px; height:36px; border-radius:10px; background:#EEF1FF; color:#3B5BFE; display:flex; align-items:center; justify-content:center;")}><span className="msf" style={css("font-size:19px;")}>music_note</span></div><span style={css("flex:1; font:700 14px Pretendard;")}>햇살 가득 오후</span><span className="msr" style={css("font-size:22px; color:#C7CAD0;")}>play_circle</span></div></div>
            <div style={css("margin-top:18px; background:#fff; border:1px solid #ECEEF1; border-radius:14px; padding:14px 16px; display:flex; align-items:center; gap:11px;")}><span className="msf" style={css("font-size:20px; color:#3B5BFE;")}>subtitles</span><span style={css("flex:1; font:700 14px Pretendard;")}>강아지 시점 자막</span><div style={css("width:46px; height:27px; border-radius:999px; background:#3B5BFE; position:relative;")}><div style={css("position:absolute; top:3px; right:3px; width:21px; height:21px; border-radius:50%; background:#fff;")}></div></div></div>
          </div>
          <div style={css("padding:14px 22px 22px; flex:none;")}><div onClick={v.vlogToGen} style={css("background:#3B5BFE; color:#fff; font:700 16px Pretendard; text-align:center; padding:17px; border-radius:18px; box-shadow:0 10px 24px rgba(59,91,254,.28); cursor:pointer;")}>브이로그 생성</div></div>
        </div>
      </>) : null}
      {v.vlogIsGen ? (<>
        <div data-screen-label="생성 중" style={css("position:absolute; inset:0; z-index:30; background:#F4F5F7; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:0 40px; text-align:center;")}>
          <div style={css("position:relative; width:120px; height:120px;")}><div style={css("position:absolute; inset:0; border-radius:50%; border:5px solid #EEF1FF;")}></div><div style={css("position:absolute; inset:0; border-radius:50%; border:5px solid transparent; border-top-color:#3B5BFE; border-right-color:#3B5BFE; transform:rotate(48deg);")}></div><div style={css("position:absolute; inset:0; display:flex; align-items:center; justify-content:center; color:#3B5BFE;")}><span className="msf" style={css("font-size:44px;")}>movie</span></div></div>
          <div style={css("font-size:22px; font-weight:800; letter-spacing:-0.02em; margin-top:28px;")}>체리의 하루를 편집하는 중</div>
          <div style={css("font:500 14px Pretendard; color:#8A8F98; margin-top:8px;")}>멍! 내 시점으로 영상 만들고 있어, 조금만 기다려줘</div>
          <div onClick={v.vlogToDone} style={css("margin-top:24px; background:#EEF1FF; color:#3B5BFE; font:700 15px Pretendard; padding:14px 28px; border-radius:16px; cursor:pointer;")}>완성 영상 보기</div>
        </div>
      </>) : null}
      {v.vlogIsDone ? (<>
      <div data-screen-label="브이로그" style={css("position:absolute; inset:0; z-index:30; background:#1A1A1D; display:flex; flex-direction:column;")}>
        <div style={css("position:absolute; inset:0; background:linear-gradient(160deg,#D9B98A,#A9C99B);")}></div>
        <div style={css("position:absolute; inset:0; background:linear-gradient(180deg,rgba(0,0,0,.3),rgba(0,0,0,0) 28%,rgba(0,0,0,.55));")}></div>
        <div style={css("height:50px; display:flex; align-items:center; justify-content:space-between; padding:0 26px 0 30px; flex:none; position:relative; z-index:1; color:#fff;")}><span style={css("font:700 15px Pretendard;")}>9:41</span><span className="msr" style={css("display:flex; gap:7px; font-size:18px;")}><span>signal_cellular_alt</span><span>wifi</span><span>battery_full</span></span></div>
        <div onClick={v.closeSub} style={css("position:absolute; top:54px; left:22px; z-index:2; width:36px; height:36px; border-radius:50%; background:rgba(0,0,0,.35); display:flex; align-items:center; justify-content:center; color:#fff; cursor:pointer;")}><span className="msr" style={css("font-size:20px;")}>close</span></div>
        <div style={css("flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; position:relative; z-index:1;")}><div style={css("width:80px; height:80px; border-radius:50%; background:rgba(255,255,255,.92); display:flex; align-items:center; justify-content:center; box-shadow:0 12px 30px rgba(0,0,0,.25);")}><span className="msf" style={css("font-size:40px; color:#3B5BFE; margin-left:4px;")}>play_arrow</span></div><div style={css("display:inline-flex; align-items:center; gap:6px; font:700 12px Pretendard; color:#fff; background:rgba(0,0,0,.4); padding:7px 13px; border-radius:999px; margin-top:20px;")}><span className="msf" style={css("font-size:14px;")}>auto_awesome</span>AI 자동 생성 · 0:32</div></div>
        <div style={css("padding:0 24px 40px; position:relative; z-index:1; color:#fff;")}>
          <div style={css("display:inline-flex; align-items:center; gap:7px; font:600 13px Pretendard; color:#fff; background:rgba(0,0,0,.42); padding:9px 14px; border-radius:14px; margin-bottom:16px;")}><span className="msf" style={css("font-size:15px;")}>subtitles</span>멍! 오늘 한옥마을 돌담길 최고였어</div>
          <div style={css("display:flex; align-items:center; gap:10px;")}><div style={css("width:40px; height:40px; border-radius:50%; background:radial-gradient(circle at 38% 28%, #FCE6BC, #F4C98A 52%, #DFA45E); flex:none;")}></div><div style={css("flex:1;")}><div style={css("font:700 15px Pretendard;")}>체리의 하루</div><div style={css("font:500 12px Pretendard; opacity:.85;")}>전주 한옥마을 반나절 · 강아지 시점</div></div><div style={css("display:flex; flex-direction:column; align-items:center; gap:3px;")}><span className="msf" style={css("font-size:26px; color:#FF6B5C;")}>favorite</span><span style={css("font:700 11px Pretendard;")}>209</span></div></div>
          <div style={css("display:flex; gap:10px; margin-top:18px;")}><div style={css("flex:1; background:#3B5BFE; color:#fff; font:700 15px Pretendard; text-align:center; padding:15px; border-radius:16px; display:flex; align-items:center; justify-content:center; gap:7px;")}><span className="msf" style={css("font-size:19px;")}>ios_share</span>공유</div><div style={css("width:54px; flex:none; background:rgba(255,255,255,.2); color:#fff; display:flex; align-items:center; justify-content:center; border-radius:16px;")}><span className="msf" style={css("font-size:22px;")}>download</span></div></div>
        </div>
      </div>
      </>) : null}
    </>) : null}

    
    {v.isAccess ? (<>
      <div data-screen-label="이동약자 배려" style={css("position:absolute; inset:0; z-index:30; background:#F4F5F7; display:flex; flex-direction:column;")}>
        <div style={css("height:50px; display:flex; align-items:center; justify-content:space-between; padding:0 26px 0 30px; flex:none;")}><span style={css("font:700 15px Pretendard;")}>9:41</span><span className="msr" style={css("display:flex; gap:7px; font-size:18px;")}><span>signal_cellular_alt</span><span>wifi</span><span>battery_full</span></span></div>
        <div style={css("padding:4px 22px 10px; flex:none; display:flex; align-items:center; gap:12px;")}><div onClick={v.closeSub} style={css("cursor:pointer;")}><span className="msr" style={css("font-size:24px;")}>arrow_back_ios_new</span></div><span style={css("font:800 18px Pretendard;")}>이동약자 배려 시설</span></div>
        <div className="scr" style={css("flex:1; overflow-y:auto; padding:6px 22px 28px;")}>
          <div style={css("font:500 13px Pretendard; color:#5A5F68; line-height:1.5;")}>시니어·장애 보호자와 반려동물이 함께 갈 수 있는 곳</div>
          <div style={css("margin-top:14px; display:flex; background:#ECEEF1; border-radius:999px; padding:3px;")}><div onClick={v.accOff} style={css(`flex:1; text-align:center; font:700 13px Pretendard; padding:9px; border-radius:999px; cursor:pointer; background:${v.accOffBg}; color:${v.accOffTx};`)}>전체 시설</div><div onClick={v.accOn} style={css(`flex:1; text-align:center; font:700 13px Pretendard; padding:9px; border-radius:999px; cursor:pointer; background:${v.accOnBg}; color:${v.accOnTx};`)}>배려 시설만</div></div>
          <div style={css("margin-top:14px; background:#EEF1FF; border-radius:12px; padding:11px 14px; display:flex; align-items:center; gap:8px;")}><span className="msf" style={css("font-size:17px; color:#3B5BFE;")}>info</span><span style={css("font:500 12px Pretendard; color:#5A5F68;")}>배려 시설만 으로 켜면 동반 가능 + 이동약자 배려를 동시 만족하는 곳만 보여요.</span></div>
          <div style={css("margin-top:16px; display:flex; flex-direction:column; gap:12px;")}>
            {v.accessIsOff ? (<>
              <div style={css("background:#fff; border-radius:18px; padding:14px; box-shadow:0 6px 20px rgba(20,20,29,.06);")}>
                <div style={css("display:flex; gap:13px;")}><div style={css("width:72px; height:72px; border-radius:14px; background:linear-gradient(135deg,#EAD7C0,#D3B086); flex:none;")}></div><div style={css("flex:1;")}><div style={css("font:700 15px Pretendard;")}>오목대 전망 카페</div><div style={css("font:500 12px Pretendard; color:#8A8F98; margin-top:3px;")}>카페 · 도보 7분 · 2층</div><div style={css("display:flex; gap:6px; margin-top:8px;")}><span style={css("display:inline-flex; align-items:center; gap:3px; font:600 11px Pretendard; background:#EEF1FF; color:#3B5BFE; padding:5px 9px; border-radius:999px;")}><span className="msf" style={css("font-size:12px;")}>check_circle</span>동반 가능</span><span style={css("display:inline-flex; align-items:center; gap:3px; font:600 11px Pretendard; background:#FFF1EF; color:#FF6B5C; padding:5px 9px; border-radius:999px;")}>계단 있음</span></div></div></div>
              </div>
            </>) : null}
            {(v.inclusivePlaces || []).map((place) => (<div key={place.$index} style={css("background:#fff; border-radius:18px; padding:14px; box-shadow:0 6px 20px rgba(20,20,29,.06);")}>
              <div style={css("display:flex; gap:13px;")}><div style={css(`width:72px; height:72px; border-radius:14px; background:${["linear-gradient(135deg,#F6D9A6,#E7B776)","linear-gradient(135deg,#CDE6C2,#A7D49A)","linear-gradient(135deg,#BFD3F0,#8FAEE0)"][place.$index % 3]}; flex:none;`)}></div><div style={css("flex:1;")}><div style={css("font:700 15px Pretendard;")}>{place.name}</div><div style={css("font:500 12px Pretendard; color:#8A8F98; margin-top:3px;")}>{place.category}</div><div style={css("display:inline-flex; align-items:center; gap:3px; font:600 11px Pretendard; background:#EEF1FF; color:#3B5BFE; padding:5px 9px; border-radius:999px; margin-top:8px;")}><span className="msf" style={css("font-size:12px;")}>check_circle</span>동반 가능</div></div></div>
              <div style={css("display:flex; gap:6px; flex-wrap:wrap; margin-top:11px;")}>{(place.accessLabels || []).map((label, $j) => (<span key={$j} style={css("display:inline-flex; align-items:center; gap:4px; font:600 11px Pretendard; background:#F4F5F7; border:1px solid #ECEEF1; padding:6px 10px; border-radius:999px;")}><span className="msf" style={css("font-size:13px; color:#3B5BFE;")}>accessible</span>{label}</span>))}</div>
            </div>))}
          </div>
          <div style={css("font:400 11px Pretendard; color:#A9A8A2; margin-top:16px;")}>데이터: 한국관광공사 무장애 여행 정보</div>
          {v.accessIsOn ? (<>
            <div style={css("margin-top:18px; background:#fff; border-radius:18px; padding:18px; box-shadow:0 6px 20px rgba(20,20,29,.06);")}>
              <div style={css("font:800 15px Pretendard;")}>배려 배지 안내</div>
              <div style={css("display:flex; flex-direction:column; gap:12px; margin-top:14px;")}>
                <div style={css("display:flex; align-items:center; gap:11px;")}><div style={css("width:36px; height:36px; border-radius:10px; background:#EEF6FF; color:#3B5BFE; display:flex; align-items:center; justify-content:center; flex:none;")}><span className="msf" style={css("font-size:20px;")}>accessible</span></div><div><div style={css("font:700 13px Pretendard;")}>휠체어 접근</div><div style={css("font:500 12px Pretendard; color:#8A8F98;")}>입구·내부 휠체어 이동 가능</div></div></div>
                <div style={css("display:flex; align-items:center; gap:11px;")}><div style={css("width:36px; height:36px; border-radius:10px; background:#EEF6FF; color:#3B5BFE; display:flex; align-items:center; justify-content:center; flex:none;")}><span className="msf" style={css("font-size:20px;")}>ramp_right</span></div><div><div style={css("font:700 13px Pretendard;")}>경사로</div><div style={css("font:500 12px Pretendard; color:#8A8F98;")}>계단 대신 경사로 설치</div></div></div>
                <div style={css("display:flex; align-items:center; gap:11px;")}><div style={css("width:36px; height:36px; border-radius:10px; background:#EEF6FF; color:#3B5BFE; display:flex; align-items:center; justify-content:center; flex:none;")}><span className="msf" style={css("font-size:20px;")}>remove_road</span></div><div><div style={css("font:700 13px Pretendard;")}>단차 없음</div><div style={css("font:500 12px Pretendard; color:#8A8F98;")}>출입구 턱턱 없이 평탄</div></div></div>
                <div style={css("display:flex; align-items:center; gap:11px;")}><div style={css("width:36px; height:36px; border-radius:10px; background:#EEF6FF; color:#3B5BFE; display:flex; align-items:center; justify-content:center; flex:none;")}><span className="msf" style={css("font-size:20px;")}>width_full</span></div><div><div style={css("font:700 13px Pretendard;")}>넓은 통로</div><div style={css("font:500 12px Pretendard; color:#8A8F98;")}>이동장·유모차 통행 폭</div></div></div>
              </div>
            </div>
          </>) : null}
        </div>
      </div>
    </>) : null}

    
    {v.isPassport ? (<>
      <div data-screen-label="펫 패스포트" style={css("position:absolute; inset:0; z-index:30; background:#F4F5F7; display:flex; flex-direction:column;")}>
        <div style={css("height:50px; display:flex; align-items:center; justify-content:space-between; padding:0 26px 0 30px; flex:none;")}><span style={css("font:700 15px Pretendard;")}>9:41</span><span className="msr" style={css("display:flex; gap:7px; font-size:18px;")}><span>signal_cellular_alt</span><span>wifi</span><span>battery_full</span></span></div>
        <div style={css("padding:4px 22px 10px; flex:none; display:flex; align-items:center; gap:12px;")}><div onClick={v.closeSub} style={css("cursor:pointer;")}><span className="msr" style={css("font-size:24px;")}>arrow_back_ios_new</span></div><span style={css("font:800 18px Pretendard;")}>펫 패스포트</span></div>
        <div className="scr" style={css("flex:1; overflow-y:auto; padding:6px 22px 28px;")}>
          <div style={css("background:linear-gradient(160deg,#2E49D8,#3B5BFE 55%,#7B93FF); border-radius:22px; padding:22px; color:#fff; box-shadow:0 12px 30px rgba(59,91,254,.28); position:relative; overflow:hidden;")}>
            <svg width="150" height="150" viewbox="0 0 24 24" fill="rgba(255,255,255,.1)" style={css("position:absolute; right:-26px; top:10px;")}><ellipse cx="12" cy="16" rx="5.5" ry="4.5"></ellipse><ellipse cx="5.3" cy="10" rx="2.3" ry="2.9"></ellipse><ellipse cx="9.9" cy="6.4" rx="2.3" ry="2.9"></ellipse><ellipse cx="14.1" cy="6.4" rx="2.3" ry="2.9"></ellipse><ellipse cx="18.7" cy="10" rx="2.3" ry="2.9"></ellipse></svg>
            <div style={css("font:700 12px Pretendard; opacity:.85;")}>PET PASSPORT</div>
            <div style={css("display:flex; align-items:center; gap:14px; margin-top:14px;")}><div style={css("width:58px; height:58px; border-radius:50%; background:linear-gradient(135deg,#F8D9A8,#EBB06A); flex:none;")}></div><div><div style={css("font:800 22px Pretendard;")}>체리</div><div style={css("font:500 13px Pretendard; opacity:.85;")}>골든 리트리버 · 3살</div></div></div>
            <div style={css("display:flex; gap:18px; margin-top:18px; padding-top:16px; border-top:1px solid rgba(255,255,255,.2);")}><div><div style={css("font:800 20px Pretendard;")}>14</div><div style={css("font:500 11px Pretendard; opacity:.8;")}>방문</div></div><div><div style={css("font:800 20px Pretendard;")}>{v.petStampCount}</div><div style={css("font:500 11px Pretendard; opacity:.8;")}>스탬프</div></div><div><div style={css("font:800 20px Pretendard;")}>3</div><div style={css("font:500 11px Pretendard; opacity:.8;")}>뱃지</div></div></div>
          </div>
          <div style={css("font:800 16px Pretendard; margin:20px 0 12px;")}>획득 뱃지</div>
          <div style={css("display:flex; gap:12px;")}>
            <div style={css("flex:1; background:#fff; border-radius:16px; padding:16px 10px; text-align:center; box-shadow:0 4px 16px rgba(20,20,29,.05);")}><div style={css("width:46px; height:46px; border-radius:50%; background:#EEF1FF; color:#3B5BFE; display:flex; align-items:center; justify-content:center; margin:0 auto;")}><span className="msf" style={css("font-size:24px;")}>explore</span></div><div style={css("font:700 12px Pretendard; margin-top:9px;")}>첫 나들이</div></div>
            <div style={css("flex:1; background:#fff; border-radius:16px; padding:16px 10px; text-align:center; box-shadow:0 4px 16px rgba(20,20,29,.05);")}><div style={css("width:46px; height:46px; border-radius:50%; background:#EAF6EE; color:#22A565; display:flex; align-items:center; justify-content:center; margin:0 auto;")}><span className="msf" style={css("font-size:24px;")}>forest</span></div><div style={css("font:700 12px Pretendard; margin-top:9px;")}>둘레길 완주</div></div>
            <div style={css("flex:1; background:#fff; border-radius:16px; padding:16px 10px; text-align:center; box-shadow:0 4px 16px rgba(20,20,29,.05);")}><div style={css("width:46px; height:46px; border-radius:50%; background:#FFF4E5; color:#C68A1E; display:flex; align-items:center; justify-content:center; margin:0 auto;")}><span className="msf" style={css("font-size:24px;")}>approval</span></div><div style={css("font:700 12px Pretendard; margin-top:9px;")}>스탬프 5</div></div>
          </div>
          <div style={css("font:800 16px Pretendard; margin:20px 0 12px;")}>최근 방문 기록</div>
          <div style={css("background:#fff; border-radius:16px; padding:4px 16px; box-shadow:0 4px 16px rgba(20,20,29,.05);")}>
            {(v.petStampsView || []).map((stamp) => (<div key={stamp.stamp_spot_id} style={css(`display:flex; align-items:center; justify-content:space-between; padding:13px 0; ${stamp.$index < v.petStampCount - 1 ? 'border-bottom:1px solid #ECEEF1;' : ''}`)}><span style={css("font:600 14px Pretendard;")}>{stamp.spot_name}</span><span style={css("font:500 12px Pretendard; color:#8A8F98;")}>{stamp.dateLabel}</span></div>))}
          </div>
        </div>
      </div>
    </>) : null}

    
    {v.isTraits ? (<>
      <div data-screen-label="특징 편집" style={css("position:absolute; inset:0; z-index:50; background:#F4F5F7; display:flex; flex-direction:column;")}>
        <div style={css("height:50px; display:flex; align-items:center; justify-content:space-between; padding:0 26px 0 30px; flex:none;")}><span style={css("font:700 15px Pretendard;")}>9:41</span><span className="msr" style={css("display:flex; gap:7px; font-size:18px;")}><span>signal_cellular_alt</span><span>wifi</span><span>battery_full</span></span></div>
        <div style={css("padding:4px 22px 10px; flex:none; display:flex; align-items:center; gap:12px;")}><div onClick={v.closeSub} style={css("cursor:pointer;")}><span className="msr" style={css("font-size:24px;")}>arrow_back_ios_new</span></div><span style={css("font:800 18px Pretendard;")}>특징 편집</span></div>
        <div className="scr" style={css("flex:1; overflow-y:auto; padding:6px 22px 28px;")}>
          <div style={css("font:500 14px Pretendard; color:#8A8F98;")}>정해진 메뉴에서 선택해요. 동선·입장 판정에 반영됩니다.</div>
          <div style={css("margin-top:12px; background:#EEF1FF; border-radius:14px; padding:13px 15px; display:flex; gap:9px; align-items:center;")}><span className="msf" style={css("font-size:18px; color:#3B5BFE; flex:none;")}>lock</span><span style={css("font:500 12px Pretendard; color:#5A5F68; line-height:1.5;")}>정확한 추천을 위해 <b style={css("color:#3B5BFE;")}>직접 입력은 비활성화</b>돼 있어요. 아래 메뉴에서만 선택할 수 있어요.</span></div>
          <div style={css("margin-top:16px; background:#fff; border:1px solid #ECEEF1; border-radius:14px; padding:13px 15px; display:flex; align-items:center; gap:10px; opacity:.6;")}><span className="msf" style={css("font-size:18px; color:#C7CAD0;")}>edit_off</span><span style={css("flex:1; font:500 13px Pretendard; color:#A9A8A2;")}>직접 입력 (비활성화)</span><span className="msf" style={css("font-size:17px; color:#C7CAD0;")}>lock</span></div>
          <div style={css("font:600 13px Pretendard; color:#8A8F98; margin:20px 0 10px;")}>활동 성향</div>
          <div style={css("display:flex; gap:8px; flex-wrap:wrap;")}>{["활동량 많음", "보통", "차분함"].map((t, $i) => (<span key={$i} onClick={v.setTrait('traitActivity', t)} style={css(`font:600 13px Pretendard; padding:9px 15px; border-radius:999px; cursor:pointer; ${v.taActivity === t ? 'background:#1A1A1D; color:#fff;' : 'background:#fff; border:1px solid #DfE2E6;'}`)}>{t}</span>))}</div>
          <div style={css("font:600 13px Pretendard; color:#8A8F98; margin:20px 0 10px;")}>사회성</div>
          <div style={css("display:flex; gap:8px; flex-wrap:wrap;")}>{["사람 좋아함", "낯가림", "겁 많음"].map((t, $i) => (<span key={$i} onClick={v.setTrait('traitSocial', t)} style={css(`font:600 13px Pretendard; padding:9px 15px; border-radius:999px; cursor:pointer; ${v.taSocial === t ? 'background:#1A1A1D; color:#fff;' : 'background:#fff; border:1px solid #DfE2E6;'}`)}>{t}</span>))}</div>
          <div style={css("font:600 13px Pretendard; color:#8A8F98; margin:20px 0 10px;")}>체질 주의</div>
          <div style={css("display:flex; gap:8px; flex-wrap:wrap;")}>{["더위 취약", "추위 취약", "관절 주의"].map((t, $i) => (<span key={$i} onClick={v.setTrait('traitBody', t)} style={css(`display:inline-flex; align-items:center; gap:5px; font:600 13px Pretendard; padding:9px 15px; border-radius:999px; cursor:pointer; ${v.taBody === t ? 'background:#FF6B5C; color:#fff;' : 'background:#fff; border:1px solid #DfE2E6;'}`)}>{t === '더위 취약' ? (<span className="msf" style={css("font-size:15px;")}>sunny</span>) : null}{t}</span>))}</div>
        </div>
        <div style={css("padding:14px 22px 22px; flex:none;")}><div onClick={v.closeSub} style={css("background:#3B5BFE; color:#fff; font:700 16px Pretendard; text-align:center; padding:17px; border-radius:18px; box-shadow:0 10px 24px rgba(59,91,254,.28); cursor:pointer;")}>저장</div></div>
      </div>
    </>) : null}

    
    {v.isBadges ? (<>
      <div data-screen-label="배지 시스템" style={css("position:absolute; inset:0; z-index:30; background:#F4F5F7; display:flex; flex-direction:column;")}>
        <div style={css("height:50px; display:flex; align-items:center; justify-content:space-between; padding:0 26px 0 30px; flex:none;")}><span style={css("font:700 15px Pretendard;")}>9:41</span><span className="msr" style={css("display:flex; gap:7px; font-size:18px;")}><span>signal_cellular_alt</span><span>wifi</span><span>battery_full</span></span></div>
        <div style={css("padding:4px 22px 10px; flex:none; display:flex; align-items:center; gap:12px;")}><div onClick={v.closeSub} style={css("cursor:pointer;")}><span className="msr" style={css("font-size:24px;")}>arrow_back_ios_new</span></div><span style={css("font:800 18px Pretendard;")}>동반 규정 배지</span></div>
        <div className="scr" style={css("flex:1; overflow-y:auto; padding:6px 22px 28px;")}>
          <div style={css("font:500 13px Pretendard; color:#5A5F68; line-height:1.5;")}>시설 카드와 상세에 공통으로 쓰는 배지예요.</div>
          {v.hasPolicy ? (<div style={css("margin-top:16px; background:#EEF1FF; border-radius:16px; padding:16px;")}>
            <div style={css("display:inline-flex; align-items:center; gap:5px; font:700 12px Pretendard; color:#3B5BFE;")}><span className="msf" style={css("font-size:15px;")}>auto_awesome</span>AI 규정 분석</div>
            <div style={css("font:500 13px Pretendard; color:#5A5F68; line-height:1.5; margin-top:8px;")}>{v.policySource}</div>
            <div style={css("display:flex; gap:6px; flex-wrap:wrap; margin-top:12px;")}>{(v.policyBadges || []).map((b, $j) => (<span key={$j} style={css("font:700 11px Pretendard; background:#fff; color:#3B5BFE; padding:7px 12px; border-radius:999px; box-shadow:0 2px 8px rgba(59,91,254,.12);")}>{b.label}</span>))}</div>
          </div>) : null}
          <div style={css("margin-top:16px; display:flex; flex-direction:column; gap:12px;")}>
            <div style={css("background:#fff; border-radius:16px; padding:15px; box-shadow:0 4px 16px rgba(20,20,29,.05); display:flex; align-items:center; gap:13px;")}><div style={css("width:44px; height:44px; border-radius:13px; background:#EEF1FF; color:#3B5BFE; display:flex; align-items:center; justify-content:center; flex:none;")}><span className="msf" style={css("font-size:24px;")}>pets</span></div><div><div style={css("font:700 14px Pretendard;")}>목줄 필수</div><div style={css("font:500 12px Pretendard; color:#8A8F98; margin-top:2px;")}>실내외 모두 리드줄 착용</div></div></div>
            <div style={css("background:#fff; border-radius:16px; padding:15px; box-shadow:0 4px 16px rgba(20,20,29,.05); display:flex; align-items:center; gap:13px;")}><div style={css("width:44px; height:44px; border-radius:13px; background:#FFF4E5; color:#C68A1E; display:flex; align-items:center; justify-content:center; flex:none;")}><span className="msf" style={css("font-size:24px;")}>backpack</span></div><div><div style={css("font:700 14px Pretendard;")}>이동장 필수</div><div style={css("font:500 12px Pretendard; color:#8A8F98; margin-top:2px;")}>이동 시 켄넬·캐리어 필요</div></div></div>
            <div style={css("background:#fff; border-radius:16px; padding:15px; box-shadow:0 4px 16px rgba(20,20,29,.05); display:flex; align-items:center; gap:13px;")}><div style={css("width:44px; height:44px; border-radius:13px; background:#EEF1FF; color:#3B5BFE; display:flex; align-items:center; justify-content:center; flex:none;")}><span className="msf" style={css("font-size:24px;")}>check_circle</span></div><div><div style={css("font:700 14px Pretendard;")}>실내 가능</div><div style={css("font:500 12px Pretendard; color:#8A8F98; margin-top:2px;")}>매장 내부 동반 입장 가능</div></div></div>
            <div style={css("background:#fff; border-radius:16px; padding:15px; box-shadow:0 4px 16px rgba(20,20,29,.05); display:flex; align-items:center; gap:13px;")}><div style={css("width:44px; height:44px; border-radius:13px; background:#EEF1FF; color:#3B5BFE; display:flex; align-items:center; justify-content:center; flex:none;")}><span className="msf" style={css("font-size:24px;")}>payments</span></div><div><div style={css("font:700 14px Pretendard;")}>추가요금</div><div style={css("font:500 12px Pretendard; color:#8A8F98; margin-top:2px;")}>반려동물 이용료 별도 (예: 5천)</div></div></div>
            <div style={css("background:#fff; border-radius:16px; padding:15px; box-shadow:0 4px 16px rgba(20,20,29,.05); display:flex; align-items:center; gap:13px;")}><div style={css("width:44px; height:44px; border-radius:13px; background:#EEF1FF; color:#3B5BFE; display:flex; align-items:center; justify-content:center; flex:none;")}><span className="msf" style={css("font-size:24px;")}>straighten</span></div><div style={css("flex:1;")}><div style={css("font:700 14px Pretendard;")}>동반 크기</div><div style={css("font:500 12px Pretendard; color:#8A8F98; margin-top:2px;")}>소·중·대형 허용 범위 표기</div></div></div>
          </div>
          <div style={css("display:flex; gap:8px; margin-top:14px;")}><span style={css("flex:1; text-align:center; font:700 13px Pretendard; background:#EEF1FF; color:#3B5BFE; padding:11px; border-radius:12px;")}>소형 OK</span><span style={css("flex:1; text-align:center; font:700 13px Pretendard; background:#EEF1FF; color:#3B5BFE; padding:11px; border-radius:12px;")}>중형 OK</span><span style={css("flex:1; text-align:center; font:700 13px Pretendard; background:#1A1A1D; color:#fff; padding:11px; border-radius:12px;")}>대형 OK</span></div>
        </div>
      </div>
    </>) : null}

    
    {v.isJudge ? (<>
      <div data-screen-label="입장 판정" style={css("position:absolute; inset:0; z-index:30; background:#F4F5F7; display:flex; flex-direction:column;")}>
        <div style={css("height:50px; display:flex; align-items:center; justify-content:space-between; padding:0 26px 0 30px; flex:none;")}><span style={css("font:700 15px Pretendard;")}>9:41</span><span className="msr" style={css("display:flex; gap:7px; font-size:18px;")}><span>signal_cellular_alt</span><span>wifi</span><span>battery_full</span></span></div>
        <div style={css("padding:4px 22px 10px; flex:none; display:flex; align-items:center; gap:12px;")}><div onClick={v.closeSub} style={css("cursor:pointer;")}><span className="msr" style={css("font-size:24px;")}>arrow_back_ios_new</span></div><span style={css("font:800 18px Pretendard;")}>체리 기준 입장 판정</span></div>
        <div className="scr" style={css("flex:1; overflow-y:auto; padding:6px 22px 28px;")}>
          <div style={css("font:500 13px Pretendard; color:#5A5F68;")}>대형견 · 28kg · 일반 두상으로 자동 확인했어요.</div>
          <div style={css("margin-top:16px; background:#fff; border-radius:18px; padding:18px; box-shadow:0 6px 20px rgba(20,20,29,.06); border-left:4px solid #22A565;")}>
            <div style={css("display:flex; align-items:center; gap:12px;")}><div style={css("width:44px; height:44px; border-radius:13px; background:#E5F6EE; color:#22A565; display:flex; align-items:center; justify-content:center; flex:none;")}><span className="msf" style={css("font-size:26px;")}>verified</span></div><div style={css("flex:1;")}><div style={css("font:800 16px Pretendard; color:#22A565;")}>{v.facilityName} · {v.verdictLabel}</div><div style={css("font:500 13px Pretendard; color:#5A5F68; margin-top:3px;")}>{v.verdictMessage}</div></div></div>
            <div style={css("display:flex; gap:6px; flex-wrap:wrap; margin-top:14px;")}><span style={css("font:600 11px Pretendard; background:#E5F6EE; color:#1B8A55; padding:6px 11px; border-radius:999px;")}>대형견 OK</span><span style={css("font:600 11px Pretendard; background:#F4F5F7; color:#5A5F68; padding:6px 11px; border-radius:999px; border:1px solid #ECEEF1;")}>목줄 필수</span></div>
          </div>
          <div style={css("margin-top:14px; background:#fff; border-radius:18px; padding:18px; box-shadow:0 6px 20px rgba(20,20,29,.06); border-left:4px solid #FF6B5C;")}>
            <div style={css("display:flex; align-items:center; gap:12px;")}><div style={css("width:44px; height:44px; border-radius:13px; background:#FFF1EF; color:#FF6B5C; display:flex; align-items:center; justify-content:center; flex:none;")}><span className="msf" style={css("font-size:26px;")}>do_not_disturb_on</span></div><div style={css("flex:1;")}><div style={css("font:800 16px Pretendard; color:#E0533F;")}>소품샵 코코 · 불가</div><div style={css("font:500 13px Pretendard; color:#5A5F68; margin-top:3px;")}>8kg 이하 소형견만 동반 가능</div></div></div>
            <div style={css("display:flex; gap:6px; flex-wrap:wrap; margin-top:14px;")}><span style={css("font:600 11px Pretendard; background:#FFF1EF; color:#E0533F; padding:6px 11px; border-radius:999px;")}>대형견 불가</span><span style={css("font:600 11px Pretendard; background:#F4F5F7; color:#5A5F68; padding:6px 11px; border-radius:999px; border:1px solid #ECEEF1;")}>소형만</span></div>
            <div style={css("margin-top:14px; background:#F4F5F7; border-radius:12px; padding:11px 14px; display:flex; align-items:center; gap:8px;")}><span className="msr" style={css("font-size:18px; color:#3B5BFE;")}>lightbulb</span><span style={css("font:600 12px Pretendard; color:#5A5F68;")}>근처 <b style={css("color:#3B5BFE;")}>대형견 가능 카페 3곳</b> 대신 볼까요?</span></div>
          </div>
        </div>
        <div style={css("padding:14px 22px 22px; flex:none;")}><div onClick={v.closeSub} style={css("background:#3B5BFE; color:#fff; font:700 16px Pretendard; text-align:center; padding:17px; border-radius:18px; box-shadow:0 10px 24px rgba(59,91,254,.28); cursor:pointer;")}>가능한 곳만 코스에 담기</div></div>
      </div>
    </>) : null}

    
    {v.isDine ? (<>
      <div data-screen-label="식당 예약" style={css("position:absolute; inset:0; z-index:30; background:#F4F5F7; display:flex; flex-direction:column;")}>
        <div style={css("height:50px; display:flex; align-items:center; justify-content:space-between; padding:0 26px 0 30px; flex:none;")}><span style={css("font:700 15px Pretendard;")}>9:41</span><span className="msr" style={css("display:flex; gap:7px; font-size:18px;")}><span>signal_cellular_alt</span><span>wifi</span><span>battery_full</span></span></div>
        <div style={css("padding:4px 22px 10px; flex:none; display:flex; align-items:center; gap:12px;")}><div onClick={v.closeSub} style={css("cursor:pointer;")}><span className="msr" style={css("font-size:24px;")}>arrow_back_ios_new</span></div><span style={css("font:800 18px Pretendard;")}>식당 예약</span></div>
        <div className="scr" style={css("flex:1; overflow-y:auto; padding:6px 22px 28px;")}>
          <div style={css("background:#fff; border-radius:18px; padding:16px; box-shadow:0 4px 16px rgba(20,20,29,.05); display:flex; gap:13px; align-items:center;")}><div style={css("width:60px; height:60px; border-radius:14px; background:linear-gradient(135deg,#F6D9A6,#E7B776); flex:none;")}></div><div><div style={css("font:800 16px Pretendard;")}>{v.dinePlaceName}</div><div style={css("font:500 12px Pretendard; color:#8A8F98; margin-top:3px;")}>반려동물 동반 식당 · 전주</div></div></div>
          <div style={css("font:600 13px Pretendard; color:#8A8F98; margin:20px 0 10px;")}>날짜</div>
          <div style={css("display:flex; gap:8px; overflow:hidden;")}><span style={css("font:700 13px Pretendard; background:#fff; border:1px solid #DfE2E6; padding:10px 14px; border-radius:14px; flex:none;")}>오늘</span><span style={css("font:700 13px Pretendard; background:#1A1A1D; color:#fff; padding:10px 14px; border-radius:14px; flex:none;")}>내일 토</span><span style={css("font:700 13px Pretendard; background:#fff; border:1px solid #DfE2E6; padding:10px 14px; border-radius:14px; flex:none;")}>일</span></div>
          <div style={css("font:600 13px Pretendard; color:#8A8F98; margin:20px 0 10px;")}>시간</div>
          <div style={css("display:flex; gap:8px; flex-wrap:wrap;")}><span style={css("font:700 13px Pretendard; background:#fff; border:1px solid #DfE2E6; padding:10px 14px; border-radius:14px;")}>12:00</span><span style={css("font:700 13px Pretendard; background:#3B5BFE; color:#fff; padding:10px 14px; border-radius:14px;")}>13:00</span><span style={css("font:700 13px Pretendard; background:#fff; border:1px solid #DfE2E6; padding:10px 14px; border-radius:14px;")}>14:00</span><span style={css("font:700 13px Pretendard; background:#fff; border:1px solid #DfE2E6; padding:10px 14px; border-radius:14px;")}>18:00</span></div>
          <div style={css("font:600 13px Pretendard; color:#8A8F98; margin:20px 0 10px;")}>인원 · 반려견</div>
          <div style={css("background:#fff; border-radius:16px; padding:4px 16px; box-shadow:0 4px 16px rgba(20,20,29,.05);")}>
            <div style={css("display:flex; align-items:center; justify-content:space-between; padding:13px 0; border-bottom:1px solid #ECEEF1;")}><span style={css("font:500 14px Pretendard;")}>인원</span><span style={css("font:700 14px Pretendard;")}>2명</span></div>
            <div style={css("display:flex; align-items:center; justify-content:space-between; padding:13px 0;")}><span style={css("font:500 14px Pretendard;")}>반려견 동반</span><span style={css("display:inline-flex; align-items:center; gap:5px; font:700 14px Pretendard; color:#3B5BFE;")}><span className="msf" style={css("font-size:16px;")}>pets</span>1마리 · 동반석</span></div>
          </div>
          <div style={css("margin-top:14px; background:#EEF1FF; border-radius:12px; padding:11px 14px; display:flex; align-items:center; gap:8px;")}><span className="msf" style={css("font-size:17px; color:#3B5BFE;")}>deck</span><span style={css("font:600 12px Pretendard; color:#5A5F68;")}>동반석(테라스) 우선 배정 · 대형견 가능</span></div>
        </div>
        <div style={css("padding:14px 22px 22px; flex:none;")}><div onClick={v.closeSub} style={css("background:#3B5BFE; color:#fff; font:700 16px Pretendard; text-align:center; padding:17px; border-radius:18px; box-shadow:0 10px 24px rgba(59,91,254,.28); cursor:pointer;")}>예약하기 · 내일 토 13:00</div></div>
      </div>
    </>) : null}

    
    {v.isStay ? (<>
      <div data-screen-label="숙소 예약" style={css("position:absolute; inset:0; z-index:30; background:#F4F5F7; display:flex; flex-direction:column;")}>
        <div style={css("height:230px; flex:none; background:linear-gradient(135deg,#BFD3F0,#8FAEE0); position:relative; display:flex; align-items:center; justify-content:center;")}>
          <span className="msr" style={css("font-size:56px; color:rgba(255,255,255,.5);")}>cottage</span>
          <div style={css("height:50px; display:flex; align-items:center; padding:0 22px; position:absolute; top:0; left:0; right:0; z-index:1;")}><div onClick={v.closeSub} style={css("width:40px; height:40px; border-radius:50%; background:rgba(255,255,255,.92); display:flex; align-items:center; justify-content:center; cursor:pointer;")}><span className="msr" style={css("font-size:22px;")}>arrow_back_ios_new</span></div></div>
        </div>
        <div className="scr" style={css("flex:1; overflow-y:auto; padding:18px 22px 28px; background:#F4F5F7; border-radius:24px 24px 0 0; margin-top:-22px; position:relative; z-index:1;")}>
          <div style={css("display:flex; align-items:flex-start; justify-content:space-between;")}><div><div style={css("font:800 22px Pretendard; letter-spacing:-0.02em;")}>{v.stayPlaceName}</div><div style={css("font:500 13px Pretendard; color:#8A8F98; margin-top:4px;")}>반려견 동반 숙소 · 전주 한옥마을</div></div><span style={css("display:inline-flex; align-items:center; gap:3px; font:800 13px Pretendard; background:#fff; border:1px solid #ECEEF1; padding:7px 11px; border-radius:999px;")}><span className="msf" style={css("font-size:15px;")}>star</span>4.8</span></div>
          <div style={css("display:flex; gap:6px; flex-wrap:wrap; margin-top:14px;")}><span style={css("display:inline-flex; align-items:center; gap:5px; font:600 12px Pretendard; background:#EEF1FF; color:#3B5BFE; padding:8px 12px; border-radius:999px;")}><span className="msf" style={css("font-size:14px;")}>pets</span>반려견 동반</span><span style={css("display:inline-flex; align-items:center; gap:5px; font:600 12px Pretendard; background:#fff; border:1px solid #ECEEF1; padding:8px 12px; border-radius:999px;")}>대형견 OK</span><span style={css("display:inline-flex; align-items:center; gap:5px; font:600 12px Pretendard; background:#fff; border:1px solid #ECEEF1; padding:8px 12px; border-radius:999px;")}>마당</span></div>
          <div style={css("font:600 13px Pretendard; color:#8A8F98; margin:20px 0 10px;")}>날짜</div>
          <div style={css("background:#fff; border-radius:16px; padding:14px 16px; box-shadow:0 4px 16px rgba(20,20,29,.05); display:flex; align-items:center; justify-content:space-between;")}><div><div style={css("font:700 14px Pretendard;")}>10.16 토 → 10.17 일</div><div style={css("font:500 12px Pretendard; color:#8A8F98; margin-top:2px;")}>1박 · 2인 + 반려견 1</div></div><span className="msr" style={css("font-size:20px; color:#8A8F98;")}>calendar_month</span></div>
          <div style={css("font:600 13px Pretendard; color:#8A8F98; margin:20px 0 10px;")}>객실</div>
          <div style={css("background:#fff; border:2px solid #3B5BFE; border-radius:16px; padding:15px; box-shadow:0 6px 20px rgba(59,91,254,.12);")}><div style={css("display:flex; align-items:center; justify-content:space-between;")}><div style={css("font:700 15px Pretendard;")}>한옥 디럭스 · 마당</div><span className="msf" style={css("font-size:22px; color:#3B5BFE;")}>check_circle</span></div><div style={css("font:500 12px Pretendard; color:#8A8F98; margin-top:3px;")}>반려견 1마리 무료 · 추가 1만원</div><div style={css("font:800 17px Pretendard; color:#3B5BFE; margin-top:8px;")}>18만원 <span style={css("font:500 12px Pretendard; color:#8A8F98;")}>/ 1박</span></div></div>
          <div style={css("margin-top:14px; background:#EEF1FF; border-radius:12px; padding:11px 14px; display:flex; align-items:center; gap:8px;")}><span className="msf" style={css("font-size:17px; color:#3B5BFE;")}>info</span><span style={css("font:600 12px Pretendard; color:#5A5F68;")}>반려견 동반 시 사전 고지 필수 · 배변패드 비치</span></div>
        </div>
        <div style={css("padding:14px 22px 22px; flex:none;")}><div onClick={v.closeSub} style={css("background:#3B5BFE; color:#fff; font:700 16px Pretendard; text-align:center; padding:17px; border-radius:18px; box-shadow:0 10px 24px rgba(59,91,254,.28); cursor:pointer;")}>예약하기 · 18만원</div></div>
      </div>
    </>) : null}

    
    {v.isSimilar ? (<>
      <div data-screen-label="닮은 친구" style={css("position:absolute; inset:0; z-index:30; background:#F4F5F7; display:flex; flex-direction:column;")}>
        <div style={css("height:50px; display:flex; align-items:center; justify-content:space-between; padding:0 26px 0 30px; flex:none;")}><span style={css("font:700 15px Pretendard;")}>9:41</span><span className="msr" style={css("display:flex; gap:7px; font-size:18px;")}><span>signal_cellular_alt</span><span>wifi</span><span>battery_full</span></span></div>
        <div style={css("padding:4px 22px 10px; flex:none; display:flex; align-items:center; gap:12px;")}><div onClick={v.closeSub} style={css("cursor:pointer;")}><span className="msr" style={css("font-size:24px;")}>arrow_back_ios_new</span></div><span style={css("font:800 18px Pretendard;")}>닮은 친구 추천</span></div>
        <div className="scr" style={css("flex:1; overflow-y:auto; padding:6px 22px 28px;")}>
          <div style={css("background:linear-gradient(135deg,#EEF1FF,#F4F5F7); border-radius:18px; padding:18px; display:flex; align-items:center; gap:13px;")}><div style={css("width:48px; height:48px; border-radius:14px; background:#3B5BFE; color:#fff; display:flex; align-items:center; justify-content:center; flex:none;")}><span className="msf" style={css("font-size:26px;")}>groups</span></div><div><div style={css("font:800 15px Pretendard;")}>체리와 닮은 강아지들이 좋아한 곳</div><div style={css("font:500 12px Pretendard; color:#8A8F98; margin-top:3px;")}>대형견 · 활발 · 더위 취약 기준</div></div></div>
          <div style={css("margin-top:16px; display:flex; flex-direction:column; gap:12px;")}>
              {v.similarLoading ? (<div style={css("padding:40px 0; text-align:center; color:#8A8F98; font:500 13px Pretendard;")}>닮은 친구들의 발자국을 모으는 중…</div>) : null}
              {(v.similarLoading ? [] : (v.similarPlaces || [])).map((p, $i) => (<div key={$i} onClick={() => v.selectFacility(p)} style={css("background:#fff; border-radius:18px; padding:12px; box-shadow:0 6px 20px rgba(20,20,29,.06); display:flex; gap:13px; cursor:pointer;")}>
                <div style={css(`width:80px; height:80px; border-radius:14px; background:${["linear-gradient(135deg,#CDE6C2,#A7D49A)","linear-gradient(135deg,#F6D9A6,#E7B776)","linear-gradient(135deg,#BFD3F0,#8FAEE0)","linear-gradient(135deg,#C9B6E4,#A98FD0)"][$i%4]}; flex:none;`)}></div>
                <div style={css("flex:1; min-width:0; display:flex; flex-direction:column; justify-content:center;")}>
                  <div style={css("font:700 15px Pretendard;")}>{p.name}</div>
                  <div style={css("font:500 12px Pretendard; color:#8A8F98; margin-top:3px;")}>{p.category}</div>
                  <div style={css("display:flex; align-items:center; gap:7px; margin-top:9px;")}><div style={css("flex:1; height:5px; background:#ECEEF1; border-radius:999px; overflow:hidden;")}><div style={css(`width:${Math.min(98, 70 + p.score * 4)}%; height:100%; background:#3B5BFE;`)}></div></div><span style={css("font:700 11px Pretendard; color:#3B5BFE;")}>{Math.min(98, 70 + p.score * 4)}%</span></div>
                </div>
              </div>))}
            </div>
          <div style={css("font:400 11px Pretendard; color:#A9A8A2; margin-top:16px;")}>데이터: 한국관광공사 반려동물 동반여행 · 유사 프로필 방문 통계</div>
        </div>
      </div>
    </>) : null}

    
    {v.isQR ? (<>
      <div data-screen-label="QR 스캔" style={css("position:absolute; inset:0; z-index:30; background:#1A1A1D; display:flex; flex-direction:column;")}>
        <div style={css("height:50px; display:flex; align-items:center; justify-content:space-between; padding:0 26px 0 30px; flex:none; color:#fff;")}><span style={css("font:700 15px Pretendard;")}>9:41</span><span className="msr" style={css("display:flex; gap:7px; font-size:18px;")}><span>signal_cellular_alt</span><span>wifi</span><span>battery_full</span></span></div>
        <div style={css("padding:4px 24px 8px; flex:none; display:flex; align-items:center; gap:12px; color:#fff;")}><div onClick={v.closeSub} style={css("cursor:pointer;")}><span className="msr" style={css("font-size:24px;")}>close</span></div><span style={css("font:700 16px Pretendard;")}>현장 QR 스캔</span></div>
        <div style={css("flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:0 40px;")}>
          <div style={css("position:relative; width:240px; height:240px;")}>
            <div style={css("position:absolute; inset:0; border-radius:24px; background:linear-gradient(135deg,#3a3a40,#27272c);")}></div>
            <div style={css("position:absolute; left:50%; top:50%; transform:translate(-50%,-50%); width:120px; height:120px; border-radius:12px; background:#fff; display:flex; align-items:center; justify-content:center;")}><span className="msf" style={css("font-size:90px; color:#1A1A1D;")}>qr_code_2</span></div>
            <div style={css("position:absolute; left:14px; top:14px; width:34px; height:34px; border-top:3px solid #3B5BFE; border-left:3px solid #3B5BFE; border-radius:8px 0 0 0;")}></div>
            <div style={css("position:absolute; right:14px; top:14px; width:34px; height:34px; border-top:3px solid #3B5BFE; border-right:3px solid #3B5BFE; border-radius:0 8px 0 0;")}></div>
            <div style={css("position:absolute; left:14px; bottom:14px; width:34px; height:34px; border-bottom:3px solid #3B5BFE; border-left:3px solid #3B5BFE; border-radius:0 0 0 8px;")}></div>
            <div style={css("position:absolute; right:14px; bottom:14px; width:34px; height:34px; border-bottom:3px solid #3B5BFE; border-right:3px solid #3B5BFE; border-radius:0 0 8px 0;")}></div>
          </div>
          <div style={css("font:700 16px Pretendard; color:#fff; margin-top:28px;")}>관광지 안내판 QR을 비춰주세요</div>
          <div style={css("font:500 13px Pretendard; color:rgba(255,255,255,.6); margin-top:8px; text-align:center;")}>오목대·자만벽화마을 등 현장 QR을<br />스캔하면 체리 목소리 해설이 시작돼요.</div>
        </div>
        <div style={css("padding:0 24px 30px; flex:none;")}><div onClick={v.openAudio} style={css("background:#3B5BFE; color:#fff; font:700 16px Pretendard; text-align:center; padding:17px; border-radius:18px; cursor:pointer;")}>스캔 완료 · 해설 듣기</div></div>
      </div>
    </>) : null}

    
    {v.isAudio ? (<>
      <div data-screen-label="오디오 가이드" style={css("position:absolute; inset:0; z-index:30; background:#F4F5F7; display:flex; flex-direction:column;")}>
        <div style={css("height:50px; display:flex; align-items:center; justify-content:space-between; padding:0 26px 0 30px; flex:none;")}><span style={css("font:700 15px Pretendard;")}>9:41</span><span className="msr" style={css("display:flex; gap:7px; font-size:18px;")}><span>signal_cellular_alt</span><span>wifi</span><span>battery_full</span></span></div>
        <div style={css("padding:4px 22px 10px; flex:none; display:flex; align-items:center; gap:12px;")}><div onClick={v.closeSub} style={css("cursor:pointer;")}><span className="msr" style={css("font-size:24px;")}>arrow_back_ios_new</span></div><span style={css("font:800 18px Pretendard;")}>오디오 가이드</span></div>
        <div style={css("flex:1; padding:6px 22px 0;")}>
          <div style={css("height:200px; border-radius:24px; background:linear-gradient(135deg,#EAD3B0,#D3A878); position:relative; display:flex; align-items:center; justify-content:center;")}><span className="msr" style={css("font-size:64px; color:rgba(255,255,255,.5);")}>landscape</span><span style={css("position:absolute; bottom:14px; left:16px; font:700 13px Pretendard; color:#fff; text-shadow:0 1px 6px rgba(0,0,0,.3);")}>오목대 전망</span></div>

          <div style={css("margin-top:20px; background:#fff; border-radius:22px; padding:20px; box-shadow:0 8px 24px rgba(20,20,29,.06);")}>
            <div style={css("display:flex; align-items:center; gap:12px;")}>
              <div style={css("width:46px; height:46px; border-radius:50%; background:linear-gradient(135deg,#F8D9A8,#EBB06A); flex:none; display:flex; align-items:flex-end; justify-content:center; overflow:hidden;")}><div style={css("position:relative; width:34px; height:32px; margin-bottom:2px;")}><div style={css("position:absolute; left:3px; top:1px; width:10px; height:14px; border-radius:60% 40% 50% 50%; background:radial-gradient(circle at 40% 28%, #E8B06A, #D99A4E 58%, #BE8038); transform:rotate(-16deg);")}></div><div style={css("position:absolute; right:3px; top:1px; width:10px; height:14px; border-radius:40% 60% 50% 50%; background:radial-gradient(circle at 40% 28%, #E8B06A, #D99A4E 58%, #BE8038); transform:rotate(16deg);")}></div><div style={css("position:absolute; left:5px; top:6px; width:24px; height:24px; border-radius:50%; background:radial-gradient(circle at 38% 28%, #FCE6BC, #F4C98A 52%, #DFA45E);")}></div><div style={css("position:absolute; left:11px; top:13px; width:4px; height:4px; border-radius:50%; background:#2A2A2A;")}></div><div style={css("position:absolute; right:11px; top:13px; width:4px; height:4px; border-radius:50%; background:#2A2A2A;")}></div></div></div>
              <div style={css("flex:1;")}><div style={css("font:800 16px Pretendard;")}>체리가 안내해요</div><div style={css("font:500 12px Pretendard; color:#8A8F98; margin-top:2px;")}>전주 한옥마을 · 강아지 해설</div></div>
              <span className="msf" style={css("font-size:22px; color:#FF6B5C;")}>favorite</span>
            </div>

            
            <div style={css("display:flex; align-items:center; gap:3px; height:48px; margin-top:18px;")}>
              <div style={css("flex:1; height:40%; background:#3B5BFE; border-radius:2px;")}></div><div style={css("flex:1; height:65%; background:#3B5BFE; border-radius:2px;")}></div><div style={css("flex:1; height:90%; background:#3B5BFE; border-radius:2px;")}></div><div style={css("flex:1; height:55%; background:#3B5BFE; border-radius:2px;")}></div><div style={css("flex:1; height:75%; background:#3B5BFE; border-radius:2px;")}></div><div style={css("flex:1; height:100%; background:#3B5BFE; border-radius:2px;")}></div><div style={css("flex:1; height:60%; background:#3B5BFE; border-radius:2px;")}></div><div style={css("flex:1; height:35%; background:#3B5BFE; border-radius:2px;")}></div>
              <div style={css("flex:1; height:50%; background:#D6DBE3; border-radius:2px;")}></div><div style={css("flex:1; height:80%; background:#D6DBE3; border-radius:2px;")}></div><div style={css("flex:1; height:45%; background:#D6DBE3; border-radius:2px;")}></div><div style={css("flex:1; height:70%; background:#D6DBE3; border-radius:2px;")}></div><div style={css("flex:1; height:55%; background:#D6DBE3; border-radius:2px;")}></div><div style={css("flex:1; height:90%; background:#D6DBE3; border-radius:2px;")}></div><div style={css("flex:1; height:40%; background:#D6DBE3; border-radius:2px;")}></div><div style={css("flex:1; height:65%; background:#D6DBE3; border-radius:2px;")}></div><div style={css("flex:1; height:30%; background:#D6DBE3; border-radius:2px;")}></div>
            </div>
            <div style={css("display:flex; align-items:center; justify-content:space-between; margin-top:8px;")}><span style={css("font:600 11px Pretendard; color:#8A8F98;")}>0:38</span><span style={css("font:600 11px Pretendard; color:#8A8F98;")}>1:24</span></div>

            
            <div style={css("display:flex; align-items:center; justify-content:center; gap:28px; margin-top:14px;")}>
              <span className="msf" style={css("font-size:30px; color:#8A8F98;")}>replay_10</span>
              <div onClick={v.audioToggle} style={css("width:64px; height:64px; border-radius:50%; background:#3B5BFE; color:#fff; display:flex; align-items:center; justify-content:center; box-shadow:0 10px 24px rgba(59,91,254,.32); cursor:pointer;")}><span className="msf" style={css("font-size:34px;")}>{v.audioIcon}</span></div>
              <span className="msf" style={css("font-size:30px; color:#8A8F98;")}>forward_10</span>
            </div>

            <div style={css("display:flex; align-items:center; justify-content:space-between; margin-top:18px; padding-top:16px; border-top:1px solid #ECEEF1;")}><span style={css("font:600 13px Pretendard; color:#3B5BFE;")}>1.0x</span><span style={css("display:inline-flex; align-items:center; gap:5px; font:600 13px Pretendard; color:#8A8F98;")}><span className="msf" style={css("font-size:16px;")}>subtitles</span>자막</span><span className="msf" style={css("font-size:20px; color:#8A8F98;")}>ios_share</span></div>
          </div>

          <div style={css("margin-top:16px; background:#1A1A1D; color:#fff; font:600 14px Pretendard; padding:14px 16px; border-radius:16px 16px 16px 4px; line-height:1.55;")}>{v.audioScript || "멍멍! 여기는 태조 이성계의 본향이야. 한지 냄새 맡으면서 돌담길 같이 걸어보자!"}</div>
        </div>
      </div>
    </>) : null}

    
    {v.isPost ? (<>
      <div data-screen-label="코스 후기" style={css("position:absolute; inset:0; z-index:30; background:#F4F5F7; display:flex; flex-direction:column;")}>
        <div style={css("height:50px; display:flex; align-items:center; justify-content:space-between; padding:0 26px 0 30px; flex:none;")}><span style={css("font:700 15px Pretendard;")}>9:41</span><span className="msr" style={css("display:flex; gap:7px; font-size:18px;")}><span>signal_cellular_alt</span><span>wifi</span><span>battery_full</span></span></div>
        <div style={css("padding:4px 22px 8px; flex:none; display:flex; align-items:center; gap:12px;")}><div onClick={v.closeSub} style={css("cursor:pointer;")}><span className="msr" style={css("font-size:24px;")}>arrow_back_ios_new</span></div><span style={css("font:700 16px Pretendard;")}>코스 후기</span></div>
        <div className="scr" style={css("flex:1; overflow-y:auto; padding:6px 22px 28px;")}>
          <div style={css("display:flex; align-items:center; gap:10px;")}><div style={css("width:40px; height:40px; border-radius:50%; background:linear-gradient(135deg,#F5CE96,#E3A865);")}></div><div style={css("flex:1;")}><div style={css("font:700 14px Pretendard;")}>{v.postTitle}</div><div style={css("font:500 11px Pretendard; color:#8A8F98;")}>전주 한옥마을 · {v.postDate}</div></div><span style={css("display:inline-flex; align-items:center; gap:5px; font:700 13px Pretendard;")}><span className="msf" style={css("font-size:18px; color:#FF6B5C;")}>favorite</span>{v.postLikeCount}</span></div>
          <div style={css("margin-top:14px; height:200px; border-radius:18px; background:linear-gradient(135deg,#F6D9A6,#E0A867); position:relative;")}><div style={css("position:absolute; bottom:12px; left:14px; background:rgba(0,0,0,.45); color:#fff; font:600 11px Pretendard; padding:6px 11px; border-radius:999px; display:inline-flex; align-items:center; gap:5px;")}><span className="msf" style={css("font-size:13px;")}>route</span>코스 4곳 · 3.2km</div></div>
          <div style={css("font:500 14px Pretendard; color:#5A5F68; margin-top:14px; line-height:1.6;")}>{v.postBody}</div>
          <div style={css("font:800 16px Pretendard; margin:20px 0 12px;")}>코스 구성</div>
          <div style={css("background:#fff; border-radius:16px; padding:4px 16px; box-shadow:0 4px 16px rgba(20,20,29,.05);")}>
            <div style={css("display:flex; align-items:center; gap:12px; padding:13px 0; border-bottom:1px solid #ECEEF1;")}><div style={css("width:28px; height:28px; border-radius:50%; background:#EEF1FF; color:#3B5BFE; display:flex; align-items:center; justify-content:center; font:800 12px Pretendard;")}>1</div><span style={css("flex:1; font:600 14px Pretendard;")}>한옥마을 펫카페</span><span style={css("font:500 12px Pretendard; color:#8A8F98;")}>카페</span></div>
            <div style={css("display:flex; align-items:center; gap:12px; padding:13px 0; border-bottom:1px solid #ECEEF1;")}><div style={css("width:28px; height:28px; border-radius:50%; background:#EEF1FF; color:#3B5BFE; display:flex; align-items:center; justify-content:center; font:800 12px Pretendard;")}>2</div><span style={css("flex:1; font:600 14px Pretendard;")}>자만벽화마을</span><span style={css("font:500 12px Pretendard; color:#8A8F98;")}>관광지</span></div>
            <div style={css("display:flex; align-items:center; gap:12px; padding:13px 0;")}><div style={css("width:28px; height:28px; border-radius:50%; background:#EEF1FF; color:#3B5BFE; display:flex; align-items:center; justify-content:center; font:800 12px Pretendard;")}>3</div><span style={css("flex:1; font:600 14px Pretendard;")}>오목대 전망</span><span style={css("font:500 12px Pretendard; color:#8A8F98;")}>전망</span></div>
          </div>
          <div style={css("font:400 11px Pretendard; color:#A9A8A2; margin-top:14px;")}>데이터: 한국관광공사 반려동물 동반여행</div>
        </div>
        <div style={css("padding:14px 22px 22px; flex:none;")}><div onClick={v.goPlanner} style={css("background:#3B5BFE; color:#fff; font:700 16px Pretendard; text-align:center; padding:17px; border-radius:18px; box-shadow:0 10px 24px rgba(59,91,254,.28); cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px;")}><span className="msf" style={css("font-size:20px;")}>bookmark_add</span>이 코스 그대로 담기</div></div>
      </div>
    </>) : null}

    
    {v.isClips ? (<>
      <div data-screen-label="발자국 클립" style={css("position:absolute; inset:0; z-index:30; background:#1A1A1D; display:flex; flex-direction:column;")}>
        <div style={css("height:50px; display:flex; align-items:center; justify-content:space-between; padding:0 26px 0 30px; flex:none; color:#fff;")}><span style={css("font:700 15px Pretendard;")}>9:41</span><span className="msr" style={css("display:flex; gap:7px; font-size:18px;")}><span>signal_cellular_alt</span><span>wifi</span><span>battery_full</span></span></div>
        <div style={css("padding:4px 22px 8px; flex:none; display:flex; align-items:center; gap:12px; color:#fff;")}><div onClick={v.closeSub} style={css("cursor:pointer;")}><span className="msr" style={css("font-size:24px;")}>arrow_back_ios_new</span></div><span style={css("font:700 16px Pretendard;")}>발자국 클립</span></div>
        <div className="scr" style={css("flex:1; overflow-y:auto; padding:6px 16px 28px;")}>
          <div style={css("display:grid; grid-template-columns:1fr 1fr; gap:10px;")}>
            {(v.vlogClips || []).map((clip) => (<div key={clip.$index} style={css(`position:relative; aspect-ratio:9/16; border-radius:16px; overflow:hidden; background:${["linear-gradient(160deg,#D9B98A,#A9C99B)","linear-gradient(160deg,#C9B6E4,#8FAEE0)","linear-gradient(160deg,#CDE6C2,#94BE9C)","linear-gradient(160deg,#F6D9A6,#E0A867)"][clip.$index % 4]};`)}><div style={css("position:absolute; inset:0; background:linear-gradient(180deg,rgba(0,0,0,.1),rgba(0,0,0,0) 40%,rgba(0,0,0,.55));")}></div><span className="msf" style={css("position:absolute; top:42%; left:50%; transform:translate(-50%,-50%); font-size:34px; color:rgba(255,255,255,.85);")}>play_circle</span><div style={css("position:absolute; left:10px; bottom:10px; color:#fff;")}><div style={css("font:700 12px Pretendard;")}>체리의 하루</div><div style={css("display:inline-flex; align-items:center; gap:3px; font:600 10px Pretendard; margin-top:3px;")}><span className="msf" style={css("font-size:12px;")}>{clip.source_type === "video" ? "movie" : "photo_camera"}</span>{clip.typeLabel} · 클립 {clip.seq}</div></div></div>))}
          </div>
        </div>
      </div>
    </>) : null}

    
    {v.isCare ? (<>
      <div data-screen-label="케어 알림 설정" style={css("position:absolute; inset:0; z-index:30; background:#F4F5F7; display:flex; flex-direction:column;")}>
        <div style={css("height:50px; display:flex; align-items:center; justify-content:space-between; padding:0 26px 0 30px; flex:none;")}><span style={css("font:700 15px Pretendard;")}>9:41</span><span className="msr" style={css("display:flex; gap:7px; font-size:18px;")}><span>signal_cellular_alt</span><span>wifi</span><span>battery_full</span></span></div>
        <div style={css("padding:4px 22px 10px; flex:none; display:flex; align-items:center; gap:12px;")}><div onClick={v.closeSub} style={css("cursor:pointer;")}><span className="msr" style={css("font-size:24px;")}>arrow_back_ios_new</span></div><span style={css("font:800 18px Pretendard;")}>케어 알림 설정</span></div>
        <div className="scr" style={css("flex:1; overflow-y:auto; padding:6px 22px 16px;")}>
          <div style={css("background:#3B5BFE; border-radius:18px; padding:16px; display:flex; align-items:center; gap:13px; box-shadow:0 10px 24px rgba(59,91,254,.28);")}><div style={css("width:44px; height:44px; border-radius:13px; background:rgba(255,255,255,.2); display:flex; align-items:center; justify-content:center; flex:none;")}><span className="msf" style={css("font-size:24px; color:#fff;")}>notifications_active</span></div><div style={css("flex:1; color:#fff;")}><div style={css("font:800 15px Pretendard;")}>알림 권한 받기</div><div style={css("font:500 12px Pretendard; opacity:.9; margin-top:2px;")}>제때 케어 알림을 받으려면 필요해요</div></div><div style={css("background:#fff; color:#3B5BFE; font:700 13px Pretendard; padding:9px 16px; border-radius:999px;")}>허용</div></div>

          <div style={css("margin-top:14px; background:#fff; border-radius:18px; padding:18px; box-shadow:0 4px 16px rgba(20,20,29,.05);")}>
            <div style={css("display:flex; align-items:center; gap:11px;")}><div style={css("width:40px; height:40px; border-radius:12px; background:#EEF1FF; display:flex; align-items:center; justify-content:center; flex:none;")}><span className="msf" style={css("font-size:22px; color:#3B5BFE;")}>auto_awesome</span></div><div style={css("flex:1;")}><div style={css("font:800 15px Pretendard;")}>AI 자동 학습</div><div style={css("font:500 12px Pretendard; color:#8A8F98; margin-top:2px;")}>기록할수록 체리에게 맞게 똑똑해져요</div></div><div style={css("width:46px; height:27px; border-radius:999px; background:#3B5BFE; position:relative; flex:none;")}><div style={css("position:absolute; top:3px; right:3px; width:21px; height:21px; border-radius:50%; background:#fff;")}></div></div></div>
            <div style={css("margin-top:14px; display:flex; align-items:center; gap:8px;")}><span style={css("font:400 11px Pretendard; color:#8A8F98;")}>직접 기록</span><div style={css("flex:1; height:6px; background:#ECEEF1; border-radius:999px; overflow:hidden;")}><div style={css("width:68%; height:100%; background:#3B5BFE; border-radius:999px;")}></div></div><span style={css("font:700 11px Pretendard; color:#3B5BFE;")}>학습 68%</span></div>
            <div style={css("margin-top:12px; background:#F6F8FF; border-radius:10px; padding:11px 13px; font:400 12px Pretendard; color:#5A5F68; line-height:1.5;")}>지난 14일 산책·급수 기록을 학습했어요. 이제 <b style={css("color:#3B5BFE;")}>"체리가 목말라요"</b>·<b style={css("color:#E0533F;")}>"체리가 지쳤어요"</b> 알림을 때맞춰 보내드려요.</div>
          </div>

          <div style={css("font:800 16px Pretendard; margin:20px 0 12px;")}>알림 종류</div>
          <div style={css("background:#fff; border-radius:18px; padding:4px 16px; box-shadow:0 4px 16px rgba(20,20,29,.05);")}>
            {(v.careReminders || []).map((r, $i) => (
            <div key={$i} style={css(`display:flex; align-items:center; gap:12px; padding:14px 0; ${$i < (v.careReminders || []).length - 1 ? "border-bottom:1px solid #ECEEF1;" : ""}`)}><div style={css("width:40px; height:40px; border-radius:12px; background:#EEF1FF; color:#3B5BFE; display:flex; align-items:center; justify-content:center; flex:none;")}><span className="msf" style={css("font-size:21px;")}>water_drop</span></div><div style={css("flex:1;")}><div style={css("font:700 14px Pretendard;")}>{r.label}</div><div style={css("font:500 12px Pretendard; color:#8A8F98; margin-top:2px;")}>{r.scheduled_time} · {r.interval_min}분 간격</div></div><div style={css(`width:46px; height:27px; border-radius:999px; background:${r.enabled ? "#3B5BFE" : "#E0E2E6"}; position:relative; flex:none;`)}><div style={css(`position:absolute; top:3px; ${r.enabled ? "right:3px" : "left:3px"}; width:21px; height:21px; border-radius:50%; background:#fff;`)}></div></div></div>
            ))}
          </div>

          <div style={css("font:400 11px Pretendard; color:#A9A8A2; margin-top:18px;")}>문화체육관광부 공공데이터 제공</div>
        </div>
        <div style={css("padding:14px 22px 22px; flex:none;")}><div onClick={v.closeSub} style={css("background:#3B5BFE; color:#fff; font:700 16px Pretendard; text-align:center; padding:17px; border-radius:18px; box-shadow:0 10px 24px rgba(59,91,254,.28); cursor:pointer;")}>저장하기</div></div>
      </div>
    </>) : null}

    
    {v.isPawmap ? (<>
      <div data-screen-label="발자국 지도" style={css("position:absolute; inset:0; z-index:30; background:#F4F5F7; display:flex; flex-direction:column;")}>
        <div style={css("height:50px; display:flex; align-items:center; justify-content:space-between; padding:0 26px 0 30px; flex:none;")}><span style={css("font:700 15px Pretendard;")}>9:41</span><span className="msr" style={css("display:flex; gap:7px; font-size:18px;")}><span>signal_cellular_alt</span><span>wifi</span><span>battery_full</span></span></div>
        <div style={css("padding:4px 22px 10px; flex:none; display:flex; align-items:center; gap:12px;")}><div onClick={v.closeSub} style={css("cursor:pointer;")}><span className="msr" style={css("font-size:24px;")}>arrow_back_ios_new</span></div><span style={css("font:800 18px Pretendard;")}>발자국 지도</span></div>
        <div className="scr" style={css("flex:1; overflow-y:auto; padding:6px 22px 28px;")}>
          <div style={css("font:500 13px Pretendard; color:#8A8F98;")}>체리와 다녀온 모든 곳을 지도에 모았어요.</div>
          <div style={css("margin-top:14px; height:300px; border-radius:20px; background:#E6E8EC; position:relative; overflow:hidden; box-shadow:0 6px 20px rgba(20,20,29,.06);")}>
            <div style={css("position:absolute; left:24px; top:36px; width:120px; height:96px; border-radius:18px; background:#DDE0E5;")}></div>
            <div style={css("position:absolute; right:18px; top:80px; width:130px; height:120px; border-radius:18px; background:#CFE4C8;")}></div>
            <div style={css("position:absolute; left:44px; bottom:30px; width:140px; height:100px; border-radius:18px; background:#DDE0E5;")}></div>
            <svg viewbox="0 0 346 300" style={css("position:absolute; inset:0; width:100%; height:100%;")}><path d="M64 70 C 120 96, 96 160, 176 156 S 270 230, 226 268" fill="none" stroke="#3B5BFE" stroke-width="4" stroke-linecap="round" stroke-dasharray="2 12"></path></svg>
            <div style={css("position:absolute; left:50px; top:56px; width:30px; height:30px; border-radius:50% 50% 50% 3px; background:#fff; box-shadow:0 4px 12px rgba(20,20,29,.18); display:flex; align-items:center; justify-content:center;")}><svg width="14" height="14" viewbox="0 0 24 24" fill="#3B5BFE"><ellipse cx="12" cy="16" rx="5.5" ry="4.5"></ellipse><ellipse cx="5.3" cy="10" rx="2.3" ry="2.9"></ellipse><ellipse cx="9.9" cy="6.4" rx="2.3" ry="2.9"></ellipse><ellipse cx="14.1" cy="6.4" rx="2.3" ry="2.9"></ellipse><ellipse cx="18.7" cy="10" rx="2.3" ry="2.9"></ellipse></svg></div>
            <div style={css("position:absolute; left:166px; top:146px; width:30px; height:30px; border-radius:50% 50% 50% 3px; background:#fff; box-shadow:0 4px 12px rgba(20,20,29,.18); display:flex; align-items:center; justify-content:center;")}><svg width="14" height="14" viewbox="0 0 24 24" fill="#3B5BFE"><ellipse cx="12" cy="16" rx="5.5" ry="4.5"></ellipse><ellipse cx="5.3" cy="10" rx="2.3" ry="2.9"></ellipse><ellipse cx="9.9" cy="6.4" rx="2.3" ry="2.9"></ellipse><ellipse cx="14.1" cy="6.4" rx="2.3" ry="2.9"></ellipse><ellipse cx="18.7" cy="10" rx="2.3" ry="2.9"></ellipse></svg></div>
            <div style={css("position:absolute; left:212px; bottom:24px; width:36px; height:36px; border-radius:50% 50% 50% 3px; background:#3B5BFE; box-shadow:0 6px 16px rgba(59,91,254,.4); display:flex; align-items:center; justify-content:center;")}><svg width="18" height="18" viewbox="0 0 24 24" fill="#fff"><ellipse cx="12" cy="16" rx="5.5" ry="4.5"></ellipse><ellipse cx="5.3" cy="10" rx="2.3" ry="2.9"></ellipse><ellipse cx="9.9" cy="6.4" rx="2.3" ry="2.9"></ellipse><ellipse cx="14.1" cy="6.4" rx="2.3" ry="2.9"></ellipse><ellipse cx="18.7" cy="10" rx="2.3" ry="2.9"></ellipse></svg></div>
            <div style={css("position:absolute; left:14px; bottom:14px; font:600 11px ui-monospace,monospace; color:#8A8F98; background:rgba(255,255,255,.85); padding:5px 9px; border-radius:8px;")}>전주 일대 · 14곳</div>
          </div>
          <div style={css("display:flex; gap:10px; margin-top:14px;")}>
            <div style={css("flex:1; background:#fff; border-radius:16px; padding:15px; box-shadow:0 4px 16px rgba(20,20,29,.05);")}><div style={css("font:800 22px Pretendard; color:#3B5BFE;")}>14</div><div style={css("font:500 11px Pretendard; color:#8A8F98; margin-top:2px;")}>다녀온 곳</div></div>
            <div style={css("flex:1; background:#fff; border-radius:16px; padding:15px; box-shadow:0 4px 16px rgba(20,20,29,.05);")}><div style={css("font:800 22px Pretendard; color:#3B5BFE;")}>38<span style={css("font-size:14px;")}>km</span></div><div style={css("font:500 11px Pretendard; color:#8A8F98; margin-top:2px;")}>함께 걸음</div></div>
            <div style={css("flex:1; background:#fff; border-radius:16px; padding:15px; box-shadow:0 4px 16px rgba(20,20,29,.05);")}><div style={css("font:800 22px Pretendard; color:#3B5BFE;")}>5</div><div style={css("font:500 11px Pretendard; color:#8A8F98; margin-top:2px;")}>지역</div></div>
          </div>
          <div style={css("font:800 16px Pretendard; margin:20px 0 12px;")}>지역별 발자국</div>
          <div style={css("display:flex; flex-direction:column; gap:11px;")}>
            <div style={css("background:#fff; border-radius:14px; padding:13px 15px; box-shadow:0 4px 16px rgba(20,20,29,.05); display:flex; align-items:center; gap:12px;")}><div style={css("width:36px; height:36px; border-radius:10px; background:#EEF1FF; color:#3B5BFE; display:flex; align-items:center; justify-content:center; flex:none;")}><span className="msf" style={css("font-size:19px;")}>location_on</span></div><div style={css("flex:1;")}><div style={css("font:700 14px Pretendard;")}>전주 한옥마을</div><div style={css("font:500 12px Pretendard; color:#8A8F98;")}>6곳 · 첫 방문 09.14</div></div><span style={css("font:700 13px Pretendard; color:#3B5BFE;")}>6</span></div>
            <div style={css("background:#fff; border-radius:14px; padding:13px 15px; box-shadow:0 4px 16px rgba(20,20,29,.05); display:flex; align-items:center; gap:12px;")}><div style={css("width:36px; height:36px; border-radius:10px; background:#EAF6EE; color:#22A565; display:flex; align-items:center; justify-content:center; flex:none;")}><span className="msf" style={css("font-size:19px;")}>location_on</span></div><div style={css("flex:1;")}><div style={css("font:700 14px Pretendard;")}>전주천변</div><div style={css("font:500 12px Pretendard; color:#8A8F98;")}>4곳 · 산책 코스</div></div><span style={css("font:700 13px Pretendard; color:#22A565;")}>4</span></div>
            <div style={css("background:#fff; border-radius:14px; padding:13px 15px; box-shadow:0 4px 16px rgba(20,20,29,.05); display:flex; align-items:center; gap:12px;")}><div style={css("width:36px; height:36px; border-radius:10px; background:#FFF4E5; color:#C68A1E; display:flex; align-items:center; justify-content:center; flex:none;")}><span className="msf" style={css("font-size:19px;")}>location_on</span></div><div style={css("flex:1;")}><div style={css("font:700 14px Pretendard;")}>자만벽화마을</div><div style={css("font:500 12px Pretendard; color:#8A8F98;")}>2곳 · 올해의 순간</div></div><span style={css("font:700 13px Pretendard; color:#C68A1E;")}>2</span></div>
          </div>
          <div onClick={v.openRecap} style={css("margin-top:16px; background:#EEF1FF; border-radius:14px; padding:14px 16px; display:flex; align-items:center; gap:10px; cursor:pointer;")}><span className="msf" style={css("font-size:20px; color:#3B5BFE;")}>auto_stories</span><span style={css("flex:1; font:700 13px Pretendard; color:#1A1A1D;")}>올해 발자국을 스토리로 보기</span><span className="msr" style={css("font-size:18px; color:#3B5BFE;")}>chevron_right</span></div>
        </div>
      </div>
    </>) : null}

    
    {v.inApp ? (<>
    <div onClick={v.openEmg} style={css("position:absolute; right:18px; bottom:96px; width:58px; height:58px; border-radius:50%; background:#FF6B5C; box-shadow:0 10px 24px rgba(255,107,92,.42); display:flex; flex-direction:column; align-items:center; justify-content:center; z-index:10; cursor:pointer;")}>
      <span className="msf" style={css("font-size:24px; color:#fff;")}>emergency</span>
      <span style={css("font:700 8px Pretendard; color:#fff; margin-top:1px;")}>응급</span>
    </div>
    </>) : null}

    
    {v.inApp ? (<>
    <div style={css("height:78px; flex:none; background:#fff; border-top:1px solid #ECEEF1; display:flex; align-items:flex-start; padding-top:11px; z-index:10;")}>
      <div onClick={v.goPlanner} style={css("flex:1; text-align:center; cursor:pointer;")}><span className="msf" style={css(`font-size:25px; color:${v.tPlanner};`)}>explore</span><div style={css(`font:600 10px Pretendard; color:${v.tPlanner}; margin-top:3px;`)}>플래너</div></div>
      <div onClick={v.goExplore} style={css("flex:1; text-align:center; cursor:pointer;")}><span className="msf" style={css(`font-size:25px; color:${v.tExplore};`)}>festival</span><div style={css(`font:600 10px Pretendard; color:${v.tExplore}; margin-top:3px;`)}>둘러보기</div></div>
      <div onClick={v.goCommunity} style={css("flex:1; text-align:center; cursor:pointer;")}><span className="msf" style={css(`font-size:25px; color:${v.tCommunity};`)}>groups</span><div style={css(`font:600 10px Pretendard; color:${v.tCommunity}; margin-top:3px;`)}>커뮤니티</div></div>
      <div onClick={v.goDog} style={css("flex:1; text-align:center; cursor:pointer;")}><span className="msf" style={css(`font-size:25px; color:${v.tDog};`)}>pets</span><div style={css(`font:600 10px Pretendard; color:${v.tDog}; margin-top:3px;`)}>내 강아지</div></div>
    </div>
    </>) : null}

  </div>
</div>
  );
}
