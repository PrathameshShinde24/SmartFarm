export interface WeatherDay {
  date: string;
  condition: string;
  minTemp: number;
  maxTemp: number;
  rainChance: number;
  humidity: number;
  wind: number;
}

export interface Advisory {
  title: string;
  message: string;
  level: 'info' | 'warning' | 'danger';
}
