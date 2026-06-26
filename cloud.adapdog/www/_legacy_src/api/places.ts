import { apiClient } from './client';
import type { Place } from '@/types';
import { APP_REGION } from '@/utils/region';

interface PetPlaceApiItem {
  id: number;
  name: string;
  category: string;
  latitude: number;
  longitude: number;
  allowed_sizes: string[];
}

function mapPetPlaceItem(item: PetPlaceApiItem): Place {
  return {
    id: String(item.id),
    name: item.name,
    category: item.category,
    address: `강원특별자치도 ${APP_REGION}시 ${item.name}`,
    description: `반려견 동반 가능 크기: ${item.allowed_sizes.join(', ') || '정보 없음'}`,
    lat: item.latitude,
    lng: item.longitude,
    pettiquette: {
      level: 'allowed',
      label: '반려견 동반 가능',
      description: item.allowed_sizes.length
        ? `${item.allowed_sizes.join('/')} 견 가능`
        : undefined,
    },
    accessibility: {
      level: 'partial',
      label: '이동약자 배려 정보 없음',
      features: [],
    },
  };
}

export async function fetchPlaces(region = APP_REGION): Promise<Place[]> {
  const items = await apiClient<PetPlaceApiItem[]>('/map/pet-place/search', {
    params: { region },
  });
  return items.map(mapPetPlaceItem);
}

export async function fetchPlace(id: string, region = APP_REGION): Promise<Place> {
  const places = await fetchPlaces(region);
  const place = places.find((item) => item.id === id);
  if (!place) {
    throw new Error('장소를 찾을 수 없습니다.');
  }
  return place;
}
