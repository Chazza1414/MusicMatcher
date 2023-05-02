import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs'; //Aki Added

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ISong, NewSong } from '../song.model';

export type PartialUpdateSong = Partial<ISong> & Pick<ISong, 'id'>;

export type EntityResponseType = HttpResponse<ISong>;
export type EntityArrayResponseType = HttpResponse<ISong[]>;

@Injectable({ providedIn: 'root' })
/* eslint-disable @typescript-eslint/member-ordering */
export class SongService {
  private _likedSongs = new BehaviorSubject<ISong[]>([]);
  private _dislikedSongs = new BehaviorSubject<ISong[]>([]); // Aki Added

  public likedSongs$ = this._likedSongs.asObservable();
  public dislikedSongs$ = this._dislikedSongs.asObservable();

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/songs');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(song: NewSong): Observable<EntityResponseType> {
    console.log('create function in song service: ' + song);
    return this.http.post<ISong>(this.resourceUrl, song, { observe: 'response' });
  }

  update(song: ISong): Observable<EntityResponseType> {
    return this.http.put<ISong>(`${this.resourceUrl}/${this.getSongIdentifier(song)}`, song, { observe: 'response' });
  }

  partialUpdate(song: PartialUpdateSong): Observable<EntityResponseType> {
    return this.http.patch<ISong>(`${this.resourceUrl}/${this.getSongIdentifier(song)}`, song, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ISong>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ISong[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  queryLikedSongs(): Observable<EntityArrayResponseType> {
    return this.http.get<ISong[]>(`/api/liked-songs`, { observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getSongIdentifier(song: Pick<ISong, 'id'>): number {
    return song.id;
  }

  compareSong(o1: Pick<ISong, 'id'> | null, o2: Pick<ISong, 'id'> | null): boolean {
    return o1 && o2 ? this.getSongIdentifier(o1) === this.getSongIdentifier(o2) : o1 === o2;
  }

  addSongToCollectionIfMissing<Type extends Pick<ISong, 'id'>>(
    songCollection: Type[],
    ...songsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const songs: Type[] = songsToCheck.filter(isPresent);
    if (songs.length > 0) {
      const songCollectionIdentifiers = songCollection.map(songItem => this.getSongIdentifier(songItem)!);
      const songsToAdd = songs.filter(songItem => {
        const songIdentifier = this.getSongIdentifier(songItem);
        if (songCollectionIdentifiers.includes(songIdentifier)) {
          return false;
        }
        songCollectionIdentifiers.push(songIdentifier);
        return true;
      });
      return [...songsToAdd, ...songCollection];
    }
    return songCollection;
  }
  addLikedSong(song: ISong): void {
    const currentSongs = this._likedSongs.getValue();
    this._likedSongs.next([...currentSongs, song]);
  }
  addDislikedSong(song: ISong): void {
    const currentSongs = this._dislikedSongs.getValue();
    this._dislikedSongs.next([...currentSongs, song]);
  } //Aki Added

  removeLikedSong(song: ISong): void {
    const currentSongs = this._likedSongs.getValue();
    this._likedSongs.next(currentSongs.filter(s => s !== song));
  }
  removeDislikedSong(song: ISong): void {
    const currentSongs = this._dislikedSongs.getValue();
    this._dislikedSongs.next(currentSongs.filter(s => s !== song));
  }
}
/* eslint-disable @typescript-eslint/member-ordering */
