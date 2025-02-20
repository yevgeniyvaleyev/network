import { Injectable, computed, effect, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent, merge } from 'rxjs';
import { map } from 'rxjs/operators';

interface AppState {
  isOnline: boolean;
  isBackgroundSync: boolean;
}

const initialState: AppState = {
  isOnline: navigator.onLine,
  isBackgroundSync: false
};

export const AppStore = signalStore(
  { providedIn: 'root' },
  withState<AppState>(initialState),
  withComputed((store) => ({
    isBackgroundSync: computed(() => store.isBackgroundSync()),
    isOnline: computed(() => store.isOnline()),
  })),
  withMethods((store) => {
    // Setup online/offline listeners
    merge(
      fromEvent(window, 'online').pipe(map(() => true)),
      fromEvent(window, 'offline').pipe(map(() => false))
    )
    .pipe(takeUntilDestroyed())
    .subscribe(isOnline => {
      patchState(store, { isOnline });
    });

    return {
      setBackgroundSync(isBackgroundSync: boolean) {
        patchState(store, { isBackgroundSync });
      }
    };
  })
);
