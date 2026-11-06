import { Injectable, inject, signal } from '@angular/core';
import { SensorAlert, SensorReading, SensorStatus } from '../models';
import { FieldService } from './field.service';

const START_VALUES: Record<string, Partial<SensorReading>> = {
  f1: { moisture: 46, temperature: 27.4, humidity: 58, ph: 7.4 },
  f2: { moisture: 31, temperature: 29.1, humidity: 64, ph: 6.8 },
  f3: { moisture: 18, temperature: 33.6, humidity: 41, ph: 6.5 },
  f4: { moisture: 37, temperature: 30.2, humidity: 55, ph: 8.1 },
};

@Injectable({ providedIn: 'root' })
export class SensorService {
  private fieldService = inject(FieldService);
  private timer: ReturnType<typeof setInterval> | null = null;

  readings = signal<SensorReading[]>([]);
  alerts = signal<SensorAlert[]>([]);

  constructor() {
    this.loadFields();
  }

  start(): void {
    this.loadFields();
    if (!this.timer) {
      this.timer = setInterval(() => this.updateReadings(), 3000);
    }
  }

  stop(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  toggleIrrigation(fieldId: string): void {
    this.readings.update((list) =>
      list.map((r) => (r.fieldId === fieldId ? { ...r, irrigating: !r.irrigating } : r)),
    );
  }

  getStatus(r: SensorReading): SensorStatus {
    if (r.moisture < 20 || r.temperature > 40 || r.ph < 5.5 || r.ph > 8.5) {
      return 'Critical';
    }
    if (r.moisture < 30 || r.temperature > 35 || r.humidity > 85 || r.ph < 6 || r.ph > 8) {
      return 'Warning';
    }
    return 'Normal';
  }

  reset(): void {
    this.readings.set([]);
    this.alerts.set([]);
    this.loadFields();
  }

  private loadFields(): void {
    const current = this.readings();
    const readings = this.fieldService.activeFields().map((field) => {
      const existing = current.find((r) => r.fieldId === field.id);
      if (existing) {
        return { ...existing, fieldName: field.name };
      }
      return {
        fieldId: field.id,
        fieldName: field.name,
        moisture: 45,
        temperature: 28,
        humidity: 60,
        ph: 7,
        irrigating: false,
        ...START_VALUES[field.id],
      };
    });
    this.readings.set(readings);
  }

  private updateReadings(): void {
    const updated = this.readings().map((r) => {
      const moistureChange = r.irrigating
        ? 1.5 + Math.random() * 1.5
        : -(0.2 + Math.random() * 0.8);
      const next: SensorReading = {
        ...r,
        moisture: this.limit(r.moisture + moistureChange, 5, 95),
        temperature: this.limit(r.temperature + this.randomChange(0.4), 15, 45),
        humidity: this.limit(r.humidity + this.randomChange(1.5), 20, 95),
        ph: Math.round(this.limit(r.ph + this.randomChange(0.04), 4, 9) * 100) / 100,
      };
      const oldStatus = this.getStatus(r);
      const newStatus = this.getStatus(next);
      if (oldStatus !== newStatus) {
        this.addAlert(next, newStatus);
      }
      return next;
    });
    this.readings.set(updated);
  }

  private addAlert(r: SensorReading, status: SensorStatus): void {
    const alert: SensorAlert = {
      time: new Date(),
      fieldName: r.fieldName,
      status,
      message: `Status changed to ${status} (moisture ${r.moisture}%, temp ${r.temperature}°C, pH ${r.ph})`,
    };
    this.alerts.update((list) => [alert, ...list].slice(0, 20));
  }

  private randomChange(range: number): number {
    return (Math.random() * 2 - 1) * range;
  }

  private limit(value: number, min: number, max: number): number {
    return Math.round(Math.min(max, Math.max(min, value)) * 10) / 10;
  }
}
