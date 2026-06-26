export interface LatLng {
  lat: number;
  lng: number;
}

/** 두 지점 사이 도로 이동 시간(분). 실패 시 null. */
export async function fetchDrivingLegMinutes(from: LatLng, to: LatLng): Promise<number | null> {
  const url = `https://router.project-osrm.org/route/v1/driving/${from.lng},${from.lat};${to.lng},${to.lat}?overview=false`;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    const sec = data?.routes?.[0]?.duration;
    if (typeof sec !== "number") return null;
    return Math.max(1, Math.round(sec / 60));
  } catch {
    return null;
  }
}

/** OSRM 공개 API로 도로 경로 좌표를 가져온다. 실패 시 null. */
export async function fetchDrivingRoute(points: LatLng[]): Promise<LatLng[] | null> {
  if (!points || points.length < 2) return null;
  const coords = points.map((p) => `${p.lng},${p.lat}`).join(";");
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
