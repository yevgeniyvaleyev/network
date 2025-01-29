import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
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
    RouterModule
  ],
  templateUrl: './edit-network-contact.component.html',
  styleUrls: ['./edit-network-contact.component.scss']
})
export class EditNetworkContactComponent implements OnInit {
  private fb = inject(FormBuilder);
  private networkContactsService = inject(NetworkContactsService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

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

  public communicationChannels = [
    'Email',
    'Phone',
    'LinkedIn',
    'WhatsApp',
    'Telegram'
  ];

  private contactId?: string;

  ngOnInit(): void {
    this.contactId = this.route.snapshot.paramMap.get('id') || undefined;
    if (this.contactId) {
      this.networkContactsService.getContactById(this.contactId).subscribe({
        next: (contact) => {
          this.form.patchValue({
            ...contact,
            lastConnect: new Date(contact.lastConnect)
          });
        },
        error: (error) => {
          console.error('Error fetching network contact:', error);
        }
      });
    }
  }

  public onSubmit(): void {
    if (this.form.valid && this.contactId) {
      this.networkContactsService.updateContact(this.contactId, this.form.value)
        .subscribe({
          next: () => {
            this.router.navigate(['/network/view', this.contactId]);
          },
          error: (error) => {
            console.error('Error updating network contact:', error);
          }
        });
    }
  }

  public onCancel(): void {
    if (this.contactId) {
      this.router.navigate(['/network/view', this.contactId]);
    }
  }
}
