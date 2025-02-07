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

  public logout(): void {
    window.location.href = '/.auth/logout';
  }

  public login(): void {
    window.location.href = '/.auth/login/github';
  }
}
