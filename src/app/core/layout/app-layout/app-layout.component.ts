import { CommonModule } from '@angular/common';
import { Component, input, output, inject } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AppLayoutTab } from './app-layout.types';
import { MatTabsModule } from '@angular/material/tabs';
import { AppStore } from 'app/core/store/app.store';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatTabsModule,
    MatProgressBarModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './app-layout.component.html',
  styleUrls: ['./app-layout.component.scss']
})
export class AppLayoutComponent {
  public router = inject(Router);
  private appStore = inject(AppStore);

  title = input<string>();
  parentPath = input<string>();
  config = input<AppLayoutTab[]>();
  tabClick = output<string>();
  isProgress = input(false);

  public isOnline = this.appStore.isOnline;
  public isBackgroundSync = this.appStore.isBackgroundSync;

  goBack(): void {
    const path = this.parentPath();
    if (path) {
      this.router.navigate([path]);
    }
  }

  handleTabClick(tab: AppLayoutTab): void {
    if (tab.routerPath) {
      this.router.navigate([tab.routerPath]);
    } else {
      this.tabClick.emit(tab?.alias ?? '');
    }
  }

  getSelectedIndex(): number {
    const tabs = this.config();
    if (!tabs) return 0;
    return Math.max(0, tabs.findIndex((tab: AppLayoutTab) =>
      tab.routerPath && this.router.url.startsWith(tab.routerPath)
    ));
  }
}
