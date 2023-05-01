import { Component, OnInit, HostListener } from '@angular/core';
import { InitialTrainingComponent } from '../../initial-training/initial-training.component';
import { HttpClient, HttpParams } from '@angular/common/http';
import { waitForAsync } from '@angular/core/testing';

//let accessToken: string = '';
let refreshToken: string = '';
let image: string = '';
let artist: string = '';
let title: string = '';
let previewUrl: string = '';
//let counter: number = 0;

@Component({
  selector: 'jhi-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent implements OnInit {
  constructor(private initComp: InitialTrainingComponent, private http: HttpClient) {}
  likeButtonPressed = false;
  dislikeButtonPressed = false;

  likePressed(): void {
    this.likeButtonPressed = true;
    this.dislikeButtonPressed = false;
    console.log('Like Pressed!');
  }

  dislikePressed(): void {
    this.likeButtonPressed = false;
    this.dislikeButtonPressed = true;
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

  async getRecom(accessToken: string) {
    let previewUrl: string = '';
    let collected: boolean = false;
    console.log(this.initComp.returnSongRec());
    //console.log("Refresh token: " + refreshToken);
    console.log('accessToken is from getRecom: ' + accessToken);
    const data = await this.getTrack(accessToken);
    console.log(data);
    return data;

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
  }

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

  async getTrack(token: string): Promise<any> {
    let newUrl = 'https://api.spotify.com/v1/tracks/' + this.getTrackId();
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
  outPreview: string = 'https://p.scdn.co/mp3-preview/8589bc33c59716cb36846da5615fee1f3b6a615e?cid=420af6bafdcf44398328b920c4c7dd97';
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
    this.outPreview = 'https://p.scdn.co/mp3-preview/1d1ee7f7728856cbf44b2957b85fdfd69a83904b?cid=420af6bafdcf44398328b920c4c7dd97';
    counter++;

    if (counter == 4) allAssign = true;
    console.log('data loaded');

    return allAssign;
  }

  populateAlbum(song: any) {
    if (song.album.images[0]) {
      const albumImage = new Image(300, 300);
      albumImage.src = song.album.images[0].url;
      document.getElementById('musicCover')!.appendChild(albumImage);
      console.log('album loaded');
    }
    document.getElementById('imgUrl')!.innerText = song.album.images[0]?.url ?? '(no ablum image)';
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

  populatePreview(song: any) {
    if (song.preview_url) {
      const playback = new Audio(song.preview_url);
      playback.src = song.preview_url;
      document.getElementById('previewUrl')!.appendChild(playback);
      console.log('playback loaded');
      playback.play();
    }
  }

  ngOnInit(): void {
    //let accessToken = "";
    //this.getRefreshToken();
    // this.getAccessToken(refreshToken).then(data => {
    //   //accessToken = data;
    //   console.log("on init access token" + data);
    //   this.getRecom(data);
    // });
    let accessToken = this.initComp.returnAccessToken();
    this.getRecom(accessToken).then(data => this.populateAlbum(data));
    this.getRecom(accessToken).then(data => this.populateArtist(data));
    this.getRecom(accessToken).then(data => this.populateTitle(data));
    this.getRecom(accessToken).then(data => this.populatePreview(data));

    //let dataCollected: Promise<boolean> = this.getRecom(accessToken)
    //waitForAsync(this.getRecom);
    this.isDataLoaded();
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
