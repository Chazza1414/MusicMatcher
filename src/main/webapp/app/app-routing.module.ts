import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { errorRoute } from './layouts/error/error.route';
import { navbarRoute } from './layouts/navbar/navbar.route';
import { DEBUG_INFO_ENABLED } from 'app/app.constants';
import { Authority } from 'app/config/authority.constants';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { GdprComponent } from './layouts/footer/gdpr/gdpr.component';
import { InitialTrainingComponent } from './initial-training/initial-training.component';
import { CloseComponent } from './initial-training/close/close.component';

@NgModule({
  imports: [
    RouterModule.forRoot(
      [
        {
          path: 'admin',
          data: {
            authorities: [Authority.ADMIN],
          },
          canActivate: [UserRouteAccessService],
          loadChildren: () => import('./admin/admin-routing.module').then(m => m.AdminRoutingModule),
        },
        {
          path: 'account',
          loadChildren: () => import('./account/account.module').then(m => m.AccountModule),
        },
        {
          path: 'login',
          loadChildren: () => import('./login/login.module').then(m => m.LoginModule),
        },
        {
          path: '',
          loadChildren: () => import(`./entities/entity-routing.module`).then(m => m.EntityRoutingModule),
        },
        {
          path: '',
          loadChildren: () => import(`./menu/menu-routing.module`).then(m => m.MenuRoutingModule),
        },
        // {
        //   path: '',
        //   loadChildren: () => import(`./initial-training/initial-training-routing.module`).then(m => m.InitialTrainingRoutingModule),
        // },
        {
          path: 'gdpr',
          component: GdprComponent,
        },
        {
          path: 'initial-training',
          component: InitialTrainingComponent,
        },
        {
          path: 'close',
          component: CloseComponent,
        },
        navbarRoute,
        ...errorRoute,
      ],
      { enableTracing: DEBUG_INFO_ENABLED }
    ),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
