import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../services/auth.service';

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
