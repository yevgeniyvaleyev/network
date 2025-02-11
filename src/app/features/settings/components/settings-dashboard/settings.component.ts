import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { AppMainLayoutComponent } from 'core/layout/app-main-layout/app-main-layout.component';

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
    MatTooltipModule,
    AppMainLayoutComponent,
    MatCardModule
  ],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {


  navigationItems: SettingsNavItem[] = [
    {
      path: '/settings/account',
      icon: 'account_circle',
      label: 'Account'
    },
    {
      path: '/settings/app-status',
      icon: 'system_update',
      label: 'App Status'
    }
  ];
}
