import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EmptyState } from '../../shared/components/empty-state/empty-state';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink, EmptyState],
  template: `
    <div class="card">
      <app-empty-state
        icon="search_off"
        title="Page not found"
        message="The page you are looking for does not exist."
      >
        <a routerLink="/dashboard" class="btn btn-primary">Go to Dashboard</a>
      </app-empty-state>
    </div>
  `,
})
export class NotFound {}
