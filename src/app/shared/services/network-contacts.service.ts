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
  plannedReconnectionDate?: Date | null;
  plannedReconnectionTime?: string | null;
  isInviteSent: boolean;
  planningStatus?: 'planned' | 'processing' | 'invited' | null;
  notes?: string;
}

export interface ResponseNetworkContact extends Omit<NetworkContact, 'lastConnect' | 'plannedReconnectionDate'> {
  lastConnect: string;
  plannedReconnectionDate?: string;
}

@Injectable({
  providedIn: 'root'
})
export class NetworkContactsService {
  private http = inject(HttpClient);
  private contactsUrl = '/api/items';
  private contactUrl = '/api/item';

  public getContacts(): Observable<ResponseNetworkContact[]> {
    return this.http.get<ResponseNetworkContact[]>(this.contactsUrl);
  }

  public getContactById(id: string): Observable<ResponseNetworkContact> {
    return this.http.get<ResponseNetworkContact>(`${this.contactUrl}/${id}`);
  }

  public createContact(contact: NetworkContact): Observable<ResponseNetworkContact> {
    return this.http.post<ResponseNetworkContact>(this.contactUrl, contact);
  }

  public updateContact(id: string, contact: Partial<NetworkContact>): Observable<ResponseNetworkContact> {
    return this.http.put<ResponseNetworkContact>(`${this.contactUrl}/${id}`, contact);
  }

  public deleteContact(id: string): Observable<any> {
    return this.http.delete(`${this.contactUrl}/${id}`);
  }
}
