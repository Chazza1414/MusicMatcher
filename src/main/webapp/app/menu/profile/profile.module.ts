import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';

import { profileRoute } from './profile.route';
import { ProfileComponent } from './profile.component';

@NgModule({
  imports: [SharedModule, RouterModule.forChild([profileRoute])],
  declarations: [ProfileComponent],
})
export class ProfileModule {}
