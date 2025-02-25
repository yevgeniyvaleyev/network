import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

export interface NetworkContact {
  id: string;
  name: string;
  phoneNumber?: string;
  lastConnect: Date;
  jobTitle?: string;
  workedAt?: string;
  preferredCommunicationChannel?: string;
  communicationLanguage?: string;
  email?: string;
  reconnectionFrequency: number;
  plannedReconnectionDate?: Date;
  isInviteSent: boolean;
  notes?: string;
}

@Injectable({
  providedIn: 'root'
})
export class NetworkContactsService {
  private http = inject(HttpClient);
  private contactsUrl = '/api/items';
  private contactUrl = '/api/item';

  public getContacts(): Observable<NetworkContact[]> {
    return this.http.get<NetworkContact[]>(this.contactsUrl);
  }

  public getContactById(id: string): Observable<NetworkContact> {
    return this.http.get<NetworkContact>(`${this.contactUrl}/${id}`);
  }

  public createContact(contact: NetworkContact): Observable<NetworkContact> {
    return this.http.post<NetworkContact>(this.contactUrl, contact);
  }

  public updateContact(id: string, contact: Partial<NetworkContact>): Observable<NetworkContact> {
    return this.http.put<NetworkContact>(`${this.contactUrl}/${id}`, contact);
  }

  public deleteContact(id: string): Observable<any> {
    return this.http.delete(`${this.contactUrl}/${id}`);
  }
}
