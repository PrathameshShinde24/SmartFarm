import {
  Component,
  ElementRef,
  OnDestroy,
  afterNextRender,
  computed,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Chart, registerables } from 'chart.js';
import {
  TRANSACTION_CATEGORIES,
  TRANSACTION_TYPES,
  Transaction,
  TransactionCategory,
  TransactionType,
} from '../../core/models';
import { FieldService } from '../../core/services/field.service';
import { FinanceService } from '../../core/services/finance.service';
import { lastMonths, monthLabel, today } from '../../core/utils/helpers';
import { ConfirmDialog } from '../../shared/components/confirm-dialog/confirm-dialog';
import { EmptyState } from '../../shared/components/empty-state/empty-state';
import { Modal } from '../../shared/components/modal/modal';
import { PageHeader } from '../../shared/components/page-header/page-header';
import { StatCard } from '../../shared/components/stat-card/stat-card';
import { StatusBadge } from '../../shared/components/status-badge/status-badge';

Chart.register(...registerables);

@Component({
  selector: 'app-finance',
  imports: [
    CurrencyPipe,
    DatePipe,
    ReactiveFormsModule,
    PageHeader,
    StatCard,
    StatusBadge,
    EmptyState,
    Modal,
    ConfirmDialog,
  ],
  templateUrl: './finance.html',
})
export class Finance implements OnDestroy {
  private financeService = inject(FinanceService);
  fieldService = inject(FieldService);
  private fb = inject(NonNullableFormBuilder);

  chartCanvas = viewChild.required<ElementRef<HTMLCanvasElement>>('chartCanvas');
  private chart: Chart | null = null;

  types = TRANSACTION_TYPES;
  categories = TRANSACTION_CATEGORIES;
  months = lastMonths(6)
    .reverse()
    .map((month) => ({ value: month, label: monthLabel(month) }));

  selectedMonth = signal(today().slice(0, 7));
  typeFilter = signal('All');
  showForm = signal(false);
  editId = signal<string | null>(null);
  transactionToDelete = signal<Transaction | null>(null);

  monthTransactions = computed(() => this.financeService.getByMonth(this.selectedMonth()));

  filteredTransactions = computed(() =>
    this.monthTransactions().filter(
      (t) => this.typeFilter() === 'All' || t.type === this.typeFilter(),
    ),
  );

  summary = computed(() => this.financeService.getSummary(this.selectedMonth()));

  expenseByCategory = computed(() => {
    const totals: Record<string, number> = {};
    for (const t of this.monthTransactions()) {
      if (t.type === 'Expense') {
        totals[t.category] = (totals[t.category] ?? 0) + t.amount;
      }
    }
    return totals;
  });

  form = this.fb.group({
    type: this.fb.control<TransactionType>('Expense'),
    category: this.fb.control<TransactionCategory>('Labour'),
    amount: [0, [Validators.required, Validators.min(1)]],
    date: [today(), Validators.required],
    fieldId: [''],
    note: [''],
  });

  constructor() {
    afterNextRender(() => this.createChart());
    effect(() => {
      const totals = this.expenseByCategory();
      if (this.chart) {
        this.chart.data.labels = Object.keys(totals);
        this.chart.data.datasets[0].data = Object.values(totals);
        this.chart.update();
      }
    });
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }

  openAddForm(): void {
    this.editId.set(null);
    this.form.reset();
    this.showForm.set(true);
  }

  openEditForm(t: Transaction): void {
    this.editId.set(t.id);
    this.form.setValue({
      type: t.type,
      category: t.category,
      amount: t.amount,
      date: t.date,
      fieldId: t.fieldId ?? '',
      note: t.note,
    });
    this.showForm.set(true);
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { fieldId, ...rest } = this.form.getRawValue();
    const transaction = fieldId ? { ...rest, fieldId } : rest;
    const id = this.editId();
    if (id) {
      this.financeService.update(id, transaction);
    } else {
      this.financeService.add(transaction);
    }
    this.showForm.set(false);
  }

  deleteTransaction(): void {
    const t = this.transactionToDelete();
    if (t) {
      this.financeService.delete(t.id);
    }
    this.transactionToDelete.set(null);
  }

  private createChart(): void {
    const totals = this.expenseByCategory();
    this.chart = new Chart(this.chartCanvas().nativeElement, {
      type: 'bar',
      data: {
        labels: Object.keys(totals),
        datasets: [
          {
            label: 'Expenses (₹)',
            data: Object.values(totals),
            backgroundColor: '#d08b2c',
            borderRadius: 4,
          },
        ],
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
      },
    });
  }
}
