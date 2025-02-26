import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { computed, inject, Signal } from '@angular/core';
import { NetworkContact, NetworkContactsService, ResponseNetworkContact } from 'shared/services/network-contacts.service';
import { firstValueFrom } from 'rxjs';
import { AppStore } from 'app/core/store/app.store';
import { NetworkUtilsService } from 'app/shared/services/network.utils.service';

interface NetworkState {
  contacts: NetworkContact[];
  loading: boolean;
  error: string | null;
}

const initialState: NetworkState = {
  contacts: [],
  loading: false,
  error: null,
};

const normalizeContact = (contact: ResponseNetworkContact): NetworkContact => ({
  ...contact,
  lastConnect: new Date(Date.parse(contact.lastConnect)),
  plannedReconnectionDate: contact.plannedReconnectionDate ? new Date(Date.parse(contact.plannedReconnectionDate)) : undefined,
})

const STORAGE_KEY = 'network_contacts';

export const NetworkStore = signalStore(
  { providedIn: 'root' },
  withState<NetworkState>(initialState),
  withComputed((store) => {
    const networkUtils = inject(NetworkUtilsService);
    return {
      contactsToReconnect: computed(() => networkUtils.getReconnectContacts(store.contacts())),
      connectedContacts: computed(() => networkUtils.getConnectedContacts(store.contacts())),
      hasContacts: computed(() => store.contacts().length > 0),
      loading: computed(() => store.loading()),
      error: computed(() => store.error()),
    }
  }),
  withMethods((store) => {
    const networkService = inject(NetworkContactsService);
    const networkUtils = inject(NetworkUtilsService);
    const appStore = inject(AppStore);

    return {
      async loadContacts() {
        const storedContacts = localStorage.getItem(STORAGE_KEY);
        if (storedContacts) {
          const contacts = JSON.parse(storedContacts);
          patchState(store, { contacts: contacts.map(normalizeContact) });

        }

        if (appStore.isOnline()) {
          patchState(store, { loading: true });
          appStore.setBackgroundSync(true);
        }

        try {
          const contacts = await firstValueFrom(networkService.getContacts());
          localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
          patchState(store, { contacts: contacts.map(normalizeContact), loading: false });
          appStore.setBackgroundSync(false);
        } catch (error) {
          patchState(store, {
            error: 'Failed to load contacts',
            loading: false,
          });
        }
      },

      getContact(id: string): NetworkContact | undefined {
        const f = store.contacts().find(c => c.id === id);
        console.log('--->', f?.lastConnect);
        return f;
      },

      async createContact(contact: NetworkContact) {
        try {
          patchState(store, { loading: true, error: null });
          const newContact = normalizeContact(await firstValueFrom(networkService.createContact(contact)));
          const contacts = [...store.contacts(), newContact];
          localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
          patchState(store, { contacts, loading: false });
          return newContact;
        } catch (error) {
          patchState(store, {
            error: 'Failed to create contact',
            loading: false,
          });
          return undefined;
        }
      },

      async updateContact(id: string, contact: NetworkContact): Promise<NetworkContact | undefined> {
        try {
          patchState(store, { loading: true, error: null });
          if (isSameDate(contact?.lastConnect, new Date())) {
            contact.isInviteSent = false;
            contact.plannedReconnectionDate = null;
            contact.plannedReconnectionTime = null;

          }
          if (contact.plannedReconnectionDate) {
            contact.isInviteSent = false;
          }
          console.log('---', contact);
          const updatedContact = normalizeContact(await firstValueFrom(networkService.updateContact(id, contact)));
          console.log('---', updatedContact);
          const contacts = store.contacts().map(c =>
            c.id === id ? { ...c, ...updatedContact } : c
          );
          localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
          patchState(store, { contacts, loading: false });
          return updatedContact;
        } catch (error) {
          patchState(store, {
            error: 'Failed to update contact',
            loading: false,
          });
          return undefined;
        }
      },

      async deleteContact(id: string) {
        try {
          patchState(store, { loading: true, error: null });
          await firstValueFrom(networkService.deleteContact(id));
          const contacts = store.contacts().filter(c => c.id !== id);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
          patchState(store, { contacts, loading: false });
        } catch (error) {
          patchState(store, {
            error: 'Failed to delete contact',
            loading: false,
          });
        }
      },

      getContactsMeetingToday(): Signal<NetworkContact[]> {
        return computed(() => store.contactsToReconnect().filter((contact) => networkUtils.isMeetingTodayOrPassed(contact)));
      },

      getContactsWithRequestedMeeting() {
        return computed(() => store.contactsToReconnect().filter((contact) => contact.isInviteSent));
      },

      clearError() {
        patchState(store, { error: null });
      }
    };
  })
);

function isSameDate(date1: Date, date2: Date): boolean {
  return date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear();
}



