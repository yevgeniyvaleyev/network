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

@Component({
  selector: 'app-data-container',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatExpansionModule,
    MatIconModule,
    MatButtonModule,
    RouterModule,
    MatProgressSpinnerModule,
    MatProgressBarModule
  ],
  templateUrl: './data-container.component.html',
  styleUrls: ['./data-container.component.scss']
})
export class DataContainerComponent {
  title = input<string>('');
  titleSuffix = input<string>('');
  isLoading = input(false);
  hasData = input(false);
  icon = input('');
  isExpanded = input<boolean>(false);
}
