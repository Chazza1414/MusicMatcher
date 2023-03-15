import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IMainPage } from '../main-page.model';
import { MainPageService } from '../service/main-page.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './main-page-delete-dialog.component.html',
})
export class MainPageDeleteDialogComponent {
  mainPage?: IMainPage;

  constructor(protected mainPageService: MainPageService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.mainPageService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
