import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { Router, RouterModule } from '@angular/router';
import { NetworkContactsService } from '../../../../shared/services/network-contacts.service';
import { AppLayoutComponent } from '../../../../core/layout/app-layout/app-layout.component';
import { AppLayoutTab } from '../../../../core/layout/app-layout/app-layout.types';

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
    AppLayoutComponent
  ],
  templateUrl: './create-network-contact.component.html',
  styleUrls: ['./create-network-contact.component.scss']
})
export class CreateNetworkContactComponent {
  private fb = inject(FormBuilder);
  private networkContactsService = inject(NetworkContactsService);
  private router = inject(Router);

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

  public onSubmit(): void {
    if (this.form.valid) {
      this.networkContactsService.createContact(this.form.value)
        .subscribe({
          next: () => {
            this.router.navigate(['/network/list']);
          },
          error: (error) => {
            console.error('Error creating network contact:', error);
          }
        });
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
