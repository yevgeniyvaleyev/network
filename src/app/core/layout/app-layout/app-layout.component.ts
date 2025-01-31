import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AppLayoutTab } from './app-layout.types';
import { MatTabsModule } from '@angular/material/tabs';

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
    MatTabsModule
  ],
  templateUrl: './app-layout.component.html',
  styleUrl: './app-layout.component.scss'
})
export class AppLayoutComponent {
  public router = inject(Router);


  @Input() title?: string;
  @Input() parentPath?: string;
  @Input() config?: AppLayoutTab[];
  @Output() tabClick = new EventEmitter<string>();

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
