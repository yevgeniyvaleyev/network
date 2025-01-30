import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MainConfig, MainTab } from './main.types';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-main',
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
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {
  public router = inject(Router);

  @Input() title = '';
  @Input() hasBackButton = false;
  @Input() config?: MainConfig;
  @Output() tabClick = new EventEmitter<string>();

  goBack(): void {
    const currentUrl = this.router.url;
    const urlParts = currentUrl.split('/').filter(part => part !== '');
    urlParts.pop();
    const parentUrl = `/${urlParts.join('/')}`;
    this.router.navigate([parentUrl]);
  }

  handleTabClick(tab: MainTab): void {
    if (tab.routerPath) {
      this.router.navigate([tab.routerPath]);
    } else {
      this.tabClick.emit(tab.tabAlias);
    }
  }

  getSelectedIndex(): number {
    if (!this.config?.tabs) return 0;
    return Math.max(0, this.config.tabs.findIndex(tab => 
      tab.routerPath && this.router.url.startsWith(tab.routerPath)
    ));
  }
}
