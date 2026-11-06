import { Component, computed, input } from '@angular/core';

const GREEN = ['Active', 'Healthy', 'Done', 'Normal', 'Income', 'Harvest Ready', 'In Stock'];
const ORANGE = ['At Risk', 'Warning', 'Medium', 'In Progress', 'Low Stock'];
const RED = ['Diseased', 'Critical', 'High', 'Overdue', 'Expense'];

@Component({
  selector: 'app-status-badge',
  template: `<span class="badge {{ color() }}">{{ label() }}</span>`,
})
export class StatusBadge {
  label = input.required<string>();

  color = computed(() => {
    const label = this.label();
    if (GREEN.includes(label)) return 'green';
    if (ORANGE.includes(label)) return 'orange';
    if (RED.includes(label)) return 'red';
    return 'grey';
  });
}
