import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NetworkListComponent } from './components/network-list/network-list.component';
import { CreateNetworkItemComponent } from './components/create-network-item/create-network-item.component';
import { NetworkDetailsComponent } from './components/network-details/network-details.component';
import { EditNetworkItemComponent } from './components/edit-network-item/edit-network-item.component';

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
        component: CreateNetworkItemComponent
      },
      {
        path: 'view/:id',
        component: NetworkDetailsComponent
      },
      {
        path: 'edit/:id',
        component: EditNetworkItemComponent
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
