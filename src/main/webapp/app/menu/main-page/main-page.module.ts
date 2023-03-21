import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';

import { mainPageRoute } from './main-page.route';
import { MainPageComponent } from './main-page.component';

@NgModule({
  imports: [SharedModule, RouterModule.forChild([mainPageRoute])],
  declarations: [MainPageComponent],
})
export class MainPageModule {}
