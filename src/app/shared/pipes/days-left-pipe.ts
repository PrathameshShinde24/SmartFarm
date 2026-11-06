import { Pipe, PipeTransform } from '@angular/core';
import { daysBetween, today } from '../../core/utils/helpers';

@Pipe({ name: 'daysLeft' })
export class DaysLeftPipe implements PipeTransform {
  transform(date: string): string {
    const days = daysBetween(today(), date);
    if (days === 0) {
      return 'today';
    }
    if (days > 0) {
      return days === 1 ? 'in 1 day' : `in ${days} days`;
    }
    return Math.abs(days) === 1 ? '1 day overdue' : `${Math.abs(days)} days overdue`;
  }
}
