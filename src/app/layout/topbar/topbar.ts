import { Component, inject, input, output } from '@angular/core';
import { SettingsService } from '../../core/services/settings.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.html',
  styleUrl: './topbar.css',
})
export class Topbar {
  title = input('');
  menuClick = output<void>();
  logout = output<void>();

  settings = inject(SettingsService).settings;
}
