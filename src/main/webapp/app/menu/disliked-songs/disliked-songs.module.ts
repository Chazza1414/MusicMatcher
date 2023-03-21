import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';

import { dislikedSongsRoute } from './disliked-songs.route';
import { DislikedSongsComponent } from './disliked-songs.component';

@NgModule({
  imports: [SharedModule, RouterModule.forChild([dislikedSongsRoute])],
  declarations: [DislikedSongsComponent],
})
export class DislikedSongsModule {}
