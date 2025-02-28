import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactsListComponent } from 'shared/components/contacts-list/contacts-list.component';
import { AppMainLayoutComponent } from 'core/layout/app-main-layout/app-main-layout.component';
import { NetworkStore } from 'app/store/network.store';
import { NetworkContact } from 'app/shared/services/network-contacts.service';
import { NetworkUtilsService } from 'app/shared/services/network.utils.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ContactsListComponent, AppMainLayoutComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  private networkStore = inject(NetworkStore);
  private networkUtils = inject(NetworkUtilsService);

  readonly loading = this.networkStore.loading;
  readonly contactsMeetingToday = this.networkStore.getContactsMeetingToday();
  readonly contactsWithRequestedMeeting = this.networkStore.getContactsWithRequestedMeeting();

  readonly connectedContacts = computed(() => {
    return this.networkStore.connectedContacts();
  });

  readonly plannedReconnectContacts = computed(() => {
    return this.networkStore.contacts().filter(contact => !contact.isInviteSent && contact.plannedReconnectionDate && !this.networkUtils.isMeetingTodayOrPassed(contact)).sort((a, b) => this.networkUtils.sortPlannedReconnectValue(a, b));
  });

  readonly reconnectContacts = computed(() => {
    return this.networkStore.contactsToReconnect().filter(contact => !contact.isInviteSent && !contact.plannedReconnectionDate && !this.networkUtils.isMeetingTodayOrPassed(contact)).sort((a, b) => this.networkUtils.sortByOverdueValue(a, b));
  });
}
