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
  private readonly baseUrl = window.location.origin;

  public getCurrentUser(): Observable<CurrentUser> {
    return this.http.get<CurrentUser>(this.currentUser);
  }

  public logout(): void {
    const logoutUrl = new URL('/.auth/logout', this.baseUrl);
    window.location.href = logoutUrl.toString();
  }

  public login(): void {
    const loginUrl = new URL('/.auth/login/github', this.baseUrl);
    window.location.href = loginUrl.toString();
  }
}
