import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatListItem, MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NetworkItemsService } from '../../shared/services/network-items.service';

@Component({
  selector: 'app-network-list',
  standalone: true,
  imports: [CommonModule, MatListModule, MatListItem, MatProgressSpinnerModule],
  templateUrl: './network-list.component.html',
  styleUrls: ['./network-list.component.scss'],
})
export class NetworkListComponent {
  private networkItemsService = inject(NetworkItemsService);
  public items = toSignal(this.networkItemsService.getItems());
}
