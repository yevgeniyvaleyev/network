import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, map, tap } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService {
  private authService = inject(AuthService);
  private router = inject(Router);

  public canActivate(): Observable<boolean> {
    // TODO: change to signal store
    return this.authService.getCurrentUser().pipe(
      tap(({ authenticated, hasAccess }) => {
        if (!authenticated) this.authService.navigateToLogin();
        if (!hasAccess && authenticated)
          this.router.navigate(['/pending-access']);
      }),
      map(({ hasAccess }) => hasAccess),
    );
  }
}
