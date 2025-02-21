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
  private allReconnectContacts = computed(() => {
    const allContacts = this.networkStore.contacts();
    return this.getReconnectContacts(allContacts);
  });

  readonly plannedReconnectContacts = computed(() => {
    return this.allReconnectContacts().filter(contact => contact.plannedReconnectionDate);
  });

  readonly plannedToReconnectToday = computed(() => {
    return this.plannedReconnectContacts().filter(contact => contact.plannedReconnectionDate!.valueOf() === new Date().valueOf());
  });

  readonly approacedReconnectContacts = computed(() => {
    return this.allReconnectContacts().filter(contact => contact.isApproached);
  });

  readonly reconnectContacts = computed(() => {
    return this.allReconnectContacts().filter(contact => !contact.isApproached && !contact.plannedReconnectionDate);
  });

  private getReconnectContacts(allContacts: NetworkContact[]): NetworkContact[] {
    return allContacts.filter(contact => {
      const daysElapsed = this.daysElapsed(contact);
      return daysElapsed >= contact.reconnectionFrequency;
    });
  }

  private daysElapsed(contact: NetworkContact) {
    const lastConnect = new Date(contact.lastConnect);
    const daysElapsed = Math.floor((new Date().getTime() - lastConnect.getTime()) / (1000 * 60 * 60 * 24));
    return daysElapsed;
  }
}
