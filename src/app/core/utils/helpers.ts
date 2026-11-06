export function createId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

export function toDateString(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

export function today(): string {
  return toDateString(new Date());
}

export function daysFromToday(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return toDateString(date);
}

export function daysBetween(from: string, to: string): number {
  const oneDay = 24 * 60 * 60 * 1000;
  return Math.round((new Date(to).getTime() - new Date(from).getTime()) / oneDay);
}

export function monthLabel(month: string): string {
  const [year, monthNumber] = month.split('-').map(Number);
  return new Date(year, monthNumber - 1, 1).toLocaleDateString('en-IN', {
    month: 'short',
    year: 'numeric',
  });
}

export function lastMonths(count: number): string[] {
  const months: string[] = [];
  const now = new Date();
  for (let i = count - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(toDateString(date).slice(0, 7));
  }
  return months;
}
