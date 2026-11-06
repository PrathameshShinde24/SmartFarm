import { Component, input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  template: `
    <div class="empty-state">
      <span class="material-symbols-outlined">{{ icon() }}</span>
      <h3>{{ title() }}</h3>
      @if (message()) {
        <p>{{ message() }}</p>
      }
      <ng-content />
    </div>
  `,
})
export class EmptyState {
  icon = input('inbox');
  title = input.required<string>();
  message = input('');
}
