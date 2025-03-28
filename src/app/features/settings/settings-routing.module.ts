import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountSettingsComponent } from './components/account-settings/account-settings.component';
import { SettingsComponent } from './components/settings-dashboard/settings.component';
import { AppStatusComponent } from './components/app-status/app-status.component';
import { ImportDataComponent } from './components/import-data/import-data.component';

const routes: Routes = [
  {
    path: '',
    component: SettingsComponent
  },
  {
    path: 'account',
    component: AccountSettingsComponent
  },
  {
    path: 'app-status',
    component: AppStatusComponent
  },
  {
    path: 'import',
    component: ImportDataComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
