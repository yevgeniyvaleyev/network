import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { NetworkItem, NetworkItemsService } from '../../../../shared/services/network-items.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatSpinner } from '@angular/material/progress-spinner';
import { MatNavList } from '@angular/material/list';

@Component({
  selector: 'app-network-list',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    MatSpinner,
    MatNavList
  ],
  templateUrl: './network-list.component.html',
  styleUrls: ['./network-list.component.scss']
})
export class NetworkListComponent {
  private networkItemsService = inject(NetworkItemsService);
  public networkItems = toSignal(this.networkItemsService.getItems())
}
