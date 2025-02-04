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
    const lastConnect = new Date(this.contact()!.lastConnect);
    const nextConnect = new Date(lastConnect);
    nextConnect.setDate(nextConnect.getDate() + this.contact()!.reconnectionFrequency);

    const daysToNextConnect = Math.ceil((nextConnect.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (daysToNextConnect < 0) {
      return `Last connect: ${lastConnect.toLocaleDateString()}, overdue ${Math.abs(daysToNextConnect)} days`;
    } else if (daysToNextConnect === 0) {
      return `Last connect: ${lastConnect.toLocaleDateString()}, reconnect today`;
    } else {
      return `Last connect: ${lastConnect.toLocaleDateString()}, ${daysToNextConnect} days until next`;
    }
  });
}
