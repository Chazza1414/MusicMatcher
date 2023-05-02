import { Component, OnInit, HostListener } from '@angular/core';
import { InitialTrainingComponent } from '../../initial-training/initial-training.component';
import { HttpClient, HttpParams } from '@angular/common/http';
import { waitForAsync } from '@angular/core/testing';
import { ISong, NewSong } from '../../entities/song/song.model';
import { RecommendService } from '../../initial-training/recommend.service';
import { AccountService } from '../../core/auth/account.service';

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

const seedGenreArray: string[] = [
  'acoustic',
  'afrobeat',
  'alt-rock',
  'alternative',
  'ambient',
  'anime',
  'black-metal',
  'bluegrass',
  'blues',
  'bossanova',
  'brazil',
  'breakbeat',
  'british',
  'cantopop',
  'chicago-house',
  'children',
  'chill',
  'classical',
  'club',
  'comedy',
  'country',
  'dance',
  'dancehall',
  'death-metal',
  'deep-house',
  'detroit-techno',
  'disco',
  'disney',
  'drum-and-bass',
  'dub',
  'dubstep',
  'edm',
  'electro',
  'electronic',
  'emo',
  'folk',
  'forro',
  'french',
  'funk',
  'garage',
  'german',
  'gospel',
  'goth',
  'grindcore',
  'groove',
  'grunge',
  'guitar',
  'happy',
  'hard-rock',
  'hardcore',
  'hardstyle',
  'heavy-metal',
  'hip-hop',
  'holidays',
  'honky-tonk',
  'house',
  'idm',
  'indian',
  'indie',
  'indie-pop',
  'industrial',
  'iranian',
  'j-dance',
  'j-idol',
  'j-pop',
  'j-rock',
  'jazz',
  'k-pop',
  'kids',
  'latin',
  'latino',
  'malay',
  'mandopop',
  'metal',
  'metal-misc',
  'metalcore',
  'minimal-techno',
  'movies',
  'mpb',
  'new-age',
  'new-release',
  'opera',
  'pagode',
  'party',
  'philippines-opm',
  'piano',
  'pop',
  'pop-film',
  'post-dubstep',
  'power-pop',
  'progressive-house',
  'psych-rock',
  'punk',
  'punk-rock',
  'r-n-b',
  'rainy-day',
  'reggae',
  'reggaeton',
  'road-trip',
  'rock',
  'rock-n-roll',
  'rockabilly',
  'romance',
  'sad',
  'salsa',
  'samba',
  'sertanejo',
  'show-tunes',
  'singer-songwriter',
  'ska',
  'sleep',
  'songwriter',
  'soul',
  'soundtracks',
  'spanish',
  'study',
  'summer',
  'swedish',
  'synth-pop',
  'tango',
  'techno',
  'trance',
  'trip-hop',
  'turkish',
  'work-out',
  'world-music',
];

//let accessToken: string = '';
let refreshToken: string = '';
let image: string = '';
let artist: string = '';
let title: string = '';
let previewUrl: string = '';
let currentId: string = '';
let currentArtistId: string = '';
let prevPreview: HTMLAudioElement;
let firstSong: boolean = false;
//let counter: number = 0;

