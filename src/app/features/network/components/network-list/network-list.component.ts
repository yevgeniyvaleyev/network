import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';
import { AppStore } from 'app/core/store/app.store';
import { NetworkStore } from 'app/store/network.store';
import { AppMainLayoutComponent } from 'core/layout/app-main-layout/app-main-layout.component';
import { ReconnectionStatusComponent } from 'shared/components/reconnection-status/reconnection-status.component';
import { FilterComponent } from 'shared/components/filter/filter.component';

@Component({
  selector: 'app-network-list',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    MatListModule,
    MatCardModule,
    MatProgressSpinnerModule,
    AppMainLayoutComponent,
    ReconnectionStatusComponent,
    FilterComponent
  ],
  templateUrl: './network-list.component.html',
  styleUrls: ['./network-list.component.scss']
})
export class NetworkListComponent {
  private networkStore = inject(NetworkStore);
  private appStore = inject(AppStore);

  public contacts = this.networkStore.contacts;
  public loading = this.networkStore.loading;
  public isOnline = this.appStore.isOnline;

  private searchTerm = signal('');

  constructor() {
    console.log('---||', this.networkStore.getContact('stepansuvorov')?.lastConnect);
  }

  public filteredContacts = computed(() => {
    const contacts = this.contacts();
    const term = this.searchTerm().toLowerCase();

    if (!term) return contacts;

    return contacts?.filter(contact =>
      contact.name.toLowerCase().includes(term) ||
      contact.jobTitle?.toLowerCase().includes(term) ||
      contact.workedAt?.toLowerCase().includes(term)
    );
  });

  onSearch(term: string) {
    this.searchTerm.set(term);
  }
}
