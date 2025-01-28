import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatListItem, MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-network-list',
  standalone: true,
  imports: [CommonModule, MatListModule, MatListItem, MatProgressSpinnerModule],
  templateUrl: './network-list.component.html',
  styleUrls: ['./network-list.component.scss'],
})
export class NetworkListComponent {
  private http = inject(HttpClient);
  private itemsUrl = '/api/items';

  public items = toSignal(this.getItems());

  private getItems(): Observable<string[]> {
    return this.http.get(this.itemsUrl) as Observable<string[]>;
  }
}
