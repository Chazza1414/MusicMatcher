import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { LikedSongComponent } from '../list/liked-song.component';
import { LikedSongDetailComponent } from '../detail/liked-song-detail.component';
import { LikedSongUpdateComponent } from '../update/liked-song-update.component';
import { LikedSongRoutingResolveService } from './liked-song-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const likedSongRoute: Routes = [
  {
    path: '',
    component: LikedSongComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: LikedSongDetailComponent,
    resolve: {
      likedSong: LikedSongRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: LikedSongUpdateComponent,
    resolve: {
      likedSong: LikedSongRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: LikedSongUpdateComponent,
    resolve: {
      likedSong: LikedSongRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(likedSongRoute)],
  exports: [RouterModule],
})
export class LikedSongRoutingModule {}
