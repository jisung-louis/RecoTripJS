// 타입 정의
export type Place = { name: string; lat: number; lng: number };
export type RouteDay = { day: number; places: string[] };

// 두 지점 간 거리(km) 계산 (Haversine 공식)
function getDistance(a: Place, b: Place): number {
  const toRad = (v: number) => (v * Math.PI) / 180;
  const R = 6371; // km
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const aVal =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLng / 2) * Math.sin(dLng / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(aVal), Math.sqrt(1 - aVal));
  return R * c;
}

// 가까운 Place끼리 한 날짜로 묶는 Greedy 클러스터링 기반 일정 생성
export function autoSchedule(
  landmarks: string[],
  startDate: Date,
  endDate: Date,
  placeCoordinates: Place[]
): RouteDay[] {
  const days = Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1);
  if (placeCoordinates.length === 0) return [];

  const places = placeCoordinates.filter((p) => landmarks.includes(p.name));
  const groups: Place[][] = Array.from({ length: days }, () => []);
  const used = new Set<number>();
  let currentGroup = 0;

  while (used.size < places.length) {
    // 그룹이 다 찼으면 다음 그룹
    if (groups[currentGroup].length >= Math.ceil(places.length / days)) {
      currentGroup++;
      if (currentGroup >= days) currentGroup = days - 1; // 마지막 그룹에 몰아넣기
    }

    // 그룹의 첫 장소: 아직 안 쓴 것 중 임의 pick
    let last: Place | null = null;
    if (groups[currentGroup].length === 0) {
      const idx = places.findIndex((_, i) => !used.has(i));
      last = places[idx];
      groups[currentGroup].push(last);
      used.add(idx);
      continue;
    } else {
      last = groups[currentGroup][groups[currentGroup].length - 1];
    }

    // 가장 가까운 미사용 place 찾기
    let minDist = Infinity;
    let minIdx = -1;
    for (let i = 0; i < places.length; i++) {
      if (used.has(i)) continue;
      const dist = getDistance(last, places[i]);
      if (dist < minDist) {
        minDist = dist;
        minIdx = i;
      }
    }
    if (minIdx !== -1) {
      last = places[minIdx];
      groups[currentGroup].push(last);
      used.add(minIdx);
    }
  }

  return groups.map((group, i) => ({
    day: i + 1,
    places: group.map((p) => p.name),
  }));
} 