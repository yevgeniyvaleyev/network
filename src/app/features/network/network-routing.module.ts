import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NetworkListComponent } from './components/network-list/network-list.component';
import { CreateNetworkContactComponent } from './components/create-network-contact/create-network-contact.component';
import { NetworkDetailsComponent } from './components/network-details/network-details.component';
import { EditNetworkContactComponent } from './components/edit-network-contact/edit-network-contact.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'list',
        component: NetworkListComponent
      },
      {
        path: 'create',
        component: CreateNetworkContactComponent
      },
      {
        path: 'view/:id',
        component: NetworkDetailsComponent
      },
      {
        path: 'edit/:id',
        component: EditNetworkContactComponent
      },
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NetworkRoutingModule { }
