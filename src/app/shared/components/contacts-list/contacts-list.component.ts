import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';
import { NetworkContact } from 'app/shared/services/network-contacts.service';
import { ReconnectionStatusComponent } from 'shared/components/reconnection-status/reconnection-status.component';
import { DataContainerComponent } from '../data-container/data-container.component';

@Component({
  selector: 'app-contacts-list',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatListModule,
    RouterModule,
    ReconnectionStatusComponent,
    DataContainerComponent

  ],
  templateUrl: './contacts-list.component.html',
  styleUrls: ['./contacts-list.component.scss']
})
export class ContactsListComponent {
  title = input<string>('');
  contacts = input.required<NetworkContact[]>();
  isLoading = input(false);
  icon = input('');
  isExpanded = input<boolean>(false);
}
