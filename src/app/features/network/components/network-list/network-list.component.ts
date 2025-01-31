import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';
import { AppLayoutTab } from '../../../../core/layout/app-layout/app-layout.types';
import { AppMainLayoutComponent } from '../../../../core/layout/app-main-layout/app-main-layout.component';
import { NetworkContactsService } from '../../../../shared/services/network-contacts.service';

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
    AppMainLayoutComponent
  ],
  templateUrl: './network-list.component.html',
  styleUrls: ['./network-list.component.scss']
})
export class NetworkListComponent {
  private networkContactsService = inject(NetworkContactsService);
  public contacts = toSignal(this.networkContactsService.getContacts());


}
