import { Component, Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { SpotifyWebApi } from 'spotify-web-api-ts';

//import {AccessTokenService} from "./access-token.service";
import { HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { request } from 'express';
//import querystring from "querystring";

var client_id = '420af6bafdcf44398328b920c4c7dd97'; // Your client id
var client_secret = 'ca5438707e4149f2bbb229a876d06107'; // Your secret
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
  constructor(private http: HttpClient, private router: Router) //private accessTokenService: AccessTokenService
  {}

  getUrlReady(state: string): string {
    var url = new URL('https://accounts.spotify.com/authorize?');

    url.searchParams.append('response_type', 'code');
    url.searchParams.append('client_id', client_id);
    url.searchParams.append('scope', scope);
    url.searchParams.append('redirect_uri', redirect_uri);
    url.searchParams.append('state', state);

    return url.toString();
  }

  //this.http.get();

  // public get<T>(
  //   path: string,
  //   params: HttpParams = new HttpParams(),
  //   headers: HttpHeaders = new HttpHeaders()
  // ): Observable<T> {
  //   return this.getBodyOfResponseOrRedirect(
  //     this.http.get<T>(path, {headers, params, observe: 'response'}));
  // }
  //
  //
  //
  // private getBodyOfResponseOrRedirect<T>(
  //   responseObservable: Observable<HttpResponse<T>>
  // ): Observable<T> {
  //   return responseObservable.pipe(
  //     catchError(error => {
  //       if (!!error.status && error.status === 401) {
  //         window.location.href = 'https://custom-url';
  //         return NEVER;            // <-- never emit after the redirect
  //       }
  //       return throwError(error);  // <-- pass on the error if it isn't 401
  //     }),
  //     map(response =>  response.body)
  //   );
  // }

  callServer() {
    return this.http.get('http://localhost:3000/login').subscribe(data => {
      this.outTextVar = data.toString();
    });
  }

  async getAlbum(accessToken: any): Promise<any> {
    const spotify = new SpotifyWebApi({ accessToken: accessToken });
    const { artists } = await spotify.albums.getAlbum('1uzfGk9vxMXfaZ2avqwxod');
    return artists;
  }

  openWindow() {
    window.location.href = this.getUrlReady(state);
  }

  getAccessToken() {
    //this.outTextVar = this.outTextVar + "loaded";
    var accessToken = '';

    let params = new HttpParams();
    params = params.append('testParam', returnCode);

    //returnData = this.http.get<String>(apiUrl);
    const req = this.http.get('/api/spotify/auth', { responseType: 'text', params });

    req.subscribe(token => {
      //this.outTextVar = this.outTextVar + token;

      accessToken = token;
      spotifyApi.setAccessToken(token);

      let params2 = new HttpParams();
      params2 = params2.append('limit', 20);

      // const apiCall = this.http.get("https://api.spotify.com/v1/me/playlists",
      //   {headers: {Authorization: 'Bearer ' + token}});

      // apiCall.subscribe(playlists => {
      //   this.outTextVar = this.outTextVar + playlists.toString();
      // });

      spotifyApi.playlists.getMyPlaylists().then(
        data => {
          for (let i = 0; i < data.items.length; i++) {
            this.outTextVar = this.outTextVar + data.items[i].name;
          }
          //this.outTextVar = this.outTextVar + data.items[0].name;
        },
        error => {
          this.outTextVar = this.outTextVar + error;
        }
      );
      // this.getAlbum(accessToken).then(data => {
      //   this.outTextVar = this.outTextVar + data.name;
      // });
    });

    // Get Elvis' albums

    //this.outTextVar = this.outTextVar +

    // this.http.get<String>(apiUrl).subscribe({
    //   next: data => {
    //     returnData = data.toString();
    //   },
    //   error: error => {
    //     returnData = error.message;
    //     console.error('There was an error!', error);
    //   }
    // });

    //this.outTextVar = this.outTextVar + returnData;
  }

  runScript() {
    //document.body.removeChild(script);
    window.open('http://localhost:3000/spotify-login', 'tryAuth', 'height=800,width=400');
  }

  windowClosed(url: String) {
    this.outTextVar = this.outTextVar + 'comes back with: ' + url;
  }

  importPlaylists() {
    var url = new URL('https://accounts.spotify.com/authorize?');

    const params = new HttpParams()
      .append('client_id', client_id)
      .append('response_type', 'code')
      .append('redirect_uri', redirect_uri)
      .append('state', state);

    // var spotReq = this.http.get(url.toString(), {params})
    // spotReq.subscribe(data => {
    //   //textVar = data.toString();
    //   this.outTextVar = data.toString();
    //   //console.log(data);
    // });

    //this.outTextVar = this.outTextVar + 'function called\n';

    var spotifyAuthWindow = window.open(this.getUrlReady(state), 'spotifyAuth', 'height=800,width=400');

    var currentUrl = '';
    var code = '';
    var refreshToken: string = '';

    if (spotifyAuthWindow) {
      if (spotifyAuthWindow) {
        currentUrl = spotifyAuthWindow.location.href;
        //this.outTextVar = "do we get here?" + currentUrl;
        //this.outTextVar = this.outTextVar + currentUrl.toString();
      } else {
        this.outTextVar = this.outTextVar + 'window is null 2';
      }

      //this.outTextVar = this.outTextVar + "wrong";

      //code = currentUrl.split('code=')[1];
      //refreshToken = code.split('&')[0];

      //this.outTextVar = this.outTextVar + "refresh token = " + refreshToken;

      //this.outTextVar = this.outTextVar + "code" + code;
      //this.outTextVar = this.outTextVar + "refresh = " + refreshToken;
      //this.outTextVar = this.outTextVar + "state = " + code.split('&state=')[1];

      //if (code.split('&state=')[1] != state) {
      //this.outTextVar = this.outTextVar + "state = " + code.split('&state=')[1];
      //this.outTextVar = this.outTextVar + "state = " + state;
      //this.outTextVar = this.outTextVar + "error";
      //throw EvalError;
      //}
    } else {
      this.outTextVar = 'window is null';
    }
    /*
    //this.outTextVar = "do we get here? mk";

    var accessUrl = new URL('https://accounts.spotify.com/api/token?');

    refreshToken =
      'AQB89lcuKEdlBQTwfgHIKurc8-jQkliIRszB3O_5aRMFPz9LZGtb2-dEHlFzVhOuyX0IWlEr2GQz2sCdhtTESYiOfjLAMNsM8bLwittyXptOXomsv2i0wQbozMFw5VuIfhVqAyUM12NknM-xrHBSj1N2-FDGyK8NbmrlvtxgRqk-3W\n' +
      '6gk3spz0rG0aiabchYk4euBqm8vO-twDPFmd6LM1yRlDfVBYjmpc7gfaclO-ll7Ivp2KntMn_isYo';

    const body = {
      code: refreshToken,
      redirect_uri: 'http://localhost:3000/redpage',
      grant_type: 'authorization_code',
    };

    const headers = new HttpHeaders()
      .set('Authorization', 'Basic ' + btoa(client_id + ':' + client_secret))
      .set('Content-Type', 'application/x-www-form-urlencoded');

    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Basic ' + btoa(client_id + ':' + client_secret),
        'Content-Type': 'application/x-www-form-urlencoded',
      }),
    };

    // const headers = {
    //     'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
    //   };

    //accessUrl.searchParams.append('code', refreshToken);
    // accessUrl.searchParams.append('grant_type', "authorization_code");
    // accessUrl.searchParams.append('code', refreshToken);
    // accessUrl.searchParams.append('redirect_uri', redirect_uri);

    const authReq = this.http.post(accessUrl.toString(), body, httpOptions);

    authReq.subscribe({
      next: result => {
        // Handle result
        this.outTextVar = this.outTextVar + 'succeeded';
      },
      error: e => {
        this.outTextVar = this.outTextVar + e.name;
        //this.outTextVar = this.outTextVar + e.status;
        this.outTextVar = this.outTextVar + 'message = ' + e.message;
        this.outTextVar = this.outTextVar + e.detail;
      },
      complete: () => (this.outTextVar = this.outTextVar + 'completed'),
    });

     */
  }

  getAllSongs(): void {
    //this.testSongArray = this.songComponent.load();
  }

  outTextVar = textVar;
  outSongArray: song[] = songArray;
  outGenreArray: genre[] = genreArray;

  ngOnInit(): void {
    //const script = document.createElement('script') as HTMLScriptElement;
    //script.src = './spotifyServer.js';
    //document.body.appendChild(script);

    if (window.location.href.split('code=')[1].split('state=')[0] != null) {
      returnCode = window.location.href.split('code=')[1].split('&state=')[0];

      //this.outTextVar = this.outTextVar + returnCode;

      this.getAccessToken();
      // if (firstSplit.split("state=")[1] == state){
      //   this.outTextVar = this.outTextVar + "correct";
      // }
      // else {
      //   this.outTextVar = this.outTextVar + state + " != " + firstSplit.split("state=")[1];
      // }

      //this.outTextVar = this.outTextVar + window.location.href.split("code=")[1];
    } else {
      this.outTextVar = this.outTextVar + 'wrong';
    }
  }
}
