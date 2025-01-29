import { CommonModule, Location } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NetworkItem, NetworkItemsService } from '../../../../shared/services/network-items.service';

@Component({
  selector: 'app-network-details',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    RouterModule
  ],
  templateUrl: './network-details.component.html',
  styleUrls: ['./network-details.component.scss']
})
export class NetworkDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private networkItemsService = inject(NetworkItemsService);
  private router = inject(Router);

  public networkItem?: NetworkItem;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.networkItemsService.getItemById(id).subscribe({
        next: (item) => {
          this.networkItem = item;
        },
        error: (error) => {
          console.error('Error fetching network item:', error);
        }
      });
    }
  }

  public goBack(): void {
    this.router.navigate(['/network/list']);
  }
}
