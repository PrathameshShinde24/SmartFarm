import { Component, input } from '@angular/core';

@Component({
  selector: 'app-page-header',
  template: `
    <div class="page-header">
      <div>
        <h2>
          {{ title() }}
          <ng-content select="[badge]" />
        </h2>
        @if (subtitle()) {
          <p>{{ subtitle() }}</p>
        }
      </div>
      <div class="page-actions">
        <ng-content />
      </div>
    </div>
  `,
})
export class PageHeader {
  title = input.required<string>();
  subtitle = input('');
}
