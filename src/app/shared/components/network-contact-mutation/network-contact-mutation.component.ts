import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, input, output, signal, untracked } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AuthStore } from 'app/core/store/auth.store';
import { NetworkContact, PlanningStatus } from 'app/shared/services/network-contacts.service';
import { AppLayoutComponent } from 'core/layout/app-layout/app-layout.component';
import { AppLayoutTab } from 'core/layout/app-layout/app-layout.types';

@Component({
  selector: 'app-network-contact-mutation',
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
    MatSlideToggleModule,
    AppLayoutComponent,
    MatCardModule
  ],
  templateUrl: './network-contact-mutation.component.html',
  styleUrls: ['./network-contact-mutation.component.scss']
})
export class NetworkContactMutationComponent {
  private fb = inject(FormBuilder);
  private authStore = inject(AuthStore);

  // Inputs
  contact = input<NetworkContact>();
  title = input<string>();
  submitButtonText = input<string>();

  // Outputs
  submit = output<NetworkContact>();
  cancel = output<void>();

  // Public signals and computed values
  public error = signal<string | null>(null);
  public communicationLanguages = computed(() => this.authStore.currentUser()?.languages || ['english']);
  public planningStatuses: PlanningStatus[] = ['planned', 'processing', 'invited', 'not planned'];

  public form: FormGroup = this.fb.group({
    name: ['', Validators.required],
    phoneNumber: [''],
    lastConnect: [new Date(), Validators.required],
    jobTitle: [''],
    workedAt: [''],
    preferredCommunicationChannel: [''],
    communicationLanguage: [this.communicationLanguages()[0]],
    email: ['', Validators.email],
    reconnectionFrequency: [120, [Validators.required, Validators.min(1)]],
    plannedReconnectionDate: [null],
    plannedReconnectionTime: [''],
    notes: [''],
    planningStatus: ['not planned' as PlanningStatus]
  });

  public tabsConfig: AppLayoutTab[] = [
    {
      alias: 'submit',
      icon: 'save',
      disabled: !this.form.valid
    },
    {
      alias: 'cancel',
      icon: 'cancel'
    }
  ];

  public communicationChannels = [
    'Email',
    'Phone',
    'LinkedIn',
    'WhatsApp',
    'Telegram'
  ];

  constructor() {

    effect(() => {
      if (this.contact()) {
        untracked(() => {
          this.form.patchValue({
            ...this.contact(),
            lastConnect: this.contact()?.lastConnect
          });
        })
      }
    });

    this.form.statusChanges.subscribe(() => {
      this.tabsConfig[0].disabled = !this.form.valid;
    });

    this.setupStatusSubscriptions();
  }

  private setupStatusSubscriptions() {
    this.form.get('plannedReconnectionDate')?.valueChanges.subscribe(date => {
      this.updatePlanningStatus();
    });

    this.form.get('plannedReconnectionTime')?.valueChanges.subscribe(time => {
      this.updatePlanningStatus();
    });

    this.form.get('planningStatus')?.valueChanges.subscribe(status => {
      if (status === 'processing') {
        this.form.patchValue({ plannedReconnectionTime: null });
      } else if (status === 'invited') {
        this.form.patchValue({
          plannedReconnectionTime: null,
          plannedReconnectionDate: null
        });
      }
    });
  }

  private updatePlanningStatus() {
    const date = this.form.get('plannedReconnectionDate')?.value;
    const time = this.form.get('plannedReconnectionTime')?.value;

    if (date && time) {
      this.form.patchValue({ planningStatus: 'planned' }, { emitEvent: false });
    } else if (date) {
      this.form.patchValue({ planningStatus: 'processing' }, { emitEvent: false });
    }
  }

  public onSubmit(): void {
    this.error.set(null);
    if (this.form.valid) {
      this.submit.emit(this.form.value);
    }
  }

  public onCancel(): void {
    this.cancel.emit();
  }

  public onTabClick(alias: string): void {
    if (alias === 'submit') {
      this.onSubmit();
    } else if (alias === 'cancel') {
      this.onCancel();
    }
  }
}
