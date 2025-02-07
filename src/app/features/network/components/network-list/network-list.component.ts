import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';
import { NetworkStore } from 'app/store/network.store';
import { AppMainLayoutComponent } from 'core/layout/app-main-layout/app-main-layout.component';
import { ReconnectionStatusComponent } from 'shared/components/reconnection-status/reconnection-status.component';

@Component({
  selector: 'app-network-list',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    MatProgressSpinnerModule,
    MatListModule,
    AppMainLayoutComponent,
    ReconnectionStatusComponent
  ],
  templateUrl: './network-list.component.html',
  styleUrls: ['./network-list.component.scss']
})
export class NetworkListComponent {
  private networkStore = inject(NetworkStore);

  public contacts = this.networkStore.contacts;
  public loading = this.networkStore.loading;
}
