import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountSettingsComponent } from './components/account-settings/account-settings.component';
import { SettingsComponent } from './components/settings-dashboard/settings.component';

const routes: Routes = [
  {
    path: '',
    component: SettingsComponent
  },
  {
    path: 'account',
    component: AccountSettingsComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
