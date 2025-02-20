import { Injectable, computed, effect, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent, merge } from 'rxjs';
import { map } from 'rxjs/operators';

interface AppState {
  isOnline: boolean;
}

const initialState: AppState = {
  isOnline: navigator.onLine
};

export const AppStore = signalStore(
  { providedIn: 'root' },
  withState<AppState>(initialState),
  withComputed((store) => ({
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
      setOnlineStatus(isOnline: boolean) {
        patchState(store, { isOnline });
      }
    };
  })
);
