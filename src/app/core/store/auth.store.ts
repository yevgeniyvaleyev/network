import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

export interface CurrentUser {
  hasAccess: boolean;
  authenticated: boolean;
  name: string;
  languages: string[];
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

const STORAGE_KEY = 'auth_user';

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState<AuthState>(initialState),
  withComputed((store) => ({
    isAuthenticated: computed(() => !!store.currentUser()?.authenticated),
    hasAccess: computed(() => !!store.currentUser()?.hasAccess),
    currentUser: computed(() => store.currentUser()),
  })),
  withMethods((store, authService = inject(AuthService), router = inject(Router)) => ({
    async loadUser() {
      // First try to get user from local storage
      const storedUser = localStorage.getItem(STORAGE_KEY);
      if (storedUser) {
        const user = JSON.parse(storedUser);
        patchState(store, { currentUser: user, loading: false });
        return;
      }

      // If no stored user, load from server
      patchState(store, { loading: true });
      try {
        const user = await firstValueFrom(authService.getCurrentUser());
        // Store user in local storage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
        patchState(store, { currentUser: user, loading: false });
      } catch (error: any) {
        patchState(store, { error: error?.message, loading: false });
        this.handleAuthError(error);
      }
    },

    handleAuthError(error: any) {
      if (error.status === 401) {
        // Unauthorized - clear storage and redirect to login
        localStorage.removeItem(STORAGE_KEY);
        patchState(store, { currentUser: null });
        authService.login();
      } else if (error.status === 403) {
        // Forbidden - user is authenticated but doesn't have access
        router.navigate(['/pending']);
      }
    },

    logout() {
      localStorage.removeItem(STORAGE_KEY);
      patchState(store, { currentUser: null });
      authService.logout();
    }
  }))
);
