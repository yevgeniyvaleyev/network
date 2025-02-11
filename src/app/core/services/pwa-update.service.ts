import { inject, Injectable } from '@angular/core';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { BehaviorSubject, filter } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class PwaUpdateService {
  private swUpdate = inject(SwUpdate);
  private snackBar = inject(MatSnackBar);
  private updateAvailable = new BehaviorSubject<boolean>(false);

  readonly updateAvailable$ = this.updateAvailable.asObservable();

  constructor() {
    this.initializeUpdateChecks();
  }

  private initializeUpdateChecks(): void {
    if (!this.swUpdate.isEnabled) {
      console.warn('Service Worker is not enabled');
      return;
    }

    // Check for updates every 6 hours
    setInterval(() => {
      this.checkForUpdate();
    }, 6 * 60 * 60 * 1000);

    // Initial check
    this.checkForUpdate();

    // Subscribe to version updates
    this.swUpdate.versionUpdates
      .pipe(
        filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY')
      )
      .subscribe(() => {
        this.updateAvailable.next(true);
        this.showUpdateSnackbar();
      });
  }

  public checkForUpdate(): void {
    if (!this.swUpdate.isEnabled) {
      console.warn('Service Worker is not enabled');
      return;
    }

    this.swUpdate.checkForUpdate()
      .then(() => {
        console.log('Checking for updates...');
      })
      .catch(err => {
        console.error('Error checking for updates:', err);
      });
  }

  public async clearCache(): Promise<void> {
    try {
      // Check if service worker API is available
      if (!('serviceWorker' in navigator)) {
        this.showSnackbar('Service Worker is not supported in this browser', 'Close');
        return;
      }

      // Clear all caches
      if ('caches' in window) {
        const cacheKeys = await caches.keys();
        await Promise.all(
          cacheKeys.map(key => caches.delete(key))
        );
      }

      // Unregister service worker
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(
        registrations.map(registration => registration.unregister())
      );

      this.updateAvailable.next(false);
      this.showSnackbar('New version is ready', 'Refresh');
    } catch (error) {
      console.error('Error clearing cache:', error);
      this.showSnackbar('Failed to clear cache', 'Close');
    }
  }

  private showUpdateSnackbar(): void {
    this.showSnackbar('A new version is available', 'Update now');
  }

  private showSnackbar(message: string, action: string, duration: number = 5000): void {
    const snackBar = this.snackBar.open(
      message,
      action,
      {
        duration,
        horizontalPosition: 'center',
        verticalPosition: 'bottom'
      }
    );

    if (action === 'Update now' || action === 'Refresh') {
      snackBar.onAction().subscribe(() => {
        window.location.reload();
      });
    }
  }
}
