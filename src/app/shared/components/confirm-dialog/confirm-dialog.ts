import { Component, input, output } from '@angular/core';
import { Modal } from '../modal/modal';

@Component({
  selector: 'app-confirm-dialog',
  imports: [Modal],
  template: `
    <app-modal [title]="title()" (close)="cancel.emit()">
      <div class="modal-body">
        <p>{{ message() }}</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-outline" (click)="cancel.emit()">Cancel</button>
        <button type="button" class="btn btn-danger" (click)="confirm.emit()">
          {{ confirmText() }}
        </button>
      </div>
    </app-modal>
  `,
})
export class ConfirmDialog {
  title = input('Are you sure?');
  message = input.required<string>();
  confirmText = input('Delete');
  confirm = output<void>();
  cancel = output<void>();
}
