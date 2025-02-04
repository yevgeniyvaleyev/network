import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AppLayoutComponent } from '../../../../core/layout/app-layout/app-layout.component';
import { AppLayoutTab } from '../../../../core/layout/app-layout/app-layout.types';
import { ConfirmationDialogComponent } from '../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { NetworkContact, NetworkContactsService } from '../../../../shared/services/network-contacts.service';

@Component({
  selector: 'app-network-details',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    MatCardModule,
    AppLayoutComponent,
    MatProgressSpinnerModule
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

  public onCommunicationMethodClick(): void {
    if (!this.contact?.preferredCommunicationChannel) return;

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Open Communication App',
        message: `Do you want to open ${this.contact.preferredCommunicationChannel}?`,
        okButtonText: 'Open',
        cancelButtonText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && this.contact?.preferredCommunicationChannel) {
        window.open(this.getAppUrl(this.contact.preferredCommunicationChannel), '_blank');
      }
    });
  }

  public onPhoneClick(): void {
    if (!this.contact?.phoneNumber) return;

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Make a Call',
        message: `Do you want to call ${this.contact.name} at ${this.contact.phoneNumber}?`,
        okButtonText: 'Call',
        cancelButtonText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && this.contact?.phoneNumber) {
        window.open(`tel:${this.contact.phoneNumber}`, '_blank');
      }
    });
  }

  public onEmailClick(): void {
    if (!this.contact?.email) return;

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Send Email',
        message: `Do you want to send an email to ${this.contact.name} at ${this.contact.email}?`,
        okButtonText: 'Open Email',
        cancelButtonText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && this.contact?.email) {
        window.open(`mailto:${this.contact.email}`, '_blank');
      }
    });
  }

  private getAppUrl(app: string): string {
    const appUrls: { [key: string]: string } = {
      'Skype': 'skype:',
      'WhatsApp': 'https://wa.me/',
      'Telegram': 'tg://',
      'Slack': 'slack://',
      'Teams': 'msteams:/',
      'Zoom': 'zoommtg://'
    };

    return appUrls[app] || '';
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
