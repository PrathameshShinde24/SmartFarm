import { Component, input, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  open = input(false);
  linkClicked = output<void>();

  links = [
    { path: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
    { path: '/fields', label: 'Fields', icon: 'landscape' },
    { path: '/crops', label: 'Crops', icon: 'potted_plant' },
    { path: '/tasks', label: 'Tasks', icon: 'task_alt' },
    { path: '/monitoring', label: 'Monitoring', icon: 'sensors' },
    { path: '/inventory', label: 'Inventory', icon: 'inventory_2' },
    { path: '/workers', label: 'Workers', icon: 'groups' },
    { path: '/finance', label: 'Finance', icon: 'account_balance_wallet' },
    { path: '/weather', label: 'Weather', icon: 'partly_cloudy_day' },
    { path: '/settings', label: 'Settings', icon: 'settings' },
  ];
}
