import { Routes } from '@angular/router';
import { AuthGuardService } from './core/services/auth.guard.service';
import { LoginComponent } from './core/components/login/login.component';
import { NetworkListComponent } from './features/network-list/components/network-list/network-list.component';
import { PendingAccessComponent } from './core/layout/pending-access/pending-access.component';
import { MainComponent } from './core/components/main/main.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { NETWORK_LIST_ROUTES } from './features/network-list/network.routes';

export const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuardService],
    component: MainComponent,
    children: [
      {
        path: 'network',
        children: NETWORK_LIST_ROUTES
      },
      { path: 'dashboard', component: DashboardComponent },
      { path: '', redirectTo: 'network', pathMatch: 'full' },
    ]
  },
  {
    path: 'pending-access',
    component: PendingAccessComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
];
