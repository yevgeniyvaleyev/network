import { Component, Input, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AppLayoutComponent } from '../../layout/app-layout/app-layout.component';
import { AppLayoutTab } from '../app-layout/app-layout.types';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [AppLayoutComponent],
  templateUrl: './app-main-layout.component.html',
})
export class AppMainLayoutComponent {
  public router = inject(Router);

  @Input() title = '';

  public tabsConfig: AppLayoutTab[] = [
    {
      routerPath: '/network',
      icon: 'hub'
    },
    {
      routerPath: '/dashboard',
      icon: 'dashboard'
    },
    {
      routerPath: '/settings',
      icon: 'settings',
    }
  ]

}
