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
        path: 'main-page',
        data: { pageTitle: 'teamprojectApp.mainPage.home.title' },
        loadChildren: () => import('./main-page/main-page.module').then(m => m.MainPageModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
