import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { Sidebar } from '../sidebar/sidebar';
import { Topbar } from '../topbar/topbar';

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, Sidebar, Topbar],
  templateUrl: './shell.html',
  styleUrl: './shell.css',
})
export class Shell {
  private auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  menuOpen = signal(false);

  pageTitle = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => this.getTitle()),
    ),
    { initialValue: this.getTitle() },
  );

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  private getTitle(): string {
    let route = this.route.snapshot;
    while (route.firstChild) {
      route = route.firstChild;
    }
    return route.title ?? '';
  }
}
