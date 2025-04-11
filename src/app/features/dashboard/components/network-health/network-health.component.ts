import { CommonModule } from '@angular/common';
import { Component, computed, input, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { DataContainerComponent } from 'app/shared/components/data-container/data-container.component';
import { NetworkContact } from 'app/shared/services/network-contacts.service';
import { NetworkHealthMapComponent } from '../network-health-map/network-health-map.component';
import { PieChartComponent } from 'app/shared/components/pie-chart/pie-chart.component';

@Component({
  selector: 'app-network-health',
  standalone: true,
  imports: [
    CommonModule,
    DataContainerComponent,
    NetworkHealthMapComponent,
    PieChartComponent
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

  readonly connectedPercentage = computed(() => {
    return Math.round(this.connectedContactsCount() / this.contactsTotalCount() * 100);
  });
  readonly reconnectPercentage = computed(() => {
    return Math.round(this.reconnectContactsCount() / this.contactsTotalCount() * 100);
  });
  readonly processingPercentage = computed(() => {
    return Math.round(this.processingContactsCount() / this.contactsTotalCount() * 100);
  });
  readonly invitedPercentage = computed(() => {
    return Math.round(this.invitedContactsCount() / this.contactsTotalCount() * 100);
  });
  readonly plannedPercentage = computed(() => {
    return Math.round(this.plannedReconnectContactsCount() / this.contactsTotalCount() * 100);
  });
  protected readonly chartItems = computed(() => {
    return [
      { percentage: this.connectedPercentage(), class: 'connected' },
      { percentage: this.reconnectPercentage(), class: 'reconnect' },
      { percentage: this.processingPercentage(), class: 'processing' },
      { percentage: this.invitedPercentage(), class: 'invited' },
      { percentage: this.plannedPercentage(), class: 'planned' }
    ];
  });

  title = signal('Network Health');
  data = signal<NetworkContact[]>([]);
}
