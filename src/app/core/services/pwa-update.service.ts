import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SwUpdate } from '@angular/service-worker';
import { BehaviorSubject, interval } from 'rxjs';

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

    // Check for updates every minute
    interval(60 * 1000)
      .subscribe(() => {
        console.log('Checking for updates...');
        this.checkForUpdate();
      });

    // Initial check
    this.checkForUpdate();

    // Subscribe to version updates
    this.swUpdate.versionUpdates
      .subscribe(event => {
        console.log('Version update event:', event);
        if (event.type === 'VERSION_DETECTED') {
          console.log('New version detected');
          this.updateAvailable.next(true);
        } else if (event.type === 'VERSION_READY') {
          console.log('New version ready');
          this.updateAvailable.next(true);
          this.showUpdateSnackbar();
        } else if (event.type === 'VERSION_INSTALLATION_FAILED') {
          console.error('Failed to install app version:', event.error);
          this.updateAvailable.next(false);
        }
      });

    // Handle unrecoverable state
    this.swUpdate.unrecoverable.subscribe(event => {
      console.error('SW unrecoverable state:', event.reason);
      this.showSnackbar('An error occurred. Please reload the app.', 'Reload');
    });
  }

  public checkForUpdate(): void {
    if (!this.swUpdate.isEnabled) {
      console.warn('Service Worker is not enabled');
      return;
    }

    this.swUpdate.checkForUpdate()
      .then(() => {
        console.log('Finished checking for updates');
      })
      .catch(err => {
        console.error('Error checking for updates:', err);
      });
  }

  public async activateUpdate(): Promise<void> {
    if (!this.swUpdate.isEnabled) return;

    try {
      await this.swUpdate.activateUpdate();
      this.showSnackbar('New version is ready', 'Refresh');
    } catch (err) {
      console.error('Error activating update:', err);
      this.showSnackbar('Error activating update', 'Close');
    }
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

    if (action === 'Update now' || action === 'Refresh' || action === 'Reload') {
      snackBar.onAction().subscribe(() => {
        window.location.reload();
      });
    }
  }
}
