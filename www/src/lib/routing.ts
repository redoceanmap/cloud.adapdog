// 실제 도로 경로 — OSRM 공개 데모 서버로 좌표들을 도로(고속도로·국도)를 따라 연결한다.
// 무료·무키. 실패(레이트리밋/네트워크)하면 null → 호출부에서 직선으로 폴백.
export interface LatLng { lat: number; lng: number }

export async function fetchDrivingRoute(points: LatLng[]): Promise<LatLng[] | null> {
  if (!points || points.length < 2) return null;
  // OSRM는 lng,lat 순서. overview=full + geojson → 도로를 따라간 폴리라인 좌표열.
  const coords = points.map((p) => `${p.lng},${p.lat}`).join(';');
  const url = `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    const line = data?.routes?.[0]?.geometry?.coordinates;
    if (!Array.isArray(line) || line.length < 2) return null;
    return line.map(([lng, lat]: [number, number]) => ({ lat, lng }));
  } catch {
    return null;
  }
}
