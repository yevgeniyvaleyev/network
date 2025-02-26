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
    const plannedReconnectionDate = this.contact()?.plannedReconnectionDate;
    const plannedReconnectionTime = this.contact()?.plannedReconnectionTime;
    lastConnect.setDate(lastConnect.getDate() + this.contact()!.reconnectionFrequency);

    const daysToNextConnect = Math.ceil((lastConnect.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    let statusString = '';

    if (plannedReconnectionDate) {
      const dayOfTheWeekName = plannedReconnectionDate.toLocaleDateString('en-US', { weekday: 'long' });
      const nameOfTheMonth = plannedReconnectionDate.toLocaleDateString('en-US', { month: 'short' });
      statusString = `Meeting: ${nameOfTheMonth} ${plannedReconnectionDate.getDate()}, ${dayOfTheWeekName}`;
      statusString = plannedReconnectionTime ? `${statusString} at ${plannedReconnectionTime}` : statusString;
      return statusString;
    }

    if (daysToNextConnect < 0) {
      statusString += `overdue ${Math.abs(daysToNextConnect)} days`;
    } else if (daysToNextConnect === 0) {
      statusString += `reconnect today`;
    } else {
      statusString += `${daysToNextConnect} days until next`;
    }

    return statusString;
  });
}
