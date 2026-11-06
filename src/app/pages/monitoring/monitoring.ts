import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { SensorService } from '../../core/services/sensor.service';
import { EmptyState } from '../../shared/components/empty-state/empty-state';
import { PageHeader } from '../../shared/components/page-header/page-header';
import { StatusBadge } from '../../shared/components/status-badge/status-badge';

@Component({
  selector: 'app-monitoring',
  imports: [DatePipe, PageHeader, StatusBadge, EmptyState],
  templateUrl: './monitoring.html',
  styleUrl: './monitoring.css',
})
export class Monitoring implements OnInit, OnDestroy {
  sensorService = inject(SensorService);

  ngOnInit(): void {
    this.sensorService.start();
  }

  ngOnDestroy(): void {
    this.sensorService.stop();
  }
}
