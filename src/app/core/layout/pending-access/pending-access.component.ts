import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { NoAccessScreenComponent } from '../no-access-screen/no-access-screen.component';
import { AuthStore } from '../../../store/auth.store';
import { computed } from '@angular/core';

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
  styleUrl: './pending-access.component.scss',
})
export class PendingAccessComponent {
  private authStore = inject(AuthStore);

  readonly userName = computed(() => this.authStore.currentUser()?.name);

  logout(): void {
    this.authStore.navigateToLogout();
  }
}
