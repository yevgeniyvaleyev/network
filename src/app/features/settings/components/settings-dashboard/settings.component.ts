import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { AppMainLayoutComponent } from '../../../../core/layout/app-main-layout/app-main-layout.component';
import { AppLayoutComponent } from '../../../../core/layout/app-layout/app-layout.component';

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
    AppMainLayoutComponent
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
    }
  ];
}
