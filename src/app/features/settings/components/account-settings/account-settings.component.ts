import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AppLayoutComponent } from '../../../../core/layout/app-layout/app-layout.component';
import { computed } from '@angular/core';
import { AuthService } from 'app/core/services/auth.service';
import { AuthStore } from 'app/core/store/auth.store';

@Component({
  selector: 'app-account-settings',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    AppLayoutComponent
  ],
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.scss']
})
export class AccountSettingsComponent {
  private authStore = inject(AuthStore);
  private authService = inject(AuthService);

  readonly userName = computed(() => this.authStore.currentUser()?.name);

  logout(): void {
    this.authService.logout();
  }
}
