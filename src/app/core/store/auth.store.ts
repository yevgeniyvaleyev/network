import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { firstValueFrom } from 'rxjs';

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
    currentUser: computed(() => store.currentUser()),
  })),
  withMethods((store) => {
    const authService = inject(AuthService);

    return {
      async loadUser() {
        try {
          patchState(store, { loading: true, error: null });
          const user = await firstValueFrom(authService.getCurrentUser());
          console.log(user);
          patchState(store, { currentUser: user, loading: false });
        } catch (error) {
          patchState(store, {
            error: 'Failed to load user data',
            loading: false,
          });
        }
      },
    };
  },
  )
);
