import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NetworkListComponent } from './features/network-list/network-list.component';
import { PendingAccessComponent } from './core/layout/pending-access/pending-access.component';
import { MainComponent } from './core/components/main/main.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MainComponent, NetworkListComponent, PendingAccessComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'my-network-app';
}
