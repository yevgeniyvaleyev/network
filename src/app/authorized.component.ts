import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NetworkStore } from './store/network.store';
import { NavigationStore } from './store/navigation.store';

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
  private navigationStore = inject(NavigationStore);

  constructor() {
    this.networkStore.loadContacts();
    this.navigationStore.init();
  }
}
