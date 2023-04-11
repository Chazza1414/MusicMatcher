import { Component, Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
//import querystring from "querystring";

var client_id = '420af6bafdcf44398328b920c4c7dd97'; // Your client id
var client_secret = 'ca5438707e4149f2bbb229a876d06107'; // Your secret
var redirect_uri = 'http://localhost:9000/initial-training'; // Your redirect uri
var scope = 'user-read-private user-read-email playlist-read-private';

export interface song {
  name: string;
  artist: string;
}

export interface genre {
  name: string;
}

export var songArray: song[] = [
  { name: 'test name', artist: 'test artist' },
  { name: 'test name', artist: 'test artist' },
  { name: 'test name', artist: 'test artist' },
  { name: 'test name', artist: 'test artist' },
  { name: 'test name', artist: 'test artist' },
  { name: 'test name', artist: 'test artist' },
  { name: 'test name', artist: 'test artist' },
  { name: 'test name', artist: 'test artist' },
  { name: 'test name', artist: 'test artist' },
  { name: 'test name', artist: 'test artist' },
  { name: 'test name', artist: 'test artist' },
  { name: 'test name', artist: 'test artist' },
  { name: 'test name', artist: 'test artist' },
  { name: 'test name', artist: 'test artist' },
  { name: 'test name', artist: 'test artist' },
  { name: 'test name', artist: 'test artist' },
  { name: 'test name', artist: 'test artist' },
  { name: 'test name', artist: 'test artist' },
  { name: 'test name', artist: 'test artist' },
  { name: 'test name', artist: 'test artist' },
  { name: 'test name', artist: 'test artist' },
  { name: 'test name', artist: 'test artist' },
  { name: 'test name', artist: 'test artist' },
  { name: 'test name', artist: 'test artist' },
];
export var genreArray: genre[] = [
  { name: 'test genre' },
  { name: 'test genre' },
  { name: 'test genre' },
  { name: 'test genre' },
  { name: 'test genre' },
  { name: 'test genre' },
  { name: 'test genre' },
  { name: 'test genre' },
  { name: 'test genre' },
  { name: 'test genre' },
  { name: 'test genre' },
  { name: 'test genre' },
  { name: 'test genre' },
  { name: 'test genre' },
  { name: 'test genre' },
  { name: 'test genre' },
  { name: 'test genre' },
  { name: 'test genre' },
  { name: 'test genre' },
  { name: 'test genre' },
  { name: 'test genre' },
  { name: 'test genre' },
  { name: 'test genre' },
  { name: 'test genre' },
];

@Component({
  selector: 'jhi-initial-training',
  templateUrl: './initial-training.component.html',
  styleUrls: ['./initial-training.component.scss'],
})
@Injectable()
export class InitialTrainingComponent implements OnInit {
  constructor(private http: HttpClient) {}

  importPlaylists() {
    var generateRandomString = function (length: number) {
      var text = '';
      var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

      for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
      }
      return text;
    };

    var state = generateRandomString(16);

    var url = new URL('https://accounts.spotify.com/authorize?');

    url.searchParams.append('response_type', 'code');
    url.searchParams.append('client_id', client_id);
    url.searchParams.append('scope', scope);
    url.searchParams.append('redirect_uri', redirect_uri);
    url.searchParams.append('state', state);

    var spotifyAuthWindow = window.open(url, 'spotifyAuth', 'height=400,width=200');

    var currentUrl = '';
    var code;
    var refreshToken;

    if (spotifyAuthWindow) {
      currentUrl = spotifyAuthWindow.location.href;
    }

    code = currentUrl.split('code=')[1];
    refreshToken = code.split('&')[0];
    if (code.split('&state=')[1] != state) {
      console.log("throwing error because states don't match");
      throw EvalError;
    }

    const authReq = this.http.get('https://accounts.spotify.com/api/token');

    authReq.subscribe(data => {
      console.log(data);
    });
  }

  getAllSongs(): void {
    //this.testSongArray = this.songComponent.load();
  }

  outSongArray: song[] = songArray;
  outGenreArray: genre[] = genreArray;

  ngOnInit(): void {}
}
