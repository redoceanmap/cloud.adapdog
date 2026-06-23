
class Component extends DCLogic {
  state = { phase:'login', personaView:'mascot', memory:null, recapSlide:0, figureStep:'photo', sub:null, festView:'cal', screen:'planner', plannerView:'list', exploreView:'list', dogView:'wallet', emg:false };

  renderVals() {
    const s = this.state;
    const ACT = '#3B5BFE', OFF = '#C7CAD0';
    const go = (screen) => () => this.setState({ screen, emg:false });
    const tabActive = (...names) => names.includes(s.screen) ? ACT : OFF;
    const pill = (on) => on ? { bg:'#fff', tx:'#1A1A1D' } : { bg:'transparent', tx:'#8A8F98' };
    const seg = (on) => on ? { bg:'#fff', tx:'#3B5BFE' } : { bg:'transparent', tx:'#8A8F98' };

    const pl = pill(s.plannerView==='list'), pm = pill(s.plannerView==='map');
    const el = pill(s.exploreView==='list'), em = pill(s.exploreView==='map');
    const wv = seg(s.dogView==='wallet'), dv = seg(s.dogView==='dressup');

    return {
      // screens
      isPlanner: s.screen==='planner',
      isFacility: s.screen==='facility',
      isTrip: s.screen==='trip',
      isExplore: s.screen==='explore',
      isCommunity: s.screen==='community',
      isDog: s.screen==='dog',
      emgOpen: s.emg,

      // nav handlers
      goPlanner: go('planner'),
      goExplore: go('explore'),
      goCommunity: go('community'),
      goDog: go('dog'),
      openFacility: go('facility'),
      openTrip: go('trip'),
      openEmg: () => this.setState({ emg:true, emgStep:'entry' }),
      closeEmg: () => this.setState({ emg:false }),
      emgGo: (step) => () => this.setState({ emgStep:step }),
      emgToAttach: () => this.setState({ emgStep:'attach' }),
      emgToAnalyzing: () => this.setState({ emgStep:'analyzing' }),
      emgToResult: () => this.setState({ emgStep:'result' }),
      emgToList: () => this.setState({ emgStep:'list' }),
      emgToDetail: () => this.setState({ emgStep:'detail' }),
      emgBackEntry: () => this.setState({ emgStep:'entry' }),
      emgBackAttach: () => this.setState({ emgStep:'attach' }),
      emgBackResult: () => this.setState({ emgStep:'result' }),
      emgBackList: () => this.setState({ emgStep:'list' }),
      emgIsEntry: (s.emgStep || 'entry')==='entry',
      emgIsAttach: s.emgStep==='attach',
      emgIsAnalyzing: s.emgStep==='analyzing',
      emgIsResult: s.emgStep==='result',
      emgIsList: s.emgStep==='list',
      emgIsDetail: s.emgStep==='detail',

      // planner toggle
      isPlannerPrompt: (s.plannerMode || 'prompt')==='prompt',
      isPlannerResults: s.plannerMode==='results',
      submitPrompt: () => this.setState({ plannerMode:'results' }),
      editPrompt: () => this.setState({ plannerMode:'prompt' }),
      plannerList: () => this.setState({ plannerView:'list' }),
      plannerMap: () => this.setState({ plannerView:'map' }),
      plannerIsList: s.plannerView==='list',
      plannerIsMap: s.plannerView==='map',
      plannerListBg: pl.bg, plannerListTx: pl.tx, plannerMapBg: pm.bg, plannerMapTx: pm.tx,

      // explore toggle
      exploreList: () => this.setState({ exploreView:'list' }),
      exploreMap: () => this.setState({ exploreView:'map' }),
      exploreIsList: s.exploreView==='list',
      exploreIsMap: s.exploreView==='map',
      exploreListBg: el.bg, exploreListTx: el.tx, exploreMapBg: em.bg, exploreMapTx: em.tx,

      // dog sub-tab
      walletView: () => this.setState({ dogView:'wallet' }),
      dressView: () => this.setState({ dogView:'dressup' }),
      dogIsWallet: s.dogView==='wallet',
      dogIsDress: s.dogView==='dressup',
      walletBg: wv.bg, walletTx: wv.tx, dressBg: dv.bg, dressTx: dv.tx,

      // tab bar colors
      tPlanner: tabActive('planner','facility','trip'),
      tExplore: tabActive('explore'),
      tCommunity: tabActive('community'),
      tDog: tabActive('dog'),

      // ===== entry phase =====
      inApp: s.phase==='app',
      isLogin: s.phase==='login',
      isName: s.phase==='name',
      isMethod: s.phase==='method',
      isUpload: s.phase==='upload',
      isBreed: s.phase==='breed',
      isProfile: s.phase==='profile',
      isComplete: s.phase==='complete',
      isPersona: s.phase==='persona',
      startApp: () => this.setState({ phase:'name' }),
      goMethod: () => this.setState({ phase:'method' }),
      petName: s.petName || '체리',
      setPetName: (e) => this.setState({ petName: e.target.value }),
      petPhoto: s.petPhoto || null,
      hasPhoto: !!s.petPhoto,
      noPhoto: !s.petPhoto,
      fig3dStyle: (s.petPhoto ? ('background-image:url('+s.petPhoto+'); background-size:cover; background-position:center; ') : 'background-color:#EBB06A; ')
        + 'transform:perspective(800px) rotateY(' + (s.rotY ?? -18) + 'deg) rotateX(' + (s.rotX ?? 4) + 'deg);',
      onDragStart: (e) => {
        const startX = (e.touches ? e.touches[0].clientX : e.clientX);
        const startY = (e.touches ? e.touches[0].clientY : e.clientY);
        const baseY = this.state.rotY ?? -18;
        const baseX = this.state.rotX ?? 4;
        const move = (ev) => {
          const cx = (ev.touches ? ev.touches[0].clientX : ev.clientX);
          const cy = (ev.touches ? ev.touches[0].clientY : ev.clientY);
          this.setState({ rotY: baseY + (cx - startX) * 0.6, rotX: baseX - (cy - startY) * 0.4 });
        };
        const up = () => {
          window.removeEventListener('pointermove', move);
          window.removeEventListener('pointerup', up);
        };
        window.addEventListener('pointermove', move);
        window.addEventListener('pointerup', up);
      },
      photoStyle: s.petPhoto ? ('background-image:url('+s.petPhoto+'); background-size:cover; background-position:center;') : '',
      onPhoto: (e) => {
        const f = e.target.files && e.target.files[0];
        if (!f) return;
        const r = new FileReader();
        r.onload = (ev) => this.setState({ petPhoto: ev.target.result });
        r.readAsDataURL(f);
      },
      goUpload: () => this.setState({ phase:'upload' }),
      goBreed: () => this.setState({ phase:'breed' }),
      goProfile: () => this.setState({ phase:'profile' }),
      goComplete: () => this.setState({ phase:'complete' }),
      goPersona: () => this.setState({ phase:'persona' }),
      finishOb: () => this.setState({ phase:'app', screen:'planner' }),
      backLogin: () => this.setState({ phase:'login' }),
      backMethod: () => this.setState({ phase:'method' }),
      backUpload: () => this.setState({ phase:'upload' }),
      backBreed: () => this.setState({ phase:'breed' }),
      backProfile: () => this.setState({ phase:'profile' }),

      // persona toggle
      personaMascot: () => this.setState({ personaView:'mascot' }),
      personaReal: () => this.setState({ personaView:'real' }),
      personaIsMascot: s.personaView==='mascot',
      personaIsReal: s.personaView==='real',
      pMascotBg: s.personaView==='mascot' ? '#fff' : 'transparent',
      pMascotTx: s.personaView==='mascot' ? '#3B5BFE' : '#8A8F98',
      pRealBg: s.personaView==='real' ? '#fff' : 'transparent',
      pRealTx: s.personaView==='real' ? '#3B5BFE' : '#8A8F98',

      // ===== memory overlays =====
      openRecap: () => this.setState({ memory:'recap', recapSlide:0 }),
      openPawmap: () => this.setState({ sub:'pawmap' }),
      isPawmap: s.sub==='pawmap',
      openFigure: () => this.setState({ memory:'figure', figureStep:'photo' }),
      openPhotocard: () => this.setState({ memory:'photocard' }),
      closeMemory: () => this.setState({ memory:null }),
      isRecap: s.memory==='recap',
      isFigure: s.memory==='figure',
      isPhotocard: s.memory==='photocard',
      recapS0: s.recapSlide===0,
      recapS1: s.recapSlide===1,
      recapS2: s.recapSlide===2,
      recapNext: () => this.setState(st => ({ recapSlide: Math.min(2, st.recapSlide+1) })),
      recapDot0Bg: s.recapSlide===0 ? '#fff' : 'rgba(255,255,255,.4)',
      recapDot1Bg: s.recapSlide===1 ? '#fff' : 'rgba(255,255,255,.4)',
      recapDot2Bg: s.recapSlide===2 ? '#fff' : 'rgba(255,255,255,.4)',
      figIsPhoto: s.figureStep==='photo',
      figIsStyle: s.figureStep==='style',
      figIsGen: s.figureStep==='gen',
      figIsReveal: s.figureStep==='reveal',
      figIsCustom: s.figureStep==='custom',
      figToCustom: () => this.setState({ figureStep:'custom' }),
      dressApply: () => this.setState({ dressStep:'applying' }),
      dressDone: () => this.setState({ dressStep:'result' }),
      dressReset: () => this.setState({ dressStep:'main' }),
      dressIsMain: (s.dressStep || 'main')==='main',
      dressIsApplying: s.dressStep==='applying',
      dressIsResult: s.dressStep==='result',
      figToStyle: () => this.setState({ figureStep:'style' }),
      figToGen: () => this.setState({ figureStep:'gen' }),
      figToReveal: () => this.setState({ figureStep:'reveal' }),

      // ===== explore sub-screens =====
      openSub: (name) => this.setState({ sub:name }),
      openQR: () => this.setState({ sub:'qr' }),
      openAudio: () => this.setState({ sub:'audio' }),
      openCare: () => this.setState({ sub:'care' }),
      isCare: s.sub==='care',
      careLogs: s.careLogs || [],
      recordFeed: () => this.setState(st => {
        const logs = st.careLogs || [];
        const mins = 42 + logs.length * 38;
        return { careLogs: [...logs, { type:'급여', icon:'water_drop', label:'물·간식 급여', mins }] };
      }),
      recordRest: () => this.setState(st => {
        const logs = st.careLogs || [];
        const mins = 58 + logs.length * 38;
        return { careLogs: [...logs, { type:'휴식', icon:'chair', label:'그늘 휴식', mins }] };
      }),
      clearLogs: () => this.setState({ careLogs: [] }),
      hasLogs: (s.careLogs || []).length > 0,
      careLogsView: (s.careLogs || []).map((l, i) => ({
        ...l, $index: i,
        elapsed: '여행 시작 후 ' + Math.floor(l.mins/60) + '시간 ' + (l.mins%60) + '분',
      })),
      isQR: s.sub==='qr',
      isAudio: s.sub==='audio',
      audioToggle: () => this.setState(st => ({ audioPlaying: !st.audioPlaying })),
      audioIsPlaying: !!s.audioPlaying,
      audioIcon: s.audioPlaying ? 'pause' : 'play_arrow',
      openFest: () => this.setState({ sub:'festival' }),
      openTrail: () => this.setState({ sub:'trail' }),
      openStamp: () => this.setState({ sub:'stamp' }),
      openVlog: () => this.setState({ sub:'vlog', vlogStep:'course' }),
      vlogStep: s.vlogStep || 'course',
      vlogToClips: () => this.setState({ vlogStep:'clips' }),
      vlogToTone: () => this.setState({ vlogStep:'tone' }),
      vlogToGen: () => this.setState({ vlogStep:'gen' }),
      vlogToDone: () => this.setState({ vlogStep:'done' }),
      vlogBackCourse: () => this.setState({ vlogStep:'course' }),
      vlogBackClips: () => this.setState({ vlogStep:'clips' }),
      vlogBackTone: () => this.setState({ vlogStep:'tone' }),
      vlogIsCourse: (s.vlogStep || 'course')==='course',
      vlogIsClips: s.vlogStep==='clips',
      vlogIsTone: s.vlogStep==='tone',
      vlogIsGen: s.vlogStep==='gen',
      vlogIsDone: s.vlogStep==='done',
      openPost: () => this.setState({ sub:'post' }),
      openClips: () => this.setState({ sub:'clips' }),
      isPost: s.sub==='post',
      isClips: s.sub==='clips',
      openAccess: () => this.setState({ sub:'access' }),
      openPassport: () => this.setState({ sub:'passport' }),
      openEditTraits: () => this.setState({ sub:'traits' }),
      closeSub: () => this.setState({ sub:null }),
      isFest: s.sub==='festival',
      isTrail: s.sub==='trail',
      isStamp: s.sub==='stamp',
      isVlog: s.sub==='vlog',
      isAccess: s.sub==='access',
      isPassport: s.sub==='passport',
      isTraits: s.sub==='traits',
      isBadges: s.sub==='badges',
      isJudge: s.sub==='judge',
      isDine: s.sub==='dine',
      isStay: s.sub==='stay',
      isSimilar: s.sub==='similar',
      openBadges: () => this.setState({ sub:'badges' }),
      openJudge: () => this.setState({ sub:'judge' }),
      openDine: () => this.setState({ sub:'dine' }),
      openStay: () => this.setState({ sub:'stay' }),
      openSimilar: () => this.setState({ sub:'similar' }),
      accOn: () => this.setState({ accessOn:true }),
      accOff: () => this.setState({ accessOn:false }),
      accessIsOn: s.accessOn !== false,
      accessIsOff: s.accessOn === false,
      accOnBg: (s.accessOn !== false) ? '#3B5BFE' : 'transparent',
      accOnTx: (s.accessOn !== false) ? '#fff' : '#8A8F98',
      accOffBg: (s.accessOn === false) ? '#fff' : 'transparent',
      accOffTx: (s.accessOn === false) ? '#1A1A1D' : '#8A8F98',
      // festival cal/list toggle
      festCal: () => this.setState({ festView:'cal' }),
      festList: () => this.setState({ festView:'list' }),
      festIsCal: s.festView==='cal',
      festIsList: s.festView==='list',
      festCalBg: s.festView==='cal' ? '#fff' : 'transparent',
      festCalTx: s.festView==='cal' ? '#3B5BFE' : '#8A8F98',
      festListBg: s.festView==='list' ? '#fff' : 'transparent',
      festListTx: s.festView==='list' ? '#3B5BFE' : '#8A8F98',
    };
  }
}
