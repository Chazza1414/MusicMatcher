import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IDislikedSong, NewDislikedSong } from '../disliked-song.model';

export type PartialUpdateDislikedSong = Partial<IDislikedSong> & Pick<IDislikedSong, 'id'>;

export type EntityResponseType = HttpResponse<IDislikedSong>;
export type EntityArrayResponseType = HttpResponse<IDislikedSong[]>;

@Injectable({ providedIn: 'root' })
export class DislikedSongService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/disliked-songs');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(dislikedSong: NewDislikedSong): Observable<EntityResponseType> {
    return this.http.post<IDislikedSong>(this.resourceUrl, dislikedSong, { observe: 'response' });
  }

  update(dislikedSong: IDislikedSong): Observable<EntityResponseType> {
    return this.http.put<IDislikedSong>(`${this.resourceUrl}/${this.getDislikedSongIdentifier(dislikedSong)}`, dislikedSong, {
      observe: 'response',
    });
  }

  partialUpdate(dislikedSong: PartialUpdateDislikedSong): Observable<EntityResponseType> {
    return this.http.patch<IDislikedSong>(`${this.resourceUrl}/${this.getDislikedSongIdentifier(dislikedSong)}`, dislikedSong, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IDislikedSong>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IDislikedSong[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getDislikedSongIdentifier(dislikedSong: Pick<IDislikedSong, 'id'>): number {
    return dislikedSong.id;
  }

  compareDislikedSong(o1: Pick<IDislikedSong, 'id'> | null, o2: Pick<IDislikedSong, 'id'> | null): boolean {
    return o1 && o2 ? this.getDislikedSongIdentifier(o1) === this.getDislikedSongIdentifier(o2) : o1 === o2;
  }

  addDislikedSongToCollectionIfMissing<Type extends Pick<IDislikedSong, 'id'>>(
    dislikedSongCollection: Type[],
    ...dislikedSongsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const dislikedSongs: Type[] = dislikedSongsToCheck.filter(isPresent);
    if (dislikedSongs.length > 0) {
      const dislikedSongCollectionIdentifiers = dislikedSongCollection.map(
        dislikedSongItem => this.getDislikedSongIdentifier(dislikedSongItem)!
      );
      const dislikedSongsToAdd = dislikedSongs.filter(dislikedSongItem => {
        const dislikedSongIdentifier = this.getDislikedSongIdentifier(dislikedSongItem);
        if (dislikedSongCollectionIdentifiers.includes(dislikedSongIdentifier)) {
          return false;
        }
        dislikedSongCollectionIdentifiers.push(dislikedSongIdentifier);
        return true;
      });
      return [...dislikedSongsToAdd, ...dislikedSongCollection];
    }
    return dislikedSongCollection;
  }
}
