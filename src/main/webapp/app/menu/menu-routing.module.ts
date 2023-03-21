import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
/* jhipster-needle-add-admin-module-import - JHipster will add admin modules imports here */

@NgModule({
  imports: [
    /* jhipster-needle-add-admin-module - JHipster will add admin modules here */
    RouterModule.forChild([
      {
        path: 'liked-songs',
        loadChildren: () => import('./liked-songs/liked-songs.module').then(m => m.LikedSongsModule),
      },
      {
        path: 'disliked-songs',
        loadChildren: () => import('./disliked-songs/disliked-songs.module').then(m => m.DislikedSongsModule),
      },
      {
        path: 'main-page',
        loadChildren: () => import('./main-page/main-page.module').then(m => m.MainPageModule),
      },
      {
        path: 'profile',
        loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule),
      },
      {
        path: 'settings',
        loadChildren: () => import('./settings/settings.module').then(m => m.SettingsModule),
      },
    ]),
  ],
})
export class MenuRoutingModule {}
