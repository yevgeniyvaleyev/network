import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NetworkContact, NetworkContactsService } from '../../../../shared/services/network-contacts.service';
import { AppLayoutTab } from '../../../../core/layout/app-layout/app-layout.types';
import { AppLayoutComponent } from '../../../../core/layout/app-layout/app-layout.component';
import { NetworkStore } from 'app/store/network.store';

@Component({
  selector: 'app-edit-network-contact',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    RouterModule,
    AppLayoutComponent
  ],
  templateUrl: './edit-network-contact.component.html',
  styleUrls: ['./edit-network-contact.component.scss']
})
export class EditNetworkContactComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private networkStore = inject(NetworkStore);

  public form: FormGroup = this.fb.group({
    name: ['', Validators.required],
    phoneNumber: [''],
    lastConnect: [new Date(), Validators.required],
    jobTitle: [''],
    workedAt: [''],
    preferredCommunicationChannel: [''],
    email: ['', Validators.email],
    reconnectionFrequency: [30, [Validators.required, Validators.min(1)]]
  });

  readonly selectedContact = computed(() => {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return null;
    return this.networkStore.contacts().find(c => c.id === id);
  });

  public tabsConfig: AppLayoutTab[] = [
    {
      alias: 'save',
      icon: 'save',
      disabled: !this.form.valid
    },
    {
      alias: 'cancel',
      icon: 'cancel'
    }
  ]

  public communicationChannels = [
    'Email',
    'Phone',
    'LinkedIn',
    'WhatsApp',
    'Telegram'
  ];

  public parentPath?: string;

  private contactId?: string;

  constructor() {
    this.form.statusChanges.subscribe(() => {
      this.tabsConfig[0].disabled = !this.form.valid;
    });
  }

  ngOnInit(): void {
    this.contactId = this.route.snapshot.paramMap.get('id') || '';
    this.parentPath = `/network/view/${this.contactId}`;
    const contact = this.networkStore.getContact(this.contactId);

    if (contact) {
      this.form.patchValue({
        ...contact,
        lastConnect: new Date(contact.lastConnect)
      });
    } else {
      console.error('Error fetching network contact.');
    }
  }

  public async onSubmit(): Promise<void> {
    if (this.form.valid && this.contactId) {

      try {
        await this.networkStore.updateContact(this.contactId, this.form.value);
        this.router.navigate(['/network/view', this.contactId]);
      } catch (error) {
        console.error('Error updating network contact.');
      }
    }
  }

  public onCancel(): void {
    if (this.contactId) {
      this.router.navigate(['/network/view', this.contactId]);
    }
  }

  public onTabClick(alias: string): void {
    if (alias === 'save') {
      this.onSubmit();
    } else if (alias === 'cancel') {
      this.onCancel();
    }
  }
}
