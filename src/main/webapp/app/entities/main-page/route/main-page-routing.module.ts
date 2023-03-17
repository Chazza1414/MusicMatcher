import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { MainPageComponent } from '../list/main-page.component';
import { MainPageDetailComponent } from '../detail/main-page-detail.component';
import { MainPageUpdateComponent } from '../update/main-page-update.component';
import { MainPageRoutingResolveService } from './main-page-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const mainPageRoute: Routes = [
  {
    path: '',
    component: MainPageComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: MainPageDetailComponent,
    resolve: {
      mainPage: MainPageRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: MainPageUpdateComponent,
    resolve: {
      mainPage: MainPageRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: MainPageUpdateComponent,
    resolve: {
      mainPage: MainPageRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(mainPageRoute)],
  exports: [RouterModule],
})
export class MainPageRoutingModule {}
