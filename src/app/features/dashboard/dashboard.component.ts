import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactsListComponent } from 'shared/components/contacts-list/contacts-list.component';
import { AppMainLayoutComponent } from 'core/layout/app-main-layout/app-main-layout.component';
import { NetworkStore } from 'app/store/network.store';
import { NetworkContact } from 'app/shared/services/network-contacts.service';
import { NetworkUtilsService } from 'app/shared/services/network.utils.service';
import { NetworkHealthComponent } from './components/network-health/network-health.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ContactsListComponent, AppMainLayoutComponent, NetworkHealthComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  private networkStore = inject(NetworkStore);
  private networkUtils = inject(NetworkUtilsService);

  readonly loading = this.networkStore.loading;
  readonly contactsMeetingToday = this.networkStore.getContactsMeetingToday();
  readonly invitedContacts = this.networkStore.getInvitedContacts;
  readonly contactsTotalCount = computed(() => {
    return this.networkStore.contacts().length;
  });

  readonly connectedContacts = computed(() => {
    return this.networkStore.connectedContacts();
  });

  readonly plannedReconnectContacts = computed(() => {
    return this.networkStore.plannedReconnectContacts().filter(contact => !this.networkUtils.isMeetingTodayOrPassed(contact)).sort((a, b) => this.networkUtils.sortPlannedReconnectValue(a, b));
  });

  readonly processingContacts = computed(() => {
    return this.networkStore.processingContacts().filter(contact => !this.networkUtils.isMeetingTodayOrPassed(contact)).sort((a, b) => this.networkUtils.sortPlannedReconnectValue(a, b));
  });

  readonly reconnectContacts = computed(() => {
    return this.networkStore.contactsToReconnect().filter(contact => !this.isInviteSent(contact) && !this.processingContactsIds().includes(contact.id) && !contact.plannedReconnectionDate && !this.networkUtils.isMeetingTodayOrPassed(contact)).sort((a, b) => this.networkUtils.sortByOverdueValue(a, b));
  });

  private plannedReconnectContactsIds = computed(() => {
    return this.plannedReconnectContacts().map(contact => contact.id);
  });

  private processingContactsIds = computed(() => {
    return this.processingContacts().map(contact => contact.id);
  });

  private isInviteSent(contact: NetworkContact) {
    return contact.planningStatus === 'invited';
  }


}
