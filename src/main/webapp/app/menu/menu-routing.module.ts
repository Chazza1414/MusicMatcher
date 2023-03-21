import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LikedSongsComponent } from './liked-songs/liked-songs.component';

const menuRoutes: Routes = [
  {
    path: 'liked-songs',
    component: LikedSongsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(menuRoutes)],
})
export class MenuRoutingModule {}
