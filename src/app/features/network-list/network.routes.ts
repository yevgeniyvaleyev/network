import { Routes } from '@angular/router';
import { NetworkListComponent } from './components/network-list/network-list.component';

export const NETWORK_LIST_ROUTES: Routes = [
  {
    path: 'list',
    component: NetworkListComponent
  },
  {
    path: 'create',
    loadComponent: () => import('./components/create-network-item/create-network-item.component')
      .then(m => m.CreateNetworkItemComponent)
  },
  {
    path: 'view/:id',
    loadComponent: () => import('./components/network-details/network-details.component')
      .then(m => m.NetworkDetailsComponent)
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./components/edit-network-item/edit-network-item.component')
      .then(m => m.EditNetworkItemComponent)
  },
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  }
];
