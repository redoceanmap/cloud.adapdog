import { apiFetch, parseApiError } from "@/lib/api";

export interface AnimalHospital {
  name: string;
  latitude: number;
  longitude: number;
  phone: string;
  road_address: string;
  is_24h: boolean;
  is_open: boolean;
  distance_km: number | null;
}

export interface AnimalHospitalList {
  region: string;
  total: number;
  hospitals: AnimalHospital[];
}

export type SymptomCategory =
  | "vomit"
  | "diarrhea"
  | "heat"
  | "breathing"
  | "injury"
  | "lethargy"
  | "general";

export const SYMPTOM_CATEGORY_LABEL: Record<SymptomCategory, string> = {
  vomit: "토·위장 증상",
  diarrhea: "설사·장 증상",
  heat: "더위·호흡 곤란",
  breathing: "호흡·심장 응급",
  injury: "외상·절뚝",
  lethargy: "무기력·식욕 부진",
  general: "일반 응급",
};

const SYMPTOM_PATTERNS: { category: SymptomCategory; re: RegExp }[] = [
  { category: "vomit", re: /토|구토|메스꺼|토했|구역질/ },
  { category: "diarrhea", re: /설사|물변|변비|대변|똥/ },
  { category: "heat", re: /더위|헥헥|숨|열|질식|온도/ },
  { category: "breathing", re: /호흡|숨을|숨쉬|심장|경련|발작|의식/ },
  { category: "injury", re: /다쳤|상처|절뚝|다리|출혈|피|넘어/ },
  { category: "lethargy", re: /무기력|축|안 먹|식욕|잠만|힘이/ },
];

export function classifySymptom(text: string): SymptomCategory {
  for (const { category, re } of SYMPTOM_PATTERNS) {
    if (re.test(text)) return category;
  }
  return "general";
}

export function isUrgentCategory(category: SymptomCategory): boolean {
  return category === "vomit" || category === "breathing" || category === "injury";
}

export function rankHospitalsForSymptom(
  hospitals: AnimalHospital[],
  category: SymptomCategory,
): AnimalHospital[] {
  const copy = [...hospitals];
  if (isUrgentCategory(category) || category === "heat") {
    copy.sort((a, b) => {
      const da = a.distance_km ?? 999;
      const db = b.distance_km ?? 999;
      if (a.is_24h !== b.is_24h) return a.is_24h ? -1 : 1;
      return da - db;
    });
    return copy;
  }
  copy.sort((a, b) => (a.distance_km ?? 999) - (b.distance_km ?? 999));
  return copy;
}

export function followUpForCategory(category: SymptomCategory, petName: string): string {
  switch (category) {
    case "vomit":
      return `${petName}의 토 증상을 확인할게요.\n· 토한 횟수와 시간 간격은 어떻게 되나요?\n· 토 내용물 색·형태가 어땠나요? (사진 첨부 가능)\n· 무기력·설사·떨림 등 다른 증상이 있나요?`;
    case "diarrhea":
      return `설사 증상이면 탈수가 빠를 수 있어요.\n· 하루 몇 번, 묽기 정도는 어떤가요?\n· 피·점액이 섞였나요?\n· 식욕·활력은 어떤가요?`;
    case "heat":
      return `더위·호흡 관련 증상이면 즉시 그늘로 옮기고 물을 주세요.\n· 헥헥거림이 얼마나 지속됐나요?\n· 토·경련·쓰러짐이 있었나요?`;
    case "breathing":
      return `호흡·의식 관련 증상은 응급일 수 있어요.\n· 숨소리가 거칠거나 입을 벌리고 숨 쉬나요?\n· 잇몸 색이 창백하거나 보라색인가요?`;
    case "injury":
      return `외상·절뚝 증상이면 움직임을 최소화해 주세요.\n· 언제부터, 어느 부위가 아픈 것 같나요?\n· 출혈·부종이 있나요?`;
    case "lethargy":
      return `무기력·식욕 부진도 여러 원인이 있을 수 있어요.\n· 증상이 언제부터인가요?\n· 토·설사·열이 동반됐나요?`;
    default:
      return `증상을 조금 더 알려주시면 가까운 병원 안내에 반영할게요.\n· 언제부터인지, 다른 동반 증상이 있는지 말씀해 주세요.`;
  }
}

