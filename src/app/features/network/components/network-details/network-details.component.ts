import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NetworkContact, NetworkContactsService } from '../../../../shared/services/network-contacts.service';
import { AppLayoutComponent } from '../../../../core/layout/app-layout/app-layout.component';
import { AppLayoutTab } from '../../../../core/layout/app-layout/app-layout.types';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-network-details',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    MatCardModule,
    AppLayoutComponent
  ],
  templateUrl: './network-details.component.html',
  styleUrls: ['./network-details.component.scss']
})
export class NetworkDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private networkContactsService = inject(NetworkContactsService);
  private router = inject(Router);
  private dialog = inject(MatDialog);

  public contact?: NetworkContact;

  public tabsConfig: AppLayoutTab[] = [
    {
      alias: 'reconnect',
      icon: 'check_circle'
    },
    {
      alias: 'delete',
      icon: 'delete'
    },
    {
      alias: 'edit',
      icon: 'edit'
    }
  ]

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.networkContactsService.getContactById(id).subscribe({
        next: (contact) => {
          this.contact = contact;
        },
        error: (error) => {
          console.error('Error fetching network contact:', error);
        }
      });
    }
  }

  public goBack(): void {
    this.router.navigate(['/network/list']);
  }

  public onTabClick(alias: string): void {
    if (alias === 'edit') {
      this.router.navigate(['/network/edit', this.contact?.id]);
    } else if (alias === 'delete') {
      this.openDeleteConfirmationDialog();
    } else if (alias === 'reconnect') {
      this.openReconnectConfirmationDialog();
    }
  }

  private openDeleteConfirmationDialog(): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Delete Contact',
        message: 'Are you sure you want to delete this contact?',
        okButtonText: 'Delete',
        cancelButtonText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.onDeleteConfirm();
      }
    });
  }

  private openReconnectConfirmationDialog(): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Mark as Reconnected',
        message: 'Do you want to mark this contact as reconnected today?',
        okButtonText: 'Yes',
        cancelButtonText: 'No'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.onReconnectConfirm();
      }
    });
  }

  private onReconnectConfirm(): void {
    if (this.contact) {
      const updatedContact: Partial<NetworkContact> = {
        ...this.contact,
        lastConnect: new Date()
      };

      console.log(1)
      this.networkContactsService.updateContact(this.contact!.id, updatedContact).subscribe(() => {
        console.log(2)
        // Refresh the contact data
        this.networkContactsService.getContactById(this.contact!.id).subscribe(contact => {
          this.contact = contact;
        });
      });
    }
  }

  private onDeleteConfirm(): void {
    if (this.contact) {
      this.networkContactsService.deleteContact(this.contact.id).subscribe(() => {
        this.router.navigate(['/network/list']);
      });
    }
  }
}
