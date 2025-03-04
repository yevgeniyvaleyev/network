import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NetworkStore } from 'app/store/network.store';
import { NetworkContact } from 'app/shared/services/network-contacts.service';
import { NetworkContactMutationComponent } from 'app/shared/components/network-contact-mutation/network-contact-mutation.component';

@Component({
  selector: 'app-create-network-contact',
  standalone: true,
  imports: [NetworkContactMutationComponent],
  template: `
    <app-network-contact-mutation
      [title]="'Create Contact'"
      (submit)="onSubmit($event)"
      (cancel)="onCancel()"
    />
  `
})
export class CreateNetworkContactComponent {
  private router = inject(Router);
  private networkStore = inject(NetworkStore);

  async onSubmit(contact: NetworkContact): Promise<void> {
    try {
      const result = await this.networkStore.createContact(contact);
      if (result) {
        this.router.navigate(['/network/list']);
      }
    } catch (_) {
      // Error handling is done in the mutation component
    }
  }

  onCancel(): void {
    this.router.navigate(['/network/list']);
  }
}
