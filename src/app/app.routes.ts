import { Routes } from '@angular/router';
import { AuthGuardService } from './core/services/auth.guard.service';
import { LoginComponent } from './features/login/login.component';
import { NetworkListComponent } from './features/network-list/network-list.component';
import { PendingAccessComponent } from './features/pending-access/pending-access.component';
import { MainComponent } from './core/components/main/main.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';

export const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuardService],
    component: MainComponent,
    children: [
      { path: 'network-list', component: NetworkListComponent },
      { path: 'dashboard', component: DashboardComponent },
      { path: '', redirectTo: 'network-list', pathMatch: 'full' },
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
