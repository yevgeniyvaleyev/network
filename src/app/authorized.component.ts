import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
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
