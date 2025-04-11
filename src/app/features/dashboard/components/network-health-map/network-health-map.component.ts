import { CommonModule } from '@angular/common';
import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-network-health-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './network-health-map.component.html',
  styleUrls: ['./network-health-map.component.scss']
})
export class NetworkHealthMapComponent {
  contactsTotalCount = input.required<number>();
  connectedContactsCount = input.required<number>();
  reconnectContactsCount = input.required<number>();
  processingContactsCount = input.required<number>();
  invitedContactsCount = input.required<number>();
  plannedReconnectContactsCount = input.required<number>();

  protected fillTypes = {
    connected: 1,
    reconnect: 2,
    processing: 3,
    invited: 4,
    planned: 5
  }

  protected readonly side = computed(() => {
    return Math.ceil(Math.sqrt(this.contactsTotalCount()));
  });

  private readonly filledCells = computed(() => {
    return [
      ...Array(this.connectedContactsCount()).fill(this.fillTypes.connected),
      ...Array(this.reconnectContactsCount()).fill(this.fillTypes.reconnect),
      ...Array(this.processingContactsCount()).fill(this.fillTypes.processing),
      ...Array(this.invitedContactsCount()).fill(this.fillTypes.invited),
      ...Array(this.plannedReconnectContactsCount()).fill(this.fillTypes.planned)
    ];
  });

  protected readonly cells = computed(() => {
    const sideLength = this.side();
    const totalSquareAmount = sideLength * sideLength;
    const rest = totalSquareAmount - this.filledCells().length;
    return [...this.filledCells(), ...Array(rest).fill(-1)];
  });
}