export function guidanceForCategory(category: SymptomCategory): string {
  switch (category) {
    case "vomit":
      return "짧은 시간에 여러 번 토하거나 혈·검은색 토가 보이면 응급일 수 있어요. 가능한 빨리 동물병원에 가 주세요.";
    case "diarrhea":
      return "잦은 설사는 탈수로 이어질 수 있어요. 물은 소량씩 자주 주고, 가능한 빨리 진료를 받으세요.";
    case "heat":
      return "더위 취약 견종은 열사병 위험이 큽니다. 시원한 곳으로 옮기고, 호흡이 가라앉지 않으면 즉시 병원으로 가세요.";
    case "breathing":
      return "호흡 곤란·경련·의식 저하는 즉시 응급입니다. 이동 중에도 환기를 유지해 주세요.";
    case "injury":
      return "출혈이 크거나 다리를 전혀 딛지 못하면 응급 처치 후 바로 병원 방문을 권장해요.";
    case "lethargy":
      return "24시간 이상 식욕이 없거나 축 처져 있으면 탈수·내과 질환 가능성이 있어요. 진료를 권장합니다.";
    default:
      return "정확한 진단은 수의사만 할 수 있어요. 증상이 악화되면 지체하지 말고 병원에 가 주세요.";
  }
}

async function requestNearbyHospitals(opts: {
  region?: string;
  latitude?: number;
  longitude?: number;
  limit?: number;
  open_only: boolean;
}): Promise<AnimalHospitalList> {
  const res = await apiFetch("/map/animal-hospital/nearby", {
    method: "POST",
    body: JSON.stringify({
      region: opts.region || undefined,
      latitude: opts.latitude,
      longitude: opts.longitude,
      open_only: opts.open_only,
      limit: opts.limit ?? 5,
    }),
  });
  if (!res.ok) throw new Error(await parseApiError(res));
  return res.json() as Promise<AnimalHospitalList>;
}

export async function fetchNearbyHospitals(opts: {
  region?: string;
  latitude?: number;
  longitude?: number;
  limit?: number;
}): Promise<AnimalHospitalList> {
  const base = {
    region: opts.region,
    latitude: opts.latitude,
    longitude: opts.longitude,
    limit: opts.limit ?? 5,
  };
  const open = await requestNearbyHospitals({ ...base, open_only: true });
  if (open.hospitals.length > 0) return open;

  const hasCoords =
    opts.latitude != null &&
    opts.longitude != null &&
    Number.isFinite(opts.latitude) &&
    Number.isFinite(opts.longitude);

  if (opts.region && hasCoords) {
    const withoutRegion = await requestNearbyHospitals({
      ...base,
      region: undefined,
      open_only: true,
    });
    if (withoutRegion.hospitals.length > 0) return withoutRegion;
  }

  return requestNearbyHospitals({ ...base, open_only: false });
}

export function formatHospitalDistance(km: number | null): string {
  if (km == null) return "거리 정보 없음";
  if (km < 1) return `${Math.round(km * 1000)}m`;
  return `${km.toFixed(1)}km`;
}

export function hospitalMapUrl(h: AnimalHospital): string {
  return `https://map.naver.com/v5/search/${encodeURIComponent(h.name)}`;
}

export function hospitalTelUrl(phone: string): string {
  return `tel:${phone.replace(/[^0-9]/g, "")}`;
}

export interface SymptomTriageResult {
  reply: string;
  possible_conditions: string[];
  urgency: "low" | "medium" | "high";
  advice: string;
  is_diagnostic: boolean;
}

export async function symptomTriage(
  messages: { role: string; content: string }[],
  petBreed = "골든 리트리버",
  petSize = "large",
): Promise<SymptomTriageResult> {
  const res = await apiFetch("/care/symptom-check/triage", {
    method: "POST",
    body: JSON.stringify({
      messages,
      pet_breed: petBreed,
      pet_size: petSize,
    }),
  });
  if (!res.ok) throw new Error(await parseApiError(res));
  return res.json() as Promise<SymptomTriageResult>;
}
