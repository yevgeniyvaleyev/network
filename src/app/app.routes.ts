import { Routes } from '@angular/router';
import { AuthGuardService } from './core/services/auth.guard.service';
import { LoginComponent } from './features/login/login.component';
import { NetworkListComponent } from './features/network-list/network-list.component';
import { PendingAccessComponent } from './features/pending-access/pending-access.component';

export const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuardService],
    component: NetworkListComponent,
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
