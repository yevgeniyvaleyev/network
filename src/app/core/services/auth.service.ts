import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

export interface CurrentUser {
  hasAccess: boolean;
  authenticated: boolean;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private currentUser = '/api/current-user';

  public getCurrentUser(): Observable<CurrentUser> {
    return this.http.get<CurrentUser>(this.currentUser);
  }

  public hasAccess(): Observable<boolean> {
    return this.getCurrentUser().pipe(map((user) => !!user.hasAccess));
  }

  public navigateToLogout(): void {
    window.location.href = '/.auth/logout';
  }

  public navigateToLogin(): void {
    window.location.href = '/.auth/login/github';
  }
}
