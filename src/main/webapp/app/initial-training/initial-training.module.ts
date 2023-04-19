import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InitialTrainingComponent } from './initial-training.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { initialTrainingRoute } from './initial-training.route';
import { CloseComponent } from './close/close.component';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [InitialTrainingComponent, CloseComponent],
  imports: [RouterModule.forChild([initialTrainingRoute]), SharedModule, BrowserModule, CommonModule, HttpClientModule, FormsModule],
})
export class InitialTrainingModule {}
