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
import { NetworkItemsService } from '../../../../shared/services/network-items.service';

@Component({
  selector: 'app-create-network-item',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    RouterModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule
  ],
  templateUrl: './create-network-item.component.html',
  styleUrls: ['./create-network-item.component.scss']
})
export class CreateNetworkItemComponent {
  private fb = inject(FormBuilder);
  private networkItemsService = inject(NetworkItemsService);
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

  public communicationChannels = [
    'Email',
    'Phone',
    'LinkedIn',
    'WhatsApp',
    'Telegram'
  ];

  public onSubmit(): void {
    if (this.form.valid) {
      this.networkItemsService.createItem(this.form.value)
        .subscribe({
          next: () => {
            this.router.navigate(['/network/list']);
          },
          error: (error) => {
            console.error('Error creating network item:', error);
          }
        });
    }
  }
}
