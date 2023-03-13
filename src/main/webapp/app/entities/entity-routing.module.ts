import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'song',
        data: { pageTitle: 'teamprojectApp.song.home.title' },
        loadChildren: () => import('./song/song.module').then(m => m.SongModule),
      },
      {
        path: 'liked-song',
        data: { pageTitle: 'teamprojectApp.likedSong.home.title' },
        loadChildren: () => import('./liked-song/liked-song.module').then(m => m.LikedSongModule),
      },
      {
        path: 'disliked-song',
        data: { pageTitle: 'teamprojectApp.dislikedSong.home.title' },
        loadChildren: () => import('./disliked-song/disliked-song.module').then(m => m.DislikedSongModule),
      },
      {
        path: 'main-page',
        data: { pageTitle: 'teamprojectApp.mainPage.home.title' },
        loadChildren: () => import('./main-page/main-page.module').then(m => m.MainPageModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
