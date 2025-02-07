import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AppLayoutComponent } from 'core/layout/app-layout/app-layout.component';
import { AppLayoutTab } from 'core/layout/app-layout/app-layout.types';
import { ConfirmationDialogComponent } from 'shared/components/confirmation-dialog/confirmation-dialog.component';
import { NetworkContact } from 'shared/services/network-contacts.service';
import { ReconnectionStatusComponent } from 'shared/components/reconnection-status/reconnection-status.component';
import { MatListModule } from '@angular/material/list';
import { NetworkStore } from 'app/store/network.store';

@Component({
  selector: 'app-network-details',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    MatCardModule,
    MatListModule,
    AppLayoutComponent,
    MatProgressSpinnerModule,
    ReconnectionStatusComponent,
    ConfirmationDialogComponent
  ],
  templateUrl: './network-details.component.html',
  styleUrls: ['./network-details.component.scss']
})
export class NetworkDetailsComponent {
  private route = inject(ActivatedRoute);
  private networkStore = inject(NetworkStore);
  private router = inject(Router);
  private dialog = inject(MatDialog);

  readonly loading = this.networkStore.loading;
  readonly error = signal<string | null>(null);
  readonly contact = computed(() => {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return null;
    return this.networkStore.contacts().find(c => c.id === id);
  });

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
  ];

  public onTabClick(alias: string): void {
    switch (alias) {
      case 'edit':
        this.router.navigate(['/network/edit', this.contact()?.id]);
        break;
      case 'delete':
        this.openDeleteConfirmationDialog();
        break;
      case 'reconnect':
        this.openReconnectConfirmationDialog();
        break;
    }
  }

  public onCommunicationMethodClick(): void {
    const contact = this.contact();
    if (!contact?.preferredCommunicationChannel) return;

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Open Communication App',
        message: `Do you want to open ${contact.preferredCommunicationChannel}?`,
        okButtonText: 'Open',
        cancelButtonText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && contact?.preferredCommunicationChannel) {
        window.open(this.getAppUrl(contact.preferredCommunicationChannel), '_blank');
      }
    });
  }

  public onPhoneClick(): void {
    const contact = this.contact();
    if (!contact?.phoneNumber) return;

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Make a Call',
        message: `Do you want to call ${contact.name} at ${contact.phoneNumber}?`,
        okButtonText: 'Call',
        cancelButtonText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && contact?.phoneNumber) {
        window.open(`tel:${contact.phoneNumber}`, '_blank');
      }
    });
  }

  public onEmailClick(): void {
    const contact = this.contact();
    if (!contact?.email) return;

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Send Email',
        message: `Do you want to send an email to ${contact.name} at ${contact.email}?`,
        okButtonText: 'Open Email',
        cancelButtonText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && contact?.email) {
        window.open(`mailto:${contact.email}`, '_blank');
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

    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        await this.onDeleteConfirm();
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

    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        await this.onReconnectConfirm();
      }
    });
  }

  private async onReconnectConfirm(): Promise<void> {
    const contact = this.contact();
    if (!contact) return;

    try {
      this.error.set(null);
      await this.networkStore.updateContact(contact.id, {
        ...contact,
        lastConnect: new Date()
      });
    } catch (_) {
      this.error.set('Failed to update contact');
    }
  }

  private async onDeleteConfirm(): Promise<void> {
    const contact = this.contact();
    if (!contact) return;

    try {
      this.error.set(null);
      await this.networkStore.deleteContact(contact.id);
      this.router.navigate(['/network/list']);
    } catch (_) {
      this.error.set('Failed to delete contact');
    }
  }
}
