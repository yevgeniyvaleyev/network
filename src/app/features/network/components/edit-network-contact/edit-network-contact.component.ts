import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NetworkStore } from 'app/store/network.store';
import { NetworkContact } from 'app/shared/services/network-contacts.service';
import { NetworkContactMutationComponent } from 'app/shared/components/network-contact-mutation/network-contact-mutation.component';

@Component({
  selector: 'app-edit-network-contact',
  standalone: true,
  imports: [NetworkContactMutationComponent],
  template: `
  @if(contact()) {
    <app-network-contact-mutation
      [title]="'Edit Contact'"
      [contact]="contact()"
      (submit)="onSubmit($event)"
      (cancel)="onCancel()"
      [isProgress]="isProgress()"
    />
  }
  `
})
export class EditNetworkContactComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private networkStore = inject(NetworkStore);

  public contact = signal<NetworkContact | undefined>(undefined);
  private contactId = signal('');

  public isProgress = this.networkStore.loading;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') || '';
    this.contactId.set(id);
    this.contact.set(this.networkStore.getContact(id));
  }

  async onSubmit(updatedContact: NetworkContact): Promise<void> {
    const id = this.contactId();
    if (id) {
      try {
        await this.networkStore.updateContact(id, updatedContact);
        this.router.navigate(['/network/view', id]);
      } catch (_) {
        // Error handling is done in the mutation component
      }
    }
  }

  onCancel(): void {
    const id = this.contactId();
    if (id) {
      this.router.navigate(['/network/view', id]);
    }
  }
}
