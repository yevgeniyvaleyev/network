import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NetworkItemsService {
  private http = inject(HttpClient);
  private itemsUrl = '/api/items';

  public getItems(): Observable<string[]> {
    return this.http.get(this.itemsUrl) as Observable<string[]>;
  }
}
