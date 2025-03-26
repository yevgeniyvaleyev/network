import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { computed, inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';

interface NavigationState {
  paths: string[];
}

const ROOT_PATHS = ['/network/list', '/dashboard', '/settings'];

const initialState: NavigationState = {
  paths: []
};

export const NavigationStore = signalStore(
  { providedIn: 'root' },
  withState<NavigationState>(initialState),
  withComputed((store) => ({
    parentPath: computed(() => store.paths()[store.paths().length - 2] || ''),
    paths: computed(() => store.paths()),
  })),
  withMethods((store) => {
    const router = inject(Router);

    return {
      init() {
        router.events.pipe(
          filter((event): event is NavigationEnd => event instanceof NavigationEnd)
        ).subscribe((event) => {
          const path = event.urlAfterRedirects.split('?')[0];
          const segments = path.split('/').filter(Boolean);
          const rootPath = segments[0];
          const currentPaths = store.paths();

          if (ROOT_PATHS.includes(path)) {
            // Reset paths when hitting a root path
            patchState(store, { paths: [path] });
          } else {
            const existingIndex = currentPaths.indexOf(path);

            if (existingIndex !== -1) {
              // Drop everything after the existing path
              patchState(store, { paths: currentPaths.slice(0, existingIndex + 1) });
            } else {
              // Add new path to the history while keeping old ones
              patchState(store, { paths: [...currentPaths, path] });
            }
          }

          console.log('Navigation paths:', store.paths());
        });
      }
    };
  }),
  withHooks({
    onInit(store) {
      store.init();
    }
  })
);