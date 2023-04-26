import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';

import { LikedSongsComponent } from './liked-songs.component';
import { likedSongsRoute } from './liked-songs.route';

@NgModule({
  imports: [SharedModule, RouterModule.forChild([likedSongsRoute])],
  declarations: [LikedSongsComponent],
})
export class LikedSongsModule {}
