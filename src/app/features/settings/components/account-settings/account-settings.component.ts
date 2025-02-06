import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { AppLayoutComponent } from '../../../../core/layout/app-layout/app-layout.component';
import { AuthStore } from '../../../../store/auth.store';
import { computed } from '@angular/core';

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
  private router = inject(Router);

  readonly userName = computed(() => this.authStore.currentUser()?.name);

  logout(): void {
    this.authStore.navigateToLogout();
  }
}
