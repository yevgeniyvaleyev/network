import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AppLayoutTab } from './app-layout.types';
import { MatTabsModule } from '@angular/material/tabs';
import { AppStore } from 'app/core/store/app.store';
import { MatProgressBarModule } from '@angular/material/progress-bar';

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
    MatProgressBarModule
  ],
  templateUrl: './app-layout.component.html',
  styleUrl: './app-layout.component.scss'
})
export class AppLayoutComponent {
  public router = inject(Router);
  private appStore = inject(AppStore);


  @Input() title?: string;
  @Input() parentPath?: string;
  @Input() config?: AppLayoutTab[];
  @Output() tabClick = new EventEmitter<string>();

  public isOnline = this.appStore.isOnline;
  public isBackgroundSync = this.appStore.isBackgroundSync;

  goBack(): void {
    if (this.parentPath) {
      this.router.navigate([this.parentPath]);
    }
  }

  handleTabClick(tab: AppLayoutTab): void {
    if (tab.routerPath) {
      this.router.navigate([tab.routerPath]);
    } else {
      this.tabClick.emit(tab.alias);
    }
  }

  getSelectedIndex(): number {
    if (!this.config) return 0;
    return Math.max(0, this.config.findIndex((tab: AppLayoutTab) =>
      tab.routerPath && this.router.url.startsWith(tab.routerPath)
    ));
  }
}
