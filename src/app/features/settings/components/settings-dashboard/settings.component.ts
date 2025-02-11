import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { AppMainLayoutComponent } from 'core/layout/app-main-layout/app-main-layout.component';
import { PwaUpdateService } from 'core/services/pwa-update.service';

interface SettingsNavItem {
  path: string;
  icon: string;
  label: string;
}

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    AppMainLayoutComponent
  ],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {
  private pwaUpdateService = inject(PwaUpdateService);

  navigationItems: SettingsNavItem[] = [
    {
      path: '/settings/account',
      icon: 'account_circle',
      label: 'Account'
    }
  ];

  async clearAppCache(): Promise<void> {
    await this.pwaUpdateService.clearCache();
  }
}
