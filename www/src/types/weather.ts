export type WalkRiskLevel = 'safe' | 'caution' | 'danger';

export interface WeatherData {
  cityName: string;
  temperatureC: number;
  feelsLikeC: number;
  humidity: number;
  description: string;
  weatherMain: string;
  icon: string;
  windSpeed: number;
}

export interface WalkRisk {
  level: WalkRiskLevel;
  label: string;
  message: string;
  showAlert: boolean;
}

export interface WeatherLocation {
  name: string;
  lat: number;
  lng: number;
}

export const DEFAULT_WEATHER_LOCATION: WeatherLocation = {
  name: '강릉',
  lat: 37.7519,
  lng: 128.8761,
};

/** 기온 30°C 이상 또는 강수 시 산책 주의 */
export function calculateWalkRisk(weather: WeatherData): WalkRisk {
  const rainy = ['Rain', 'Drizzle', 'Thunderstorm', 'Snow'].includes(weather.weatherMain);

  if (rainy) {
    return {
      level: 'danger',
      label: '주의',
      message: '비 또는 눈이 예상돼요. 실외 산책은 자제해 주세요.',
      showAlert: true,
    };
  }

  if (weather.temperatureC >= 30) {
    return {
      level: 'danger',
      label: '주의',
      message: `폭염(${Math.round(weather.temperatureC)}°C) · 한낮(12–4시) 산책을 피해 주세요.`,
      showAlert: true,
    };
  }

  if (weather.temperatureC >= 27 || weather.humidity >= 80) {
    return {
      level: 'caution',
      label: '보통',
      message: '더운 날씨예요. 그늘과 물을 자주 챙겨 주세요.',
      showAlert: true,
    };
  }

  return {
    level: 'safe',
    label: '양호',
    message: '산책하기 좋은 날씨예요.',
    showAlert: false,
  };
}
