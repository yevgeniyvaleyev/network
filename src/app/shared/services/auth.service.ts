import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private userInfoUrl = '/.auth/me';

  public getUserInfo(): Observable<any> {
    return this.http.get<any>(this.userInfoUrl);
  }
}
