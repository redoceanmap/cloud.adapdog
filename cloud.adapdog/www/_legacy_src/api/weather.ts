import type { WeatherData, WeatherLocation } from '@/types/weather';

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

interface OpenWeatherResponse {
  name: string;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
  };
}

export async function fetchCurrentWeather(location: WeatherLocation): Promise<WeatherData> {
  if (!API_KEY) {
    throw new Error('VITE_OPENWEATHER_API_KEY가 설정되지 않았습니다.');
  }

  const params = new URLSearchParams({
    lat: String(location.lat),
    lon: String(location.lng),
    appid: API_KEY,
    units: 'metric',
    lang: 'kr',
  });

  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?${params.toString()}`,
  );

  if (!response.ok) {
    throw new Error('날씨 정보를 불러오지 못했습니다.');
  }

  const data = (await response.json()) as OpenWeatherResponse;
  const current = data.weather[0];

  return {
    cityName: location.name || data.name,
    temperatureC: data.main.temp,
    feelsLikeC: data.main.feels_like,
    humidity: data.main.humidity,
    description: current.description,
    weatherMain: current.main,
    icon: current.icon,
    windSpeed: data.wind.speed,
  };
}
