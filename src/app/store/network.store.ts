import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { computed, inject } from '@angular/core';
import { NetworkContact, NetworkContactsService } from 'shared/services/network-contacts.service';
import { firstValueFrom } from 'rxjs';

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

const STORAGE_KEY = 'network_contacts';

export const NetworkStore = signalStore(
  { providedIn: 'root' },
  withState<NetworkState>(initialState),
  withComputed((store) => ({
    contacts: computed(() => store.contacts()),
    hasContacts: computed(() => store.contacts().length > 0),
    loading: computed(() => store.loading()),
    error: computed(() => store.error()),
  })),
  withMethods((store) => {
    const networkService = inject(NetworkContactsService);

    return {
      async loadContacts() {
        const storedContacts = localStorage.getItem(STORAGE_KEY);
        if (storedContacts) {
          const contacts = JSON.parse(storedContacts);
          patchState(store, { contacts, loading: true });
        }

        try {
          const contacts = await firstValueFrom(networkService.getContacts());
          localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
          patchState(store, { contacts, loading: false });
        } catch (error) {
          patchState(store, {
            error: 'Failed to load contacts',
            loading: false,
          });
        }
      },

      getContact(id: string): NetworkContact | undefined {
        return store.contacts().find(c => c.id === id);
      },

      async createContact(contact: NetworkContact) {
        try {
          patchState(store, { loading: true, error: null });
          const newContact = await firstValueFrom(networkService.createContact(contact));
          const contacts = [...store.contacts(), newContact];
          localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
          patchState(store, { contacts, loading: false });
          return newContact;
        } catch (error) {
          patchState(store, {
            error: 'Failed to create contact',
            loading: false,
          });
          return null;
        }
      },

      async updateContact(id: string, contact: Partial<NetworkContact>) {
        try {
          patchState(store, { loading: true, error: null });
          const updatedContact = await firstValueFrom(networkService.updateContact(id, contact));
          const contacts = store.contacts().map(c =>
            c.id === id ? { ...c, ...updatedContact } : c
          );
          localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
          patchState(store, { contacts, loading: false });
        } catch (error) {
          patchState(store, {
            error: 'Failed to update contact',
            loading: false,
          });
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

      clearError() {
        patchState(store, { error: null });
      }
    };
  })
);
