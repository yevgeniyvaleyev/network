import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { PwaUpdateService } from 'core/services/pwa-update.service';
import { NetworkStore } from './store/network.store';

@Component({
  selector: 'app-authorized',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet
  ],
  template: '<router-outlet />'
})
export class AuthorizedComponent {
  private networkStore = inject(NetworkStore);

  constructor() {
    this.networkStore.loadContacts();
  }
}
