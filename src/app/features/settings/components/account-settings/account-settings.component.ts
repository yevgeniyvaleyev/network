import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { AppLayoutComponent } from '../../../../core/layout/app-layout/app-layout.component';
import { AuthService } from '../../../../core/services/auth.service';
import { map } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

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
  private authService = inject(AuthService);
  private router = inject(Router);

  public userName = toSignal(this.authService.getCurrentUser().pipe(map((user) => user.name)));

  logout(): void {
    this.authService.navigateToLogout();
  }
}
