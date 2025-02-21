import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';
import { NetworkContact } from 'app/shared/services/network-contacts.service';
import { ReconnectionStatusComponent } from 'shared/components/reconnection-status/reconnection-status.component';

@Component({
  selector: 'app-contacts-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    ReconnectionStatusComponent,
    MatProgressSpinnerModule,
    MatProgressBarModule
  ],
  templateUrl: './contacts-list.component.html',
  styleUrls: ['./contacts-list.component.scss']
})
export class ContactsListComponent {
  title = input<string>('');
  contacts = input.required<NetworkContact[]>();
  isLoading = input(false);
}
