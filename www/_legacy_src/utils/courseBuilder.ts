import type { CourseStop, CourseStopStatus, Place, TravelCourse } from '@/types';

function placeStatus(place: Place): CourseStopStatus {
  if (place.pettiquette.level === 'allowed') return 'allowed';
  if (place.pettiquette.level === 'restricted') return 'conditional';
  return 'denied';
}

function statusMessage(place: Place): string {
  if (place.pettiquette.level === 'allowed') return '입장 가능';
  if (place.pettiquette.level === 'restricted') {
    return place.pettiquette.description ?? '일부 제한';
  }
  return '입장 불가';
}

export function placeToCourseStop(place: Place, order: number): CourseStop {
  const tags: CourseStop['tags'] = [{ icon: 'leash', label: '목줄 필수' }];
  if (place.pettiquette.description?.includes('실내')) {
    tags.push({ icon: 'indoor', label: '실내 가능' });
  } else {
    tags.push({ icon: 'outdoor', label: '야외' });
  }

  return {
    id: `draft-${place.id}`,
    order,
    day: 1,
    name: place.name,
    category: place.category,
    lat: place.lat,
    lng: place.lng,
    stayDuration: '1시간',
    distanceToNext: order === 1 ? '—' : '—',
    tags,
    status: placeStatus(place),
    statusMessage: statusMessage(place),
  };
}

export function buildCustomCourse(stops: CourseStop[], dogName?: string): TravelCourse {
  const title = dogName ? `${dogName} 맞춤 코스` : '내가 고른 코스';

  return {
    id: 'course-custom',
    title,
    region: '강릉',
    totalDays: 1,
    totalDistanceKm: Math.max(stops.length * 1.2, 2),
    stops: stops.map((stop, index) => ({
      ...stop,
      order: index + 1,
      day: 1,
    })),
  };
}
