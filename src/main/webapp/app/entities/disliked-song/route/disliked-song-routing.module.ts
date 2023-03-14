import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { DislikedSongComponent } from '../list/disliked-song.component';
import { DislikedSongDetailComponent } from '../detail/disliked-song-detail.component';
import { DislikedSongUpdateComponent } from '../update/disliked-song-update.component';
import { DislikedSongRoutingResolveService } from './disliked-song-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const dislikedSongRoute: Routes = [
  {
    path: '',
    component: DislikedSongComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: DislikedSongDetailComponent,
    resolve: {
      dislikedSong: DislikedSongRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: DislikedSongUpdateComponent,
    resolve: {
      dislikedSong: DislikedSongRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: DislikedSongUpdateComponent,
    resolve: {
      dislikedSong: DislikedSongRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(dislikedSongRoute)],
  exports: [RouterModule],
})
export class DislikedSongRoutingModule {}
