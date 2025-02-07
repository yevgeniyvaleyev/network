import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthStore } from 'core/store/auth.store';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService {
  private authStore = inject(AuthStore);
  private router = inject(Router);

  public async canActivate(): Promise<boolean> {
    if (!this.authStore.currentUser()) {
      await this.authStore.loadUser();
    }
    if (!this.authStore.isAuthenticated()) {
      this.router.navigate(['/login']);
    } else if (!this.authStore.hasAccess() && this.authStore.isAuthenticated()) {
      this.router.navigate(['/pending-access']);
    }

    return this.authStore.hasAccess();
  }
}
