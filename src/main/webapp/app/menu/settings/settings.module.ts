/*
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';

import { settingsRoute } from './settings.route';
import { SettingsComponent } from './settings.component';

@NgModule({
  imports: [SharedModule, RouterModule.forChild([settingsRoute])],
  declarations: [SettingsComponent],
})
*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';

import { settingsRoute } from './settings.route';
import { SettingsComponent } from './settings.component';

@NgModule({
  declarations: [SettingsComponent],
  imports: [CommonModule, FormsModule, SharedModule, RouterModule.forChild([settingsRoute])],
})
export class SettingsModule {}
