import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { NetworkContact, NetworkContactsService } from '../../../../shared/services/network-contacts.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatProgressSpinnerModule, MatSpinner } from '@angular/material/progress-spinner';
import { MatListModule, MatNavList } from '@angular/material/list';

@Component({
  selector: 'app-network-list',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    MatProgressSpinnerModule,
    MatListModule
  ],
  templateUrl: './network-list.component.html',
  styleUrls: ['./network-list.component.scss']
})
export class NetworkListComponent {
  private networkContactsService = inject(NetworkContactsService);
  public contacts = toSignal(this.networkContactsService.getContacts());
}
