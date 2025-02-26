import { Injectable } from '@angular/core';
import { NetworkContact } from './network-contacts.service';


@Injectable({
  providedIn: 'root'
})
export class NetworkUtilsService {

  public sortByOverdueValue(a: NetworkContact, b: NetworkContact): number {
    return this.daysElapsed(b) - this.daysElapsed(a);
  }

  public sortPlannedReconnectValue(a: NetworkContact, b: NetworkContact): number {
    return (a?.plannedReconnectionDate?.valueOf() ?? 0) - (b?.plannedReconnectionDate?.valueOf() ?? 0);
  }

  public sortConnectedValue(a: NetworkContact, b: NetworkContact): number {
    return this.daysElapsed(b) - this.daysElapsed(a);
  }

  public isMeetingTodayOrPassed(contact: NetworkContact): boolean {
    return !!contact.plannedReconnectionDate && contact.plannedReconnectionDate.valueOf() <= new Date().valueOf();
  }

  public getReconnectContacts(allContacts: NetworkContact[]): NetworkContact[] {
    return allContacts.filter(contact => {
      const daysElapsed = this.daysElapsed(contact);
      return daysElapsed >= contact.reconnectionFrequency;
    });
  }

  public getConnectedContacts(allContacts: NetworkContact[]): NetworkContact[] {
    return allContacts.filter(contact => {
      const daysElapsed = this.daysElapsed(contact);
      return daysElapsed < contact.reconnectionFrequency;
    });
  }

  private daysElapsed(contact: NetworkContact) {
    const lastConnect = contact.lastConnect;
    const daysElapsed = Math.floor((new Date().getTime() - lastConnect.getTime()) / (1000 * 60 * 60 * 24));
    return daysElapsed;
  }
}
