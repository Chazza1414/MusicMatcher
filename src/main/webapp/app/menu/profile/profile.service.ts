import { Injectable } from '@angular/core';
import { SpotifyWebApi } from 'spotify-web-api-ts';

@Injectable({
  providedIn: 'root',
})
export class SpotifyService {
  private spotifyApi: SpotifyWebApi;

  constructor() {
    this.spotifyApi = new SpotifyWebApi({
      clientId: 'YOUR_CLIENT_ID',
    });
  }

  public getUserProfile(accessToken: string): Promise<any> {
    this.spotifyApi.setAccessToken(accessToken);
    return this.spotifyApi.get.artists.track();
  }
}
