import { Component, Injectable, isDevMode, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { RecommendService } from './recommend.service';
import { SpotifyWebApi } from 'spotify-web-api-ts';
import { ISong, NewSong } from '../entities/song/song.model';
import { SongUpdateComponent } from '../entities/song/update/song-update.component';
import { SongService } from '../entities/song/service/song.service';
import { AccountService } from '../core/auth/account.service';
import { Router } from '@angular/router';
//import * as angSpot from 'angular-spotify';

let client_id = '420af6bafdcf44398328b920c4c7dd97'; // Your client id
let client_secret = 'e54bd430c6a6428e8355dba28e1f7a9f'; // Your secret
let redirect_uri = 'http://localhost:9000/initial-training'; // Your redirect uri
//var redirect_uri = 'https://musicmatcher.bham.team/initial-training'; // Your redirect uri
let scope = 'user-read-private user-read-email playlist-read-private user-top-read user-library-read user-follow-read';
let returnCode = '';
let accessToken = '';
let refreshToken: string = '';
let songRec: string = '';
let userMusicProfile: musicProfile;
let buttonVisible: boolean = false;

//instance of the spotify api node from: https://github.com/thelinmichael/spotify-web-api-node
var spotifyApi = new SpotifyWebApi({
  clientId: client_id,
  clientSecret: client_secret,
  redirectUri: redirect_uri,
});

//the below three interfaces are used for the 3 front end columns
// the name is displayed and the id is passed to relevant functions for use
// the checked value is used to determine if the checkbox has been selected
interface song {
  name: string;
  id: string;
  checked: boolean;
}

interface genre {
  name: string;
  checked: boolean;
}

interface playlist {
  name: string;
  id: string;
  checked: boolean;
}

interface musicProfile {
  acousticness: number;
  danceability: number;
  energy: number;
  instrumentalness: number;
  loudness: number;
  speechiness: number;
  tempo: number;
  valence: number;
  genres: string[];
  songTotal: number;
}

var playlistArray: playlist[] = [];
var playlistSongs: NewSong[] = [];
var songArray: song[] = [];
var genreArray: genre[] = [];

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
  constructor(private http: HttpClient, private recommendService: RecommendService, private accountService: AccountService) {}

  //creates a URL for the user to log into spotify
  getUrlReady(state: string): string {
    var url = new URL('https://accounts.spotify.com/authorize?');

    url.searchParams.append('response_type', 'code');
    url.searchParams.append('client_id', client_id);
    url.searchParams.append('scope', scope);
    url.searchParams.append('redirect_uri', redirect_uri);
    url.searchParams.append('state', state);

    return url.toString();
  }

  //redirects the user to the URL provided for spotify log in
  openWindow() {
    if (!isDevMode()) {
      redirect_uri = 'https://musicmatcher.bham.team/initial-training';
    }

    window.location.href = this.getUrlReady(state);
  }

  getRefreshToken() {
    if (!isDevMode()) {
      redirect_uri = 'https://musicmatcher.bham.team/initial-training';
      console.log('in prod mode');
    }

    //returns refresh token
    let params = new HttpParams();
    params = params.append('code', returnCode);
    params = params.append('redirect_uri', redirect_uri);

    //create the http get request to our api endpoint
    const req = this.http.get('/api/spotify/refreshtoken', { responseType: 'text', params });

    try {
      req.subscribe(data => {
        console.log('refresh token: ' + data);
        refreshToken = data;

        try {
          //let params2 = new HttpParams();
          params = params.delete('code');
          params = params.append('refreshtoken', data);
          //params2 = params.append('refreshtoken', data);

          //console.log("params" + params);

          //create the http get request to our api endpoint
          const req2 = this.http.get('/api/spotify/accesstoken', { responseType: 'text', params });

          req2.subscribe(data => {
            console.log('access token: ' + data);

            accessToken = data;

            spotifyApi.setAccessToken(accessToken);

            this.loadDataToSelect();
          });
        } catch (e) {
          console.log('error: ' + e);
        }
      });
    } catch (e) {
      console.log('error: ' + e);
    }
  }

  //this function is called by the button press to import playlists

  loadDataToSelect() {
    spotifyApi.setAccessToken(accessToken);

    this.getUserPlaylists();

    //get global top 50 playlist
    spotifyApi.playlists.getPlaylist('37i9dQZEVXbNG2KDcFcKOF').then(data => {
      for (let i = 0; i < data.tracks.total; i++) {
        //this.outTextVar = this.outTextVar + JSON.stringify(data.tracks.items[i]);
        songArray.push({ name: data.tracks.items[i].track.name, id: data.tracks.items[i].track.id, checked: false });
      }
    });

    //get available seed genres
    spotifyApi.browse.getAvailableGenreSeeds().then(data => {
      for (let i = 0; i < data.length; i++) {
        //this.outTextVar = this.outTextVar + data.tracks.items[i].track.name;
        genreArray.push({ name: data[i], checked: false });
      }
    });

    //spotifyApi.tracks.getTrack(id)
  }

  getUserPlaylists() {
    //use the spotify api dependency to make calls easily, see top of file for creation of object
    spotifyApi.playlists.getMyPlaylists(/* add parameters in here*/).then(
      data => {
        //this is iterating through each playlist and getting the name
        for (let i = 0; i < data.items.length; i++) {
          playlistArray.push({ name: data.items[i].name, id: data.items[i].id, checked: false });
        }
      },
      error => {
        console.log('error occured getting user playlists: ' + error);
      }
    );
  }

  async submitForm() {
    let selectedGenres = this.outGenreArray.filter(opt => opt.checked);
    let selectedPlaylists = this.outPlaylistArray.filter(opt => opt.checked);
    let selectedSongs = this.outSongArray.filter(opt => opt.checked);

    //console.log("get here");

    userMusicProfile = await this.recommendService.generateUMP(accessToken, selectedPlaylists, selectedSongs, selectedGenres);

    this.outButtonVisible = true;

    //setTimeout(() => window.location.href = "/main-page", 2000);

    //this.outTextVar = this.outTextVar + songArray[0].spotifySongId;

    // await this.recommendService.makeSongEntities(accessToken, [{name: "", id: "3dnP0JxCgygwQH9Gm7q7nb", checked: false}]).then(data => {
    //   this.outTextVar = this.outTextVar + data[0].spotifySongId;
    // })
  }

  returnRefreshToken(): string {
    return refreshToken;
  }

  returnAccessToken(): string {
    return accessToken;
  }

  returnSongRec(): string {
    return songRec;
  }

  returnUMP(): musicProfile {
    return userMusicProfile;
  }

  outTextVar = textVar;
  outSongArray: song[] = songArray;
  outGenreArray: genre[] = genreArray;
  outPlaylistArray: playlist[] = playlistArray;
  outAccessToken: string = accessToken;
  outButtonVisible: boolean = buttonVisible;

  playlistItem: boolean = true;

  ngOnInit(): void {
    console.log(window.location.href);

    if (window.location.href.includes('code=')) {
      returnCode = window.location.href.split('code=')[1].split('&state=')[0];
      this.getRefreshToken();
      //console.log("are we here");

      //this.getAccessToken();
    }

    // if (window.location.href != undefined && window.location.href.split('code=')[1].split('state=')[0] != null) {
    //   returnCode = window.location.href.split('code=')[1].split('&state=')[0];
    //
    //   this.getRefreshToken();
    //   console.log("are we here");
    //
    //   //this.getAccessToken();
    // } else {
    //   this.outTextVar = this.outTextVar + 'Error: token not received';
    // }
  }
}
