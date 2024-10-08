import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NetworkListComponent } from './features/network-list/network-list.component';
import { PendingAccessComponent } from './features/pending-access/pending-access.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NetworkListComponent, PendingAccessComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'my-network-app';
}