@Component({
  selector: 'jhi-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent implements OnInit {
  constructor(
    private initComp: InitialTrainingComponent,
    private http: HttpClient,
    private recommendService: RecommendService,
    private accountService: AccountService
  ) {}
  likeButtonPressed = false;
  dislikeButtonPressed = false;

  likePressed(): void {
    this.likeButtonPressed = true;
    this.dislikeButtonPressed = false;

    let newSong: NewSong = { id: null, spotifySongId: currentId, spotifyArtistId: currentArtistId, artistName: 'null', songName: 'liked' };
    let username: string = '';
    let userId: number = 0;

    this.accountService.identity().subscribe(data => {
      // @ts-ignore
      username = data.login;
      // @ts-ignore
      userId = data.id;

      newSong.user = { id: userId, login: username };

      let req = this.http.post<ISong>('/api/songs', newSong, { observe: 'response' });
      req.subscribe(data => {
        console.log('' + data);
        console.log('Song added, getting new song');
        this.newLoad();
      });
    });

    console.log('Like Pressed!');
  }

  dislikePressed(): void {
    this.likeButtonPressed = false;
    this.dislikeButtonPressed = true;

    let newSong: NewSong = {
      id: null,
      spotifySongId: currentId,
      spotifyArtistId: currentArtistId,
      artistName: 'null',
      songName: 'disliked',
    };
    let username: string = '';
    let userId: number = 0;

    this.accountService.identity().subscribe(data => {
      // @ts-ignore
      username = data.login;
      // @ts-ignore
      userId = data.id;

      newSong.user = { id: userId, login: username };

      let req = this.http.post<ISong>('/api/songs', newSong, { observe: 'response' });
      req.subscribe(data => {
        console.log('' + data);
        console.log('Song added, getting new song');
        this.newLoad();
      });
    });

    console.log('Dislike Pressed!');
  }

  getRefreshToken() {
    refreshToken = this.initComp.returnRefreshToken();
    console.log('Refresh Token:' + refreshToken);
  }

  getTrackId(): string {
    let trackId: string = this.initComp.returnSongRec();
    return trackId;
  }

  // async getRecom(accessToken: string) {
  //   let previewUrl: string = '';
  //   let collected: boolean = false;
  //   console.log(this.initComp.returnSongRec());
  //   //console.log("Refresh token: " + refreshToken);
  //   console.log('accessToken is from getRecom: ' + accessToken);
  //   const data = await this.getTrack(accessToken);
  //   console.log(data);
  //   return data;

  /*image = data.album.images[0].url;
    console.log('image url: ' + image);
    for (let i = 0; i < data.artists.length; i++) {
      if (i == 0) artist = data.artists[0].name;
      else artist = artist + ', ' + data.artists[i].name;
    }
    console.log('Artists are: ' + artist);

    title = data.name;
    console.log('Song name is: ' + title);

    previewUrl = data.preview_url;
    //previewUrl = 'https://p.scdn.co/mp3-preview/8589bc33c59716cb36846da5615fee1f3b6a615e?cid=420af6bafdcf44398328b920c4c7dd97'
    console.log('Preview url is: ' + previewUrl);

    collected = true;

    return collected;*/
  //}

  async getAccessToken(refreshToken: string): Promise<string> {
    let params2 = new HttpParams();
    let token = 'wrong';
    params2 = params2.append('refreshtoken', refreshToken);
    //create the http get request to our api endpoint
    const req2 = this.http.get('/api/spotify/accesstoken', { responseType: 'text', params: params2 });

    req2.subscribe(data => {
      console.log('access token from getAccess: ' + data);
      //accessToken = data;
      token = data;

      //console.log("Access token: " + accessToken);
      return data;
    });
    return token;
  }

  async getTrack(token: string, songId: string): Promise<any> {
    let newUrl = 'https://api.spotify.com/v1/tracks/' + songId;
    console.log('token is: ' + token);
    let result = await fetch(newUrl, { method: 'GET', headers: { Authorization: 'Bearer ' + token } });
    /*console.log("result from getTrack is: " + await result.json().then(data => {
      console.log("data=" + data.toString());
    }));*/
    return await result.json();
  }

  outImage: string = image;
  outArtist: string = artist;
  outTitle: string = title;
  outPreview: string = '';
  //outPreview: string = previewUrl;
  /*outImage: string = '';
  outArtist: string = '';
  outTitle: string = '';
  outPreview: string = '';*/

  dataLoaded: Promise<boolean> = this.isDataLoaded();

  async isDataLoaded() {
    let counter: number = 0;
    let allAssign: boolean = false;

    this.outImage = image;
    counter++;
    this.outArtist = artist;
    counter++;
    this.outTitle = title;
    counter++;
    //this.outPreview = 'https://p.scdn.co/mp3-preview/1d1ee7f7728856cbf44b2957b85fdfd69a83904b?cid=420af6bafdcf44398328b920c4c7dd97';
    counter++;

    if (counter == 4) allAssign = true;
    console.log('data loaded');

    return allAssign;
  }

  populateAlbum(song: any) {
    if (song.album.images[0]) {
      // const albumImage = new Image(300, 300);
      // albumImage.src = song.album.images[0].url;
      // document.getElementById('musicCover')!.appendChild(albumImage);
      // console.log('album loaded');
      this.outImage = song.album.images[0].url;
    }
    //document.getElementById('imgUrl')!.innerText = song.album.images[0]?.url ?? '(no ablum image)';
  }

  populateArtist(song: any) {
    let artist: string = '';
    if (song.artists[0]) {
      for (let i = 0; i < song.artists.length; i++) {
        if (i == 0) artist = song.artists[0].name;
        else artist = artist + ', ' + song.artists[i].name;
      }
      console.log('Artists are: ' + artist);
    }
    document.getElementById('artists')!.innerText = artist;
  }

  populateTitle(song: any) {
    if (song.name) {
      title = song.name;
    }
    document.getElementById('title')!.innerText = title;
    console.log('Song name is: ' + title);
  }

  populatePreview(song: any): HTMLAudioElement {
    //if (song.preview_url) {
    if (firstSong) prevPreview.pause();
    const playback = new Audio(song.preview_url);
    playback.src = song.preview_url;
    document.getElementById('previewUrl')!.appendChild(playback);
    console.log('playback loaded');
    playback.play();
    firstSong = true;
    return playback;

    // let url: string = song.preview_url;
    // console.log("preview url is: " + url);
    // this.outPreview = url;
    //}
  }

  enterArtistId(song: any) {
    if (song.artists[0].id) {
      currentArtistId = song.artists[0].id;
      console.log('Artist id is: ' + currentArtistId);
    }
  }

  newLoad(): void {
    let accessToken = this.initComp.returnAccessToken();
    //console.log("access token: " + accessToken);

    let songList: NewSong[] = [];
    let genres: string[] = [];
    let songId: string = '';
    const req = this.http.get('/api/mainpagesongs', { responseType: 'json' });
    req.subscribe((data: Object) => {
      songList = data as NewSong[];
      //console.log(songList);
      this.recommendService.getAllArtistGenres(accessToken, songList).then(data => {
        genres = data;
        //console.log(genres);
        let useableGenreArray: string[] = [];
        for (let i = 0; i < genres.length; i++) {
          if (seedGenreArray.includes(genres[i])) {
            useableGenreArray.push(genres[i]);
          }
        }
        let userMP: musicProfile = this.initComp.returnUMP();
        //console.log("user music profile: " + userMP);
        this.recommendService.mainPageRec(accessToken, songList, useableGenreArray, userMP).then(data => {
          songId = data;
          currentId = songId;
          console.log(songId);
          this.getTrack(accessToken, songId).then(data => {
            let songData: any = data;
            console.log(data);
            this.populateAlbum(songData);
            this.populateArtist(songData);
            this.populateTitle(songData);
            prevPreview = this.populatePreview(songData);
            this.enterArtistId(songData);
          });
        });
      });
    });
  }

  ngOnInit(): void {
    //let accessToken = "";
    //this.getRefreshToken();
    // this.getAccessToken(refreshToken).then(data => {
    //   //accessToken = data;
    //   console.log("on init access token" + data);
    //   this.getRecom(data);
    // });

    this.newLoad();

    // let accessToken = this.initComp.returnAccessToken();
    // let userMP: musicProfile = this.initComp.returnUMP();
    // let songList: NewSong[] = [];
    // let genres: string[] = [];
    // let songId: string = '';
    // const req = this.http.get('/api/mainpagesongs', { responseType: 'json' });
    // req.subscribe((data: Object) => {
    //   songList = data as NewSong[];
    //   console.log(songList);
    //   this.recommendService.getAllArtistGenres(accessToken, songList).then(data => {
    //     genres = data;
    //     console.log(genres);
    //     let useableGenreArray: string[] = [];
    //     for (let i = 0; i < genres.length; i++) {
    //       if (seedGenreArray.includes(genres[i])) {
    //         useableGenreArray.push(genres[i]);
    //       }
    //     }
    //     this.recommendService.mainPageRec(accessToken, songList, useableGenreArray, userMP).then(data => {
    //       songId = data;
    //       console.log(songId);
    //       this.getTrack(accessToken, songId).then(data => {
    //         let songData: any = data;
    //         console.log(data);
    //         this.populateAlbum(songData);
    //         this.populateArtist(songData);
    //         this.populateTitle(songData);
    //         this.populatePreview(songData);
    //       });
    //     });
    //   });
    // });

    /*this.getRecom(accessToken).then(data => this.populateAlbum(data));
    this.getRecom(accessToken).then(data => this.populateArtist(data));
    this.getRecom(accessToken).then(data => this.populateTitle(data));
    this.getRecom(accessToken).then(data => this.populatePreview(data));*/

    //let dataCollected: Promise<boolean> = this.getRecom(accessToken)
    //waitForAsync(this.getRecom);
    //this.isDataLoaded();

    /*this.outImage = image;
    this.outArtist = artist;
    this.outTitle = title;
    this.outPreview = previewUrl;*/
  }

  // Function to handle key presses
  @HostListener('window:keydown', ['$event'])
  handleKeyPress(event: KeyboardEvent): void {
    if (event.key === 'ArrowLeft') {
      //document.getElementById('like-button')?.click();
      //this.toggleActiveButton('like-button');
      this.likePressed();
    } else if (event.key === 'ArrowRight') {
      //document.getElementById('dislike-button')?.click();
      //this.toggleActiveButton('dislike-button');
      this.dislikePressed();
    }
  }
  /*
  // Function to handle Like button press
  likePressed(): void {
    console.log('Pressed! (Like)');
  }

  // Function to handle Dislike button press
  dislikePressed(): void {
    console.log('Pressed! (Dislike)');
  }

  */
}
