"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Car,
  Check,
  MapPin,
  Plane,
  Sparkles,
  X,
} from "lucide-react";

interface Scenario {
  id: string;
  title: string;
  subtitle: string;
  persona: string;
  pet: string;
  transport: string;
  style: string;
  highlight: string;
  dialogue: { user: string; coco: string }[];
  places: { name: string; ok: boolean; note?: string }[];
  features: string[];
}

const SCENARIOS: Scenario[] = [
  {
    id: "jeonju",
    title: "김민주 × 체리",
    subtitle: "전주 문화유산 여행 · 대표 시나리오",
    persona: "서울 30대 직장인",
    pet: "체리 · 말티즈 · 5kg",
    transport: "자차",
    style: "거점형 1박 2일",
    highlight: "경유지 추천 · 문화시설 입장 가능 여부 확인",
    dialogue: [
      { user: "코코야, 전주로 여행 갈 거야", coco: "이동 수단은 어떻게 하실 건가요?" },
      { user: "자차로 갈 거야", coco: "가시는 길에 체리와 함께 들르기 좋은 곳 추천해드릴게요!" },
    ],
    places: [
      { name: "수원 광교호수공원", ok: true, note: "경유 · 반려견 동반" },
      { name: "전주 한옥마을", ok: true, note: "문화시설 · 입장 가능 구역" },
      { name: "전주 국립무형유산원", ok: true, note: "야외 공간 · 반려견 동반" },
      { name: "전주 국립전주박물관", ok: true, note: "야외 조각공원" },
      { name: "한옥 게스트하우스", ok: true, note: "체리 5kg 입장 가능 ✅" },
    ],
    features: ["자차 경유지 자동 추천", "문화시설 입장 가능 여부 확인", "체중 기준 입장 가능 판단"],
  },
  {
    id: "gyeongju",
    title: "이준혁 × 몽이",
    subtitle: "경주 역사문화 탐방 · 체중 필터링",
    persona: "부산 40대 가족 (부부+자녀)",
    pet: "몽이 · 진돗개 · 18kg",
    transport: "자차",
    style: "당일치기",
    highlight: "중형견 체중별 입장 제한 엄격 필터링",
    dialogue: [
      { user: "코코야, 경주 역사유적지 가보고 싶어", coco: "몽이는 18kg라 입장 제한이 있는 곳이 있어요. 몽이와 함께 갈 수 있는 곳만 보여드릴게요!" },
      { user: "", coco: "불국사 실내는 어렵지만, 토함산 자락 야외 트레킹 코스는 몽이와 함께 가능해요! 추가할까요?" },
    ],
    places: [
      { name: "경주 동궁과 월지", ok: true, note: "야외 공원 구역" },
      { name: "경주 대릉원", ok: true, note: "야외 능역 산책" },
      { name: "경주 보문관광단지", ok: true },
      { name: "경주 국립박물관 실내", ok: false, note: "자동 제외" },
      { name: "불국사 경내", ok: false, note: "대안: 토함산 야외 코스" },
    ],
    features: ["체중/크기별 시설 필터링", "입장 불가 시 대안 자동 제안", "가족+반려견 동선 최적화"],
  },
  {
    id: "jeju",
    title: "박서연 × 두부",
    subtitle: "제주 문화예술 여행 · 항공 규정",
    persona: "서울 20대 커플",
    pet: "두부 · 포메라니안 · 3kg",
    transport: "비행기",
    style: "휴양형 3박 4일",
    highlight: "항공사별 기내 반입 규정 · 렌터카 필터링",
    dialogue: [
      { user: "코코야, 두부랑 제주 3박 4일 가려고", coco: "이동 수단은요?" },
      { user: "비행기", coco: "두부(3kg)는 기내 반입 가능해요! ✅ 제주항공/티웨이 기내 반입 조건 안내해드릴게요. 이동장: 40×25×20cm 이하" },
    ],
    places: [
      { name: "제주도립미술관", ok: true, note: "야외 조각공원" },
      { name: "협재해수욕장", ok: true, note: "입장 가능 시간대 안내" },
      { name: "이중섭미술관", ok: true, note: "야외 공간 · 반려견 동반" },
      { name: "반려견 동반 렌터카", ok: true, note: "업체 3곳 추천" },
      { name: "응급 동물병원", ok: true, note: "여행 중 자동 표시" },
    ],
    features: ["항공사별 반입 규정 안내", "펫 동반 렌터카 필터링", "시즌별 야외 문화행사 연동"],
  },
  {
    id: "namhae",
    title: "최동현 × 콩이",
    subtitle: "남해안 문화 호핑 · 동선 최적화",
    persona: "서울 30대 프리랜서",
    pet: "콩이 · 비숑 · 6kg",
    transport: "자차",
    style: "호핑형 4박 5일",
    highlight: "매일 숙소 변경 · 체크인/아웃 동선 최적화",
    dialogue: [
      { user: "코코야, 남해안 쭉 돌면서 여행하고 싶어. 숙소도 매일 바꿀 거야", coco: "호핑 여행이군요! 🐾 매 거점마다 콩이와 함께 숙박 가능한 숙소를 각각 추천해드릴게요. 체크아웃/체크인 동선도 최적화해드릴게요!" },
      { user: "", coco: "내일 체크아웃 후 순천까지 30분이에요. 콩이 이동 스트레스 최소 구간입니다 🐾" },
    ],
    places: [
      { name: "여수 예울마루", ok: true, note: "Day1 · 야외 공연장" },
      { name: "순천만 국가정원", ok: true, note: "Day2 · 펫 동반 구역" },
      { name: "담양 한국대나무박물관", ok: true, note: "Day3 · 야외" },
      { name: "통영 국제음악당", ok: true, note: "Day4 · 야외 공간" },
      { name: "거점별 펫 숙소 4곳", ok: true, note: "콩이 6kg 일괄 확인 ✅" },
    ],
    features: ["거점별 숙소 일괄 추천", "이동 스트레스 지수 안내", "매일 아침 코코 브리핑 알림"],
  },
];

