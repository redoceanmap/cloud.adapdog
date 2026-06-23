import { fetchCurrentWeather } from '@/api/weather';
import { useFetch } from '@/hooks/useFetch';
import type { WeatherData, WeatherLocation } from '@/types/weather';
import { DEFAULT_WEATHER_LOCATION } from '@/types/weather';

export function useWeather(location: WeatherLocation = DEFAULT_WEATHER_LOCATION) {
  return useFetch<WeatherData>(
    () => fetchCurrentWeather(location),
    [location.lat, location.lng, location.name],
  );
}
