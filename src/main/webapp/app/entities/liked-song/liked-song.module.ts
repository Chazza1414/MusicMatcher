import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { LikedSongComponent } from './list/liked-song.component';
import { LikedSongDetailComponent } from './detail/liked-song-detail.component';
import { LikedSongUpdateComponent } from './update/liked-song-update.component';
import { LikedSongDeleteDialogComponent } from './delete/liked-song-delete-dialog.component';
import { LikedSongRoutingModule } from './route/liked-song-routing.module';

@NgModule({
  imports: [SharedModule, LikedSongRoutingModule],
  declarations: [LikedSongComponent, LikedSongDetailComponent, LikedSongUpdateComponent, LikedSongDeleteDialogComponent],
})
export class LikedSongModule {}
