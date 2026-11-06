import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Advisory, WeatherDay } from '../models';
import { daysFromToday } from '../utils/helpers';

interface WeatherResponse extends Omit<WeatherDay, 'date'> {
  dayOffset: number;
}

@Injectable({ providedIn: 'root' })
export class WeatherService {
  private http = inject(HttpClient);

  forecast = signal<WeatherDay[]>([]);
  error = signal(false);

  load(): void {
    if (this.forecast().length > 0) {
      return;
    }
    this.http.get<WeatherResponse[]>('data/weather.json').subscribe({
      next: (data) => {
        const days = data.map(({ dayOffset, ...day }) => ({
          ...day,
          date: daysFromToday(dayOffset),
        }));
        this.forecast.set(days);
      },
      error: () => this.error.set(true),
    });
  }

  getAdvisories(day: WeatherDay): Advisory[] {
    const advisories: Advisory[] = [];
    if (day.rainChance > 60) {
      advisories.push({
        title: 'Postpone spraying and irrigation',
        message: `${day.rainChance}% chance of rain.`,
        level: 'warning',
      });
    }
    if (day.maxTemp > 38) {
      advisories.push({
        title: 'Irrigate in the evening',
        message: `Temperature may reach ${day.maxTemp}°C. Evening irrigation reduces water loss.`,
        level: 'danger',
      });
    }
    if (day.wind > 20) {
      advisories.push({
        title: 'Avoid pesticide spraying',
        message: `Wind speed of ${day.wind} km/h can cause spray drift.`,
        level: 'warning',
      });
    }
    if (advisories.length === 0) {
      advisories.push({
        title: 'Good day for field work',
        message: 'No weather risks expected.',
        level: 'info',
      });
    }
    return advisories;
  }
}
