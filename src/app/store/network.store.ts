import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { computed, inject } from '@angular/core';
import { NetworkContact, NetworkContactsService } from 'shared/services/network-contacts.service';
import { firstValueFrom } from 'rxjs';

interface NetworkState {
  contacts: NetworkContact[];
  selectedContact: NetworkContact | null;
  loading: boolean;
  error: string | null;
}

const initialState: NetworkState = {
  contacts: [],
  selectedContact: null,
  loading: false,
  error: null,
};

export const NetworkStore = signalStore(
  { providedIn: 'root' },
  withState<NetworkState>(initialState),
  withComputed((store) => ({
    contacts: computed(() => store.contacts()),
    selectedContact: computed(() => store.selectedContact()),
    hasContacts: computed(() => store.contacts().length > 0),
    loading: computed(() => store.loading()),
    error: computed(() => store.error()),
  })),
  withMethods((store) => {
    const networkService = inject(NetworkContactsService);

    return {
      async loadContacts() {
        try {
          patchState(store, { loading: true, error: null });
          const contacts = await firstValueFrom(networkService.getContacts());
          patchState(store, { contacts, loading: false });
        } catch (error) {
          patchState(store, {
            error: 'Failed to load contacts',
            loading: false,
          });
        }
      },

      async getContact(id: string) {
        return store.contacts().find(c => c.id === id);
      },

      async createContact(contact: NetworkContact) {
        try {
          patchState(store, { loading: true, error: null });
          const newContact = await firstValueFrom(networkService.createContact(contact));
          const currentContacts = store.contacts();
          patchState(store, {
            contacts: [...currentContacts, newContact],
            loading: false,
          });
          return newContact;
        } catch (error) {
          patchState(store, {
            error: 'Failed to create contact',
            loading: false,
          });
          throw error;
        }
      },

      async updateContact(id: string, contact: Partial<NetworkContact>) {
        try {
          patchState(store, { loading: true, error: null });
          const updatedContact = await firstValueFrom(networkService.updateContact(id, contact));
          const currentContacts = store.contacts();
          patchState(store, {
            contacts: currentContacts.map(c => c.id === id ? updatedContact : c),
            selectedContact: updatedContact,
            loading: false,
          });
          return updatedContact;
        } catch (error) {
          patchState(store, {
            error: 'Failed to update contact',
            loading: false,
          });
          throw error;
        }
      },

      async deleteContact(id: string) {
        try {
          patchState(store, { loading: true, error: null });
          await firstValueFrom(networkService.deleteContact(id));
          const currentContacts = store.contacts();
          patchState(store, {
            contacts: currentContacts.filter(c => c.id !== id),
            selectedContact: store.selectedContact()?.id === id ? null : store.selectedContact(),
            loading: false,
          });
        } catch (error) {
          patchState(store, {
            error: 'Failed to delete contact',
            loading: false,
          });
          throw error;
        }
      },

      clearSelectedContact() {
        patchState(store, { selectedContact: null });
      },

      clearError() {
        patchState(store, { error: null });
      }
    };
  })
);