const COMPARE_ROWS = [
  { label: "여행 스타일", values: ["거점형", "당일치기", "휴양형", "호핑형"] },
  { label: "이동 수단", values: ["자차", "자차", "비행기", "자차"] },
  { label: "반려견 크기", values: ["소형 5kg", "중형 18kg", "소형 3kg", "소형 6kg"] },
  { label: "핵심 차별점", values: ["경유지", "체중 필터", "항공 규정", "동선 최적화"] },
];

export default function HackathonScenariosSection() {
  const [active, setActive] = useState(0);
  const scenario = SCENARIOS[active];

  return (
    <section id="scenarios" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <span className="inline-block text-sm font-semibold text-sage bg-sage/10 px-4 py-1.5 rounded-full mb-4">
            여행 유형별 추천
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-brown mb-4">
            문화시설 + 애견 동반,
            <br />
            <span className="gradient-text">4가지 여행 유형</span>
          </h2>
          <p className="text-brown-light max-w-2xl mx-auto leading-relaxed">
            국립박물관, 무형유산원, 문화전당처럼 강아지와 함께 갈 수 있는 곳만 골라
            체리·몽이·두부·콩이에게 맞는 일정을 짜 드려요.
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {SCENARIOS.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setActive(i)}
              className={`text-sm font-medium px-4 py-2 rounded-full transition-all ${
                active === i
                  ? "bg-sage text-white shadow-md shadow-sage/25"
                  : "bg-cream text-brown-light hover:bg-sage/10 hover:text-sage"
              }`}
            >
              {s.id === "jeonju" && "① 전주"}
              {s.id === "gyeongju" && "② 경주"}
              {s.id === "jeju" && "③ 제주"}
              {s.id === "namhae" && "④ 남해안"}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={scenario.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35 }}
            className="grid lg:grid-cols-5 gap-6"
          >
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-cream rounded-3xl p-6 border border-sage/10">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-5 h-5 text-sage" />
                  <h3 className="text-lg font-bold text-brown">{scenario.title}</h3>
                </div>
                <p className="text-sm text-sage font-medium mb-4">{scenario.subtitle}</p>

                <div className="grid grid-cols-2 gap-2 text-xs mb-4">
                  {[
                    { label: "사용자", value: scenario.persona },
                    { label: "반려견", value: scenario.pet },
                    { label: "이동", value: scenario.transport },
                    { label: "스타일", value: scenario.style },
                  ].map((item) => (
                    <div key={item.label} className="bg-white rounded-xl p-2.5 border border-sage/10">
                      <div className="text-brown-light mb-0.5">{item.label}</div>
                      <div className="font-semibold text-brown">{item.value}</div>
                    </div>
                  ))}
                </div>

                <div className="text-xs text-brown-light bg-sage/10 text-sage font-medium px-3 py-2 rounded-lg">
                  {scenario.highlight}
                </div>
              </div>

              <div className="space-y-2">
                {scenario.dialogue.map((d, i) => (
                  <div key={i} className="space-y-2">
                    {d.user && (
                      <div className="flex justify-end">
                        <div className="bg-sage text-white text-xs px-3 py-2 rounded-2xl rounded-tr-sm max-w-[90%]">
                          {d.user}
                        </div>
                      </div>
                    )}
                    <div className="flex justify-start">
                      <div className="bg-white border border-sage/15 text-brown text-xs px-3 py-2 rounded-2xl rounded-tl-sm max-w-[95%] leading-relaxed shadow-sm">
                        <span className="text-sage font-bold">코코 · </span>
                        {d.coco}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-3 space-y-4">
              <div className="bg-warm-white rounded-3xl p-6 border border-sage/10">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-5 h-5 text-sage" />
                  <span className="font-bold text-brown">추천 장소 · 필터링 결과</span>
                </div>
                <div className="space-y-2">
                  {scenario.places.map((place) => (
                    <div
                      key={place.name}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm ${
                        place.ok
                          ? "bg-sage/8 border border-sage/15"
                          : "bg-coral/8 border border-coral/20 opacity-80"
                      }`}
                    >
                      {place.ok ? (
                        <Check className="w-4 h-4 text-sage shrink-0" />
                      ) : (
                        <X className="w-4 h-4 text-coral-dark shrink-0" />
                      )}
                      <div className="flex-1">
                        <div className={`font-medium ${place.ok ? "text-brown" : "text-brown-light line-through"}`}>
                          {place.name}
                        </div>
                        {place.note && (
                          <div className="text-xs text-brown-light mt-0.5">{place.note}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {scenario.features.map((f) => (
                  <span
                    key={f}
                    className="text-xs font-medium text-sage bg-sage/10 px-3 py-1.5 rounded-full"
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-14 overflow-x-auto"
        >
          <div className="min-w-[640px] bg-cream rounded-2xl border border-sage/10 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-sage/10">
                  <th className="text-left px-4 py-3 font-semibold text-brown">구분</th>
                  {["① 전주", "② 경주", "③ 제주", "④ 남해안"].map((h) => (
                    <th key={h} className="px-4 py-3 font-semibold text-sage text-center">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARE_ROWS.map((row) => (
                  <tr key={row.label} className="border-t border-sage/10">
                    <td className="px-4 py-3 font-medium text-brown-light">{row.label}</td>
                    {row.values.map((v, i) => (
                      <td key={i} className="px-4 py-3 text-center text-brown">
                        {row.label === "이동 수단" && v === "비행기" ? (
                          <span className="inline-flex items-center gap-1">
                            <Plane className="w-3.5 h-3.5 text-sage" />
                            {v}
                          </span>
                        ) : row.label === "이동 수단" ? (
                          <span className="inline-flex items-center gap-1">
                            <Car className="w-3.5 h-3.5 text-sage" />
                            {v}
                          </span>
                        ) : (
                          v
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-3"
        >
          {[
            "전국 문화시설 펫 동반 정보",
            "반려견 맞춤 일정 설계",
            "코코 AI가 함께 안내",
            "여행 스타일별 추천",
          ].map((point) => (
            <div
              key={point}
              className="text-center text-xs font-medium text-brown bg-sage/8 border border-sage/15 rounded-xl px-3 py-3"
            >
              ✅ {point}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
