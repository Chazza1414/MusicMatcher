import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ILikedSong, NewLikedSong } from '../liked-song.model';

export type PartialUpdateLikedSong = Partial<ILikedSong> & Pick<ILikedSong, 'id'>;

export type EntityResponseType = HttpResponse<ILikedSong>;
export type EntityArrayResponseType = HttpResponse<ILikedSong[]>;

@Injectable({ providedIn: 'root' })
export class LikedSongService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/liked-songs');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(likedSong: NewLikedSong): Observable<EntityResponseType> {
    return this.http.post<ILikedSong>(this.resourceUrl, likedSong, { observe: 'response' });
  }

  update(likedSong: ILikedSong): Observable<EntityResponseType> {
    return this.http.put<ILikedSong>(`${this.resourceUrl}/${this.getLikedSongIdentifier(likedSong)}`, likedSong, { observe: 'response' });
  }

  partialUpdate(likedSong: PartialUpdateLikedSong): Observable<EntityResponseType> {
    return this.http.patch<ILikedSong>(`${this.resourceUrl}/${this.getLikedSongIdentifier(likedSong)}`, likedSong, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ILikedSong>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ILikedSong[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getLikedSongIdentifier(likedSong: Pick<ILikedSong, 'id'>): number {
    return likedSong.id;
  }

  compareLikedSong(o1: Pick<ILikedSong, 'id'> | null, o2: Pick<ILikedSong, 'id'> | null): boolean {
    return o1 && o2 ? this.getLikedSongIdentifier(o1) === this.getLikedSongIdentifier(o2) : o1 === o2;
  }

  addLikedSongToCollectionIfMissing<Type extends Pick<ILikedSong, 'id'>>(
    likedSongCollection: Type[],
    ...likedSongsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const likedSongs: Type[] = likedSongsToCheck.filter(isPresent);
    if (likedSongs.length > 0) {
      const likedSongCollectionIdentifiers = likedSongCollection.map(likedSongItem => this.getLikedSongIdentifier(likedSongItem)!);
      const likedSongsToAdd = likedSongs.filter(likedSongItem => {
        const likedSongIdentifier = this.getLikedSongIdentifier(likedSongItem);
        if (likedSongCollectionIdentifiers.includes(likedSongIdentifier)) {
          return false;
        }
        likedSongCollectionIdentifiers.push(likedSongIdentifier);
        return true;
      });
      return [...likedSongsToAdd, ...likedSongCollection];
    }
    return likedSongCollection;
  }
}
