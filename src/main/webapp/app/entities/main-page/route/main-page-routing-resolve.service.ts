import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IMainPage } from '../main-page.model';
import { MainPageService } from '../service/main-page.service';

@Injectable({ providedIn: 'root' })
export class MainPageRoutingResolveService implements Resolve<IMainPage | null> {
  constructor(protected service: MainPageService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IMainPage | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((mainPage: HttpResponse<IMainPage>) => {
          if (mainPage.body) {
            return of(mainPage.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(null);
  }
}
