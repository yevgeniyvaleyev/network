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
import { NetworkItem, NetworkItemsService } from '../../../../shared/services/network-items.service';

@Component({
  selector: 'app-edit-network-item',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    RouterModule
  ],
  templateUrl: './edit-network-item.component.html',
  styleUrls: ['./edit-network-item.component.scss']
})
export class EditNetworkItemComponent implements OnInit {
  private fb = inject(FormBuilder);
  private networkItemsService = inject(NetworkItemsService);
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

  private itemId?: string;

  ngOnInit(): void {
    this.itemId = this.route.snapshot.paramMap.get('id') || undefined;
    if (this.itemId) {
      this.networkItemsService.getItemById(this.itemId).subscribe({
        next: (item) => {
          this.form.patchValue({
            ...item,
            lastConnect: new Date(item.lastConnect)
          });
        },
        error: (error) => {
          console.error('Error fetching network item:', error);
        }
      });
    }
  }

  public onSubmit(): void {
    if (this.form.valid && this.itemId) {
      this.networkItemsService.updateItem(this.itemId, this.form.value)
        .subscribe({
          next: () => {
            this.router.navigate(['/network/view', this.itemId]);
          },
          error: (error) => {
            console.error('Error updating network item:', error);
          }
        });
    }
  }

  public onCancel(): void {
    if (this.itemId) {
      this.router.navigate(['/network/view', this.itemId]);
    }
  }
}
