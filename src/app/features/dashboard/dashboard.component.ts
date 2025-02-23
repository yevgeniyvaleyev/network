import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactsListComponent } from 'shared/components/contacts-list/contacts-list.component';
import { AppMainLayoutComponent } from 'core/layout/app-main-layout/app-main-layout.component';
import { NetworkStore } from 'app/store/network.store';
import { NetworkContact } from 'app/shared/services/network-contacts.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ContactsListComponent, AppMainLayoutComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  private networkStore = inject(NetworkStore);

  readonly loading = this.networkStore.loading;

  private sortedAllContacts = computed(() => {
    return this.networkStore.contacts().sort((a, b) => this.sortByOverdueValue(a, b));
  });

  private allReconnectContacts = computed(() => {
    return this.getReconnectContacts(this.sortedAllContacts());
  });

  readonly connectedContacts = computed(() => {
    return this.getConnectedContacts(this.sortedAllContacts());
  });

  readonly plannedReconnectContacts = computed(() => {
    return this.allReconnectContacts().filter(contact => !contact.isInviteSent && contact.plannedReconnectionDate && !this.isMeetingToday(contact));
  });

  readonly plannedToReconnectToday = computed(() => {
    return this.allReconnectContacts().filter(contact => this.isMeetingToday(contact));
  });

  readonly approacedReconnectContacts = computed(() => {
    return this.allReconnectContacts().filter(contact => contact.isInviteSent);
  });

  readonly reconnectContacts = computed(() => {
    return this.allReconnectContacts().filter(contact => !contact.isInviteSent && !contact.plannedReconnectionDate && !this.isMeetingToday(contact));
  });

  private sortByOverdueValue(a: NetworkContact, b: NetworkContact): number {
    return this.daysElapsed(b) - this.daysElapsed(a);
  }

  private isMeetingToday(contact: NetworkContact): boolean {
    return !!contact.plannedReconnectionDate && contact.plannedReconnectionDate.valueOf() <= new Date().valueOf();
  }

  private getReconnectContacts(allContacts: NetworkContact[]): NetworkContact[] {
    return allContacts.filter(contact => {
      const daysElapsed = this.daysElapsed(contact);
      return daysElapsed >= contact.reconnectionFrequency;
    });
  }

  private getConnectedContacts(allContacts: NetworkContact[]): NetworkContact[] {
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
