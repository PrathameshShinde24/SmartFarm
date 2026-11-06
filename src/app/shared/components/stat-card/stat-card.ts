import { Component, input } from '@angular/core';

@Component({
  selector: 'app-stat-card',
  template: `
    <div class="card stat-card">
      <p class="stat-label">{{ label() }}</p>
      <p
        class="stat-value"
        [class.text-danger]="color() === 'red'"
        [class.text-success]="color() === 'green'"
      >
        {{ value() }}
      </p>
      @if (note()) {
        <p class="stat-note">{{ note() }}</p>
      }
    </div>
  `,
})
export class StatCard {
  label = input.required<string>();
  value = input.required<string | number>();
  note = input('');
  color = input('');
}
