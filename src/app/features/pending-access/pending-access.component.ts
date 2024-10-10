import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { map } from 'rxjs';
import { NoAccessScreenComponent } from '../../core/layout/no-access-screen/no-access-screen.component';
import { AuthService } from '../../core/services/auth.service';

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
  private authService = inject(AuthService);

  public userName = toSignal(
    this.authService.getCurrentUser().pipe(map((data) => data.name)),
  );

  logout(): void {
    this.authService.navigateToLogout();
  }
}
