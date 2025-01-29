import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

export interface NetworkItem {
  id: string;
  name: string;
  phoneNumber: string;
  lastConnect: Date;
  jobTitle: string;
  workedAt: string;
  preferredCommunicationChannel: string;
  email: string;
  reconnectionFrequency: number;
}

@Injectable({
  providedIn: 'root'
})
export class NetworkItemsService {
  private http = inject(HttpClient);
  private itemsUrl = '/api/items';
  private itemUrl = '/api/item';

  public getItems(): Observable<NetworkItem[]> {
    return this.http.get<NetworkItem[]>(this.itemsUrl);
  }

  public getItemById(id: string): Observable<NetworkItem> {
    return this.http.get<NetworkItem>(`${this.itemUrl}/${id}`);
  }

  public createItem(item: NetworkItem): Observable<NetworkItem> {
    return this.http.post<NetworkItem>(this.itemUrl, item);
  }

  public updateItem(id: string, item: Partial<NetworkItem>): Observable<NetworkItem> {
    return this.http.put<NetworkItem>(`${this.itemUrl}/${id}`, item);
  }
}
