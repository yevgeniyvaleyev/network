import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule } from '@angular/router';

import { NetworkRoutingModule } from './network-routing.module';
import { NetworkListComponent } from './components/network-list/network-list.component';
import { NetworkDetailsComponent } from './components/network-details/network-details.component';
import { CreateNetworkItemComponent } from './components/create-network-item/create-network-item.component';
import { EditNetworkItemComponent } from './components/edit-network-item/edit-network-item.component';

@NgModule({
  declarations: [],
  imports: [
    NetworkRoutingModule,
    NetworkListComponent,
    NetworkDetailsComponent,
    CreateNetworkItemComponent,
    EditNetworkItemComponent
  ]
})
export class NetworkModule { }
