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
    ]),
  ],
})
export class MenuRoutingModule {}
