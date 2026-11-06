import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  {
    path: 'login',
    title: 'Login',
    loadComponent: () => import('./pages/login/login').then((m) => m.Login),
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./layout/shell/shell').then((m) => m.Shell),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        title: 'Dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard').then((m) => m.Dashboard),
      },
      {
        path: 'fields',
        title: 'Fields',
        loadComponent: () => import('./pages/fields/fields').then((m) => m.Fields),
      },
      {
        path: 'crops',
        title: 'Crops',
        loadComponent: () => import('./pages/crops/crops').then((m) => m.Crops),
      },
      {
        path: 'tasks',
        title: 'Tasks',
        loadComponent: () => import('./pages/tasks/tasks').then((m) => m.Tasks),
      },
      {
        path: 'monitoring',
        title: 'Smart Monitoring',
        loadComponent: () => import('./pages/monitoring/monitoring').then((m) => m.Monitoring),
      },
      {
        path: 'inventory',
        title: 'Inventory',
        loadComponent: () => import('./pages/inventory/inventory').then((m) => m.Inventory),
      },
      {
        path: 'workers',
        title: 'Workers',
        loadComponent: () => import('./pages/workers/workers').then((m) => m.Workers),
      },
      {
        path: 'finance',
        title: 'Finance',
        loadComponent: () => import('./pages/finance/finance').then((m) => m.Finance),
      },
      {
        path: 'weather',
        title: 'Weather',
        loadComponent: () => import('./pages/weather/weather').then((m) => m.Weather),
      },
      {
        path: 'settings',
        title: 'Settings',
        loadComponent: () => import('./pages/settings/settings').then((m) => m.Settings),
      },
      {
        path: '**',
        title: 'Page Not Found',
        loadComponent: () => import('./pages/not-found/not-found').then((m) => m.NotFound),
      },
    ],
  },
];
