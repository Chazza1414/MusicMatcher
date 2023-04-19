import { Component, Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { SpotifyWebApi } from 'spotify-web-api-ts';

var client_id = '420af6bafdcf44398328b920c4c7dd97'; // Your client id
var client_secret = 'e54bd430c6a6428e8355dba28e1f7a9f'; // Your secret
var redirect_uri = 'http://localhost:9000/initial-training'; // Your redirect uri
var scope = 'user-read-private user-read-email playlist-read-private';
var apiUrl = '/api/spotify/auth';
var returnCode = '';

var spotifyApi = new SpotifyWebApi({
  clientId: client_id,
  clientSecret: client_secret,
  redirectUri: redirect_uri,
});

export interface song {
  name: string;
  id: string;
}

export interface genre {
  name: string;
}

export interface playlist {
  name: string;
  id: string;
}

export var playlistArray: playlist[] = [];

export var songArray: song[] = [];
export var genreArray: genre[] = [];

var textVar = '';

var state = '';
var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

for (var i = 0; i < 16; i++) {
  state += possible.charAt(Math.floor(Math.random() * possible.length));
}

@Component({
  selector: 'jhi-initial-training',
  templateUrl: './initial-training.component.html',
  styleUrls: ['./initial-training.component.scss'],
})
@Injectable()
export class InitialTrainingComponent implements OnInit {
  constructor(private http: HttpClient) {}

  selectAllPlaylists() {
    //this.playlistItem = true;
    // for (let playlist of this.outPlaylistArray) {
    //   playlist.playlistItem = !playlist.playlistItem;
    // }
    //document.getElementById('playlist-item')
    //var checkbox = document.querySelector("input[type='checkbox']");
  }

  getUrlReady(state: string): string {
    var url = new URL('https://accounts.spotify.com/authorize?');

    url.searchParams.append('response_type', 'code');
    url.searchParams.append('client_id', client_id);
    url.searchParams.append('scope', scope);
    url.searchParams.append('redirect_uri', redirect_uri);
    url.searchParams.append('state', state);

    return url.toString();
  }

  openWindow() {
    window.location.href = this.getUrlReady(state);
  }

  //this function is called by the button press to import playlists
  getAccessToken() {
    //create parameters that we want returned to us
    let params = new HttpParams();
    params = params.append('testParam', returnCode);

    //create the http get request to our api endpoint
    const req = this.http.get(apiUrl, { responseType: 'text', params });

    //request is executed when subscribe is called
    req.subscribe(token => {
      //this.outTextVar = this.outTextVar + "your access token=" + token;

      spotifyApi.setAccessToken(token);

      //use the spotify api dependency to make calls easily, see top of file for creation of object
      spotifyApi.playlists.getMyPlaylists(/* add parameters in here*/).then(
        data => {
          //this is iterating through each playlist and getting the name
          for (let i = 0; i < data.items.length; i++) {
            playlistArray.push({ name: data.items[i].name, id: data.items[i].id });
          }
        },
        error => {
          //this.outTextVar = this.outTextVar + error;
        }
      );

      //get global top 50 playlist
      spotifyApi.playlists.getPlaylist('37i9dQZEVXbMDoHDwVN2tF').then(data => {
        for (let i = 0; i < data.tracks.total; i++) {
          //this.outTextVar = this.outTextVar + data.tracks.items[i].track.name;
          songArray.push({ name: data.tracks.items[i].track.name, id: data.tracks.items[i].track.id });
        }
      });

      //get available seed genres
      spotifyApi.browse.getAvailableGenreSeeds().then(data => {
        for (let i = 0; i < data.length; i++) {
          //this.outTextVar = this.outTextVar + data.tracks.items[i].track.name;
          genreArray.push({ name: data[i] });
        }
      });
    });
  }

  submitForm(event: Event) {}

  outTextVar = textVar;
  outSongArray: song[] = songArray;
  outGenreArray: genre[] = genreArray;
  outPlaylistArray: playlist[] = playlistArray;

  playlistItem: boolean = true;

  ngOnInit(): void {
    if (window.location.href.split('code=')[1].split('state=')[0] != null) {
      returnCode = window.location.href.split('code=')[1].split('&state=')[0];

      this.getAccessToken();
    } else {
      this.outTextVar = this.outTextVar + 'Error: token not received';
    }
  }
}
