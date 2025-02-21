import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router, RouterModule } from '@angular/router';
import { AuthStore } from 'app/core/store/auth.store';
import { NetworkStore } from 'app/store/network.store';
import { AppLayoutComponent } from 'core/layout/app-layout/app-layout.component';
import { AppLayoutTab } from 'core/layout/app-layout/app-layout.types';

@Component({
  selector: 'app-create-network-contact',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    RouterModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    AppLayoutComponent,
    MatCardModule
  ],
  templateUrl: './create-network-contact.component.html',
  styleUrls: ['./create-network-contact.component.scss']
})
export class CreateNetworkContactComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private networkStore = inject(NetworkStore);
  private authStore = inject(AuthStore);

  public error = signal<string | null>(null);
  public communicationLanguages = computed(() => this.authStore.currentUser()?.languages || ['english']);

  public form: FormGroup = this.fb.group({
    name: ['', Validators.required],
    phoneNumber: [''],
    lastConnect: [new Date(), Validators.required],
    jobTitle: [''],
    workedAt: [''],
    preferredCommunicationChannel: [''],
    communicationLanguage: [this.communicationLanguages()[0]], // Default to first available language
    email: ['', Validators.email],
    reconnectionFrequency: [30, [Validators.required, Validators.min(1)]],
    plannedReconnectionDate: [null]
  });

  public tabsConfig: AppLayoutTab[] = [
    {
      alias: 'create',
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

  constructor() {
    this.form.statusChanges.subscribe(() => {
      this.tabsConfig[0].disabled = !this.form.valid;
    })
  }

  public async onSubmit(): Promise<void> {
    this.error.set(null);
    if (this.form.valid) {
      try {
        const contact = await this.networkStore.createContact(this.form.value)
        if (contact) {
          this.router.navigate(['/network/list']);
        }
      } catch (_) {
        this.error.set('Failed to create contact')
      }
    }
  }

  public onTabClick(alias: string): void {
    if (alias === 'cancel') {
      this.router.navigate(['/network/list']);
    } else if (alias === 'create') {
      this.onSubmit();
    }
  }
}
