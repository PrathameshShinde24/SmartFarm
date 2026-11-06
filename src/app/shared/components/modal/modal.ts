import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-modal',
  template: `
    <div class="modal-backdrop" (click)="close.emit()"></div>
    <div class="modal" role="dialog" aria-modal="true" [attr.aria-label]="title()">
      <div class="modal-header">
        <h3>{{ title() }}</h3>
        <button type="button" class="icon-btn" aria-label="Close" (click)="close.emit()">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>
      <ng-content />
    </div>
  `,
  host: { '(document:keydown.escape)': 'close.emit()' },
})
export class Modal {
  title = input.required<string>();
  close = output<void>();
}
