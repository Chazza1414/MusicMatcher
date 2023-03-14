import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ILikedSong } from '../liked-song.model';
import { LikedSongService } from '../service/liked-song.service';

@Injectable({ providedIn: 'root' })
export class LikedSongRoutingResolveService implements Resolve<ILikedSong | null> {
  constructor(protected service: LikedSongService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ILikedSong | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((likedSong: HttpResponse<ILikedSong>) => {
          if (likedSong.body) {
            return of(likedSong.body);
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
