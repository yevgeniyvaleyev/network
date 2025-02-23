import { Component, Input, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NetworkContact } from '../../services/network-contacts.service';

@Component({
  selector: 'app-reconnection-status',
  standalone: true,
  imports: [CommonModule],
  template: `{{ statusText() }}`
})
export class ReconnectionStatusComponent {
  private contact = signal<NetworkContact | undefined>(undefined);

  @Input({ required: true }) set networkContact(value: NetworkContact) {
    this.contact.set(value);
  }

  statusText = computed(() => {
    if (!this.contact()) return '';

    const now = new Date();
    const lastConnect = this.contact()!.lastConnect;
    lastConnect.setDate(lastConnect.getDate() + this.contact()!.reconnectionFrequency);

    const daysToNextConnect = Math.ceil((lastConnect.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (daysToNextConnect < 0) {
      return `Last: ${lastConnect.toLocaleDateString()}, overdue ${Math.abs(daysToNextConnect)} days | ${daysToNextConnect}`;
    } else if (daysToNextConnect === 0) {
      return `Last: ${lastConnect.toLocaleDateString()}, reconnect today | ${daysToNextConnect}`;
    } else {
      return `Last: ${lastConnect.toLocaleDateString()}, ${daysToNextConnect} days until next | ${daysToNextConnect}`;
    }
  });
}
