import { Routes } from '@angular/router';
import { LoginComponent } from './core/components/login/login.component';
import { PendingAccessComponent } from './core/layout/pending-access/pending-access.component';
import { AuthGuardService } from './core/services/auth.guard.service';
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
        path: 'settings',
        loadChildren: () => import('./features/settings/settings.module').then(m => m.SettingsModule)
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  }
];
