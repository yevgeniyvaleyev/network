import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-network-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './network-list.component.html',
  styleUrl: './network-list.component.scss',
})
export class NetworkListComponent {
  private http = inject(HttpClient);
  private itemsUrl = '/api/items';

  public items = toSignal(this.http.get(this.itemsUrl));
}
