import {
  Component,
  ElementRef,
  OnDestroy,
  afterNextRender,
  computed,
  effect,
  inject,
  viewChild,
} from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { CropService } from '../../core/services/crop.service';
import { FieldService } from '../../core/services/field.service';
import { FinanceService } from '../../core/services/finance.service';
import { InventoryService } from '../../core/services/inventory.service';
import { SensorService } from '../../core/services/sensor.service';
import { TaskService } from '../../core/services/task.service';
import { WeatherService } from '../../core/services/weather.service';
import { lastMonths, monthLabel, today } from '../../core/utils/helpers';
import { StatCard } from '../../shared/components/stat-card/stat-card';

Chart.register(...registerables);

const CHART_COLORS = ['#2f6b3a', '#d08b2c', '#3b7ea1', '#8f5ba8', '#c4553f', '#6b8f2f'];

@Component({
  selector: 'app-dashboard',
  imports: [CurrencyPipe, RouterLink, StatCard],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnDestroy {
  fieldService = inject(FieldService);
  cropService = inject(CropService);
  taskService = inject(TaskService);
  inventoryService = inject(InventoryService);
  financeService = inject(FinanceService);
  sensorService = inject(SensorService);
  weatherService = inject(WeatherService);

  cropChartCanvas = viewChild.required<ElementRef<HTMLCanvasElement>>('cropChart');
  financeChartCanvas = viewChild.required<ElementRef<HTMLCanvasElement>>('financeChart');
  private cropChart: Chart | null = null;
  private financeChart: Chart | null = null;

  thisMonth = computed(() => this.financeService.getSummary(today().slice(0, 7)));
  todayWeather = computed(() => this.weatherService.forecast()[0]);
  criticalSensors = computed(() =>
    this.sensorService.readings().filter((r) => this.sensorService.getStatus(r) === 'Critical'),
  );

  alerts = computed(() => {
    const list: { text: string; link: string }[] = [];
    for (const r of this.criticalSensors()) {
      list.push({ text: `Critical sensor reading at ${r.fieldName}`, link: '/monitoring' });
    }
    for (const t of this.taskService.overdueTasks()) {
      list.push({ text: `Overdue: ${t.title}`, link: '/tasks' });
    }
    for (const i of this.inventoryService.lowStockItems()) {
      list.push({ text: `Low stock: ${i.name}`, link: '/inventory' });
    }
    return list;
  });

  cropArea = computed(() => {
    const area: Record<string, number> = {};
    const activeCrops = this.cropService.activeCrops();
    for (const crop of activeCrops) {
      const field = this.fieldService.fields().find((f) => f.id === crop.fieldId);
      const cropsInSameField = activeCrops.filter((c) => c.fieldId === crop.fieldId).length;
      if (field) {
        area[crop.crop] = (area[crop.crop] ?? 0) + field.area / cropsInSameField;
      }
    }
    return area;
  });

  months = lastMonths(6);
  monthlySummary = computed(() => this.months.map((m) => this.financeService.getSummary(m)));

  constructor() {
    this.weatherService.load();

    afterNextRender(() => {
      this.cropChart = new Chart(this.cropChartCanvas().nativeElement, {
        type: 'doughnut',
        data: {
          labels: [],
          datasets: [{ data: [], backgroundColor: CHART_COLORS, borderWidth: 0 }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: 'right' } },
        },
      });

      this.financeChart = new Chart(this.financeChartCanvas().nativeElement, {
        type: 'bar',
        data: {
          labels: this.months.map((m) => monthLabel(m)),
          datasets: [
            { label: 'Income', data: [], backgroundColor: CHART_COLORS[0] },
            { label: 'Expenses', data: [], backgroundColor: CHART_COLORS[1] },
          ],
        },
        options: { responsive: true, maintainAspectRatio: false },
      });

      this.updateCharts();
    });

    effect(() => {
      this.cropArea();
      this.monthlySummary();
      this.updateCharts();
    });
  }

  ngOnDestroy(): void {
    this.cropChart?.destroy();
    this.financeChart?.destroy();
  }

  private updateCharts(): void {
    const area = this.cropArea();
    const summary = this.monthlySummary();

    if (this.cropChart) {
      this.cropChart.data.labels = Object.keys(area);
      this.cropChart.data.datasets[0].data = Object.values(area);
      this.cropChart.update();
    }

    if (this.financeChart) {
      this.financeChart.data.datasets[0].data = summary.map((s) => s.income);
      this.financeChart.data.datasets[1].data = summary.map((s) => s.expense);
      this.financeChart.update();
    }
  }
}
