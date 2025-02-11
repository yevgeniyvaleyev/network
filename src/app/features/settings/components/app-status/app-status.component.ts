import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { AppLayoutComponent } from 'app/core/layout/app-layout/app-layout.component';
import { PwaUpdateService } from 'core/services/pwa-update.service';

@Component({
  selector: 'app-status',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    AppLayoutComponent
  ],
  templateUrl: './app-status.component.html',
  styleUrls: ['./app-status.component.scss']
})
export class AppStatusComponent {
  private pwaUpdateService = inject(PwaUpdateService);
  readonly updateAvailable = this.pwaUpdateService.updateAvailable;

  async updateApp(): Promise<void> {
    await this.pwaUpdateService.activateUpdate();
  }
}
