import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';
import { ReconnectionStatusComponent } from 'shared/components/reconnection-status/reconnection-status.component';
import { NetworkStore } from 'app/store/network.store';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-reconnect-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    ReconnectionStatusComponent,
    MatProgressSpinnerModule,
  ],
  templateUrl: './reconnect-list.component.html',
  styleUrls: ['./reconnect-list.component.scss']
})
export class ReconnectListComponent {
  private networkStore = inject(NetworkStore);

  readonly loading = this.networkStore.loading;
  readonly reconnectContacts = computed(() => {
    const allContacts = this.networkStore.contacts();
    return allContacts.filter(contact => {
      const lastConnect = new Date(contact.lastConnect);
      const daysElapsed = Math.floor((new Date().getTime() - lastConnect.getTime()) / (1000 * 60 * 60 * 24));
      return daysElapsed >= contact.reconnectionFrequency;
    });
  });
}
