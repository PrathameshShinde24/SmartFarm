import { Directive, input } from '@angular/core';

@Directive({
  selector: '[appLowStock]',
  host: { '[class.low-stock]': 'quantity() <= reorderLevel()' },
})
export class LowStock {
  quantity = input.required<number>({ alias: 'appLowStock' });
  reorderLevel = input.required<number>();
}
