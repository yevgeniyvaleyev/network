import { CommonModule } from '@angular/common';
import { Component, input, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { DataContainerComponent } from 'app/shared/components/data-container/data-container.component';
import { NetworkContact } from 'app/shared/services/network-contacts.service';

@Component({
  selector: 'app-network-health',
  standalone: true,
  imports: [
    CommonModule,
    DataContainerComponent

  ],
  templateUrl: './network-health.component.html',
  styleUrls: ['./network-health.component.scss']
})
export class NetworkHealthComponent {
  isLoading = input(false);
  icon = input('');
  isExpanded = input<boolean>(false);

  contactsTotalCount = input<number>(0);
  connectedContactsCount = input<number>(0);
  reconnectContactsCount = input<number>(0);
  processingContactsCount = input<number>(0);
  invitedContactsCount = input<number>(0);
  plannedReconnectContactsCount = input<number>(0);

  title = signal('Network Health');
  data = signal<NetworkContact[]>([]);
}
