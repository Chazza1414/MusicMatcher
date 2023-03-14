import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ILikedSong } from '../liked-song.model';
import { LikedSongService } from '../service/liked-song.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './liked-song-delete-dialog.component.html',
})
export class LikedSongDeleteDialogComponent {
  likedSong?: ILikedSong;

  constructor(protected likedSongService: LikedSongService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.likedSongService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
