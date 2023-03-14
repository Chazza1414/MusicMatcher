import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { MainPageComponent } from './list/main-page.component';
import { MainPageDetailComponent } from './detail/main-page-detail.component';
import { MainPageUpdateComponent } from './update/main-page-update.component';
import { MainPageDeleteDialogComponent } from './delete/main-page-delete-dialog.component';
import { MainPageRoutingModule } from './route/main-page-routing.module';

@NgModule({
  imports: [SharedModule, MainPageRoutingModule],
  declarations: [MainPageComponent, MainPageDetailComponent, MainPageUpdateComponent, MainPageDeleteDialogComponent],
})
export class MainPageModule {}
