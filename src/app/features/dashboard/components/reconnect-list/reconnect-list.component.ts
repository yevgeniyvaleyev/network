import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { NetworkContact, NetworkContactsService } from '../../../../shared/services/network-contacts.service';

interface ReconnectContact extends NetworkContact {
  daysOverdue: number;
}

@Component({
  selector: 'app-reconnect-list',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatListModule, MatIconModule, RouterModule],
  templateUrl: './reconnect-list.component.html',
  styleUrls: ['./reconnect-list.component.scss']
})
export class ReconnectListComponent implements OnInit {
  private networkContactsService = inject(NetworkContactsService);

  contacts: ReconnectContact[] = [];

  ngOnInit(): void {
    this.loadContacts();
  }

  private loadContacts(): void {
    this.networkContactsService.getContacts().subscribe(contacts => {
      const now = new Date();
      this.contacts = contacts
        .map(contact => {
          const lastConnect = new Date(contact.lastConnect);
          const nextConnect = new Date(lastConnect);
          nextConnect.setDate(nextConnect.getDate() + contact.reconnectionFrequency);

          const daysOverdue = Math.floor((now.getTime() - nextConnect.getTime()) / (1000 * 60 * 60 * 24));

          return {
            ...contact,
            daysOverdue
          };
        })
        .filter(contact => contact.daysOverdue >= 0)
        .sort((a, b) => b.daysOverdue - a.daysOverdue);
    });
  }

  getIcon(daysOverdue: number): string {
    return daysOverdue >= 7 ? 'warning' : 'person';
  }

  getIconColor(daysOverdue: number): string {
    return daysOverdue >= 7 ? 'warn' : 'primary';
  }
}
