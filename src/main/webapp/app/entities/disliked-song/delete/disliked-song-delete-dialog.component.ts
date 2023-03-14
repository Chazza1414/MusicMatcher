import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IDislikedSong } from '../disliked-song.model';
import { DislikedSongService } from '../service/disliked-song.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './disliked-song-delete-dialog.component.html',
})
export class DislikedSongDeleteDialogComponent {
  dislikedSong?: IDislikedSong;

  constructor(protected dislikedSongService: DislikedSongService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.dislikedSongService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
