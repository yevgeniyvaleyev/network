import { NgModule } from '@angular/core';
import { NetworkRoutingModule } from './network-routing.module';
import { NetworkListComponent } from './components/network-list/network-list.component';
import { NetworkDetailsComponent } from './components/network-details/network-details.component';
import { CreateNetworkContactComponent } from './components/create-network-contact/create-network-contact.component';
import { EditNetworkContactComponent } from './components/edit-network-contact/edit-network-contact.component';

@NgModule({
  imports: [
    NetworkListComponent,
    NetworkDetailsComponent,
    CreateNetworkContactComponent,
    EditNetworkContactComponent,
    NetworkRoutingModule
  ]
})
export class NetworkModule { }
