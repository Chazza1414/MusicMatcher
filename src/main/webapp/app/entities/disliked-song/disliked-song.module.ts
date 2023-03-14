import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { DislikedSongComponent } from './list/disliked-song.component';
import { DislikedSongDetailComponent } from './detail/disliked-song-detail.component';
import { DislikedSongUpdateComponent } from './update/disliked-song-update.component';
import { DislikedSongDeleteDialogComponent } from './delete/disliked-song-delete-dialog.component';
import { DislikedSongRoutingModule } from './route/disliked-song-routing.module';

@NgModule({
  imports: [SharedModule, DislikedSongRoutingModule],
  declarations: [DislikedSongComponent, DislikedSongDetailComponent, DislikedSongUpdateComponent, DislikedSongDeleteDialogComponent],
})
export class DislikedSongModule {}
