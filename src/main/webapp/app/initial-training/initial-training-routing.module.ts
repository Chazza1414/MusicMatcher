import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild([
      {
        path: 'initial-training',
        loadChildren: () => import('./initial-training.module').then(m => m.InitialTrainingModule),
      },
    ]),
  ],
})
export class InitialTrainingRoutingModule {}
