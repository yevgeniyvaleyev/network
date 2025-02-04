import { NgModule } from '@angular/core';
import { SettingsComponent } from './components/settings-dashboard/settings.component';
import { SettingsRoutingModule } from './settings-routing.module';
import { AccountSettingsComponent } from './components/account-settings/account-settings.component';

@NgModule({
  imports: [
    SettingsRoutingModule,
    SettingsComponent,
    AccountSettingsComponent
  ],
})
export class SettingsModule { }
