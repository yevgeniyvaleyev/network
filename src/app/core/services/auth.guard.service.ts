import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthStore } from '../../store/auth.store';
import { effect } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService {
  private authStore = inject(AuthStore);
  private router = inject(Router);


  public async canActivate(): Promise<boolean> {
    await this.authStore.loadCurrentUser();

    if (!this.authStore.isAuthenticated()) {
      this.router.navigate(['/login']);
    } else if (!this.authStore.hasAccess() && this.authStore.isAuthenticated()) {
      this.router.navigate(['/pending-access']);
    }

    return this.authStore.hasAccess();
  }
}
