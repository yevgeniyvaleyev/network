import { Routes } from '@angular/router';
import { AuthGuardService } from './core/services/auth.guard.service';
import { LoginComponent } from './core/components/login/login.component';
import { PendingAccessComponent } from './core/layout/pending-access/pending-access.component';
import { MainComponent } from './core/layout/main/main.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'pending-access',
    component: PendingAccessComponent
  },
  {
    path: '',
    canActivate: [AuthGuardService],
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'network',
        loadChildren: () => import('./features/network/network.module').then(m => m.NetworkModule)
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  }
];
