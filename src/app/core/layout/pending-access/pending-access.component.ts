import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { NoAccessScreenComponent } from 'core/layout/no-access-screen/no-access-screen.component';
import { AuthStore } from 'core/store/auth.store';
import { computed } from '@angular/core';
import { AuthService } from 'core/services/auth.service';

@Component({
  selector: 'app-pending-access',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    NoAccessScreenComponent,
  ],
  templateUrl: './pending-access.component.html',
  styleUrls: ['./pending-access.component.scss'],
})
export class PendingAccessComponent {
  private authStore = inject(AuthStore);
  private authService = inject(AuthService);

  readonly userName = computed(() => this.authStore.currentUser()?.name);

  logout(): void {
    this.authService.logout();
  }
}
