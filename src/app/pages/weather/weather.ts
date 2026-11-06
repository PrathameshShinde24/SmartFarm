import { Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { WeatherService } from '../../core/services/weather.service';
import { EmptyState } from '../../shared/components/empty-state/empty-state';
import { PageHeader } from '../../shared/components/page-header/page-header';

@Component({
  selector: 'app-weather',
  imports: [DatePipe, PageHeader, EmptyState],
  templateUrl: './weather.html',
  styleUrl: './weather.css',
})
export class Weather {
  weatherService = inject(WeatherService);

  icons: Record<string, string> = {
    Sunny: 'sunny',
    'Partly Cloudy': 'partly_cloudy_day',
    Cloudy: 'cloud',
    Rain: 'rainy',
    Thunderstorm: 'thunderstorm',
    Windy: 'air',
  };

  constructor() {
    this.weatherService.load();
  }
}
