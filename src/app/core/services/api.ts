import { HttpClient } from '@angular/common/http';
import { Observable, catchError, forkJoin, of } from 'rxjs';

export const API_URL = 'http://localhost:3000';

export function deleteAll(
  http: HttpClient,
  url: string,
  items: { id: string }[],
): Observable<unknown> {
  if (items.length === 0) {
    return of(null);
  }
  return forkJoin(
    items.map((item) => http.delete(`${url}/${item.id}`).pipe(catchError(() => of(null)))),
  );
}

export function addAll<T>(http: HttpClient, url: string, items: T[]): Observable<unknown> {
  if (items.length === 0) {
    return of(null);
  }
  return forkJoin(items.map((item) => http.post<T>(url, item)));
}
