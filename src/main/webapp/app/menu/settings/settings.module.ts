import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';

import { settingsRoute } from './settings.route';
import { SettingsComponent } from './settings.component';

@NgModule({
  imports: [SharedModule, RouterModule.forChild([settingsRoute])],
  declarations: [SettingsComponent],
})
export class SettingsModule {}
