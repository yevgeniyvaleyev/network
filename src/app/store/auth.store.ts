import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';

export interface CurrentUser {
  hasAccess: boolean;
  authenticated: boolean;
  name: string;
}

interface AuthState {
  currentUser: CurrentUser | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  currentUser: null,
  loading: false,
  error: null,
};

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState<AuthState>(initialState),
  withComputed((store) => ({
    isAuthenticated: computed(() => !!store.currentUser()?.authenticated),
    hasAccess: computed(() => !!store.currentUser()?.hasAccess),
  })),
  withMethods((store) => {
    const http = inject(HttpClient);
    return {
      async loadCurrentUser() {
        try {
          patchState(store, { loading: true, error: null });
          const user = await http.get<CurrentUser>('/api/current-user').toPromise();
          patchState(store, { currentUser: user, loading: false });
        } catch (error) {
          patchState(store, {
            error: 'Failed to load user data',
            loading: false,
          });
        }
      },

      navigateToLogout() {
        window.location.href = '/.auth/logout';
      },

      navigateToLogin() {
        window.location.href = '/.auth/login/github';
      },
    };
  })
);
