import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListItem, MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';
import { NetworkItemsService } from '../../../../shared/services/network-items.service';
import { NETWORK_LIST_ROUTES } from '../../network.routes';

@Component({
  selector: 'app-network-list',
  standalone: true,
  imports: [
    CommonModule, 
    MatListModule, 
    MatListItem, 
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    RouterModule
  ],
  templateUrl: './network-list.component.html',
  styleUrls: ['./network-list.component.scss'],
  providers: [
    { provide: 'routes', useValue: NETWORK_LIST_ROUTES }
  ]
})
export class NetworkListComponent {
  private networkItemsService = inject(NetworkItemsService);
  public items = toSignal(this.networkItemsService.getItems());
}
