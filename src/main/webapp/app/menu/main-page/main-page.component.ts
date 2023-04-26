import { Component, OnInit } from '@angular/core';
import { InitialTrainingComponent } from '../../initial-training/initial-training.component';
import { HttpClient, HttpParams } from '@angular/common/http';

//let accessToken: string = '';
let refreshToken: string = '';
let image: string = '';
let artist: string = '';
let title: string = '';
let previewUrl: string = '';

@Component({
  selector: 'jhi-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent implements OnInit {
  constructor(private initComp: InitialTrainingComponent, private http: HttpClient) {}

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
    console.log(this.initComp.returnSongRec());
    //console.log("Refresh token: " + refreshToken);
    console.log('accessToken is from getRecom: ' + accessToken);
    const data = await this.getTrack(accessToken);
    console.log(data);

    image = data.album.images[0].url;
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

  ngOnInit(): void {
    //let accessToken = "";
    //this.getRefreshToken();
    // this.getAccessToken(refreshToken).then(data => {
    //   //accessToken = data;
    //   console.log("on init access token" + data);
    //   this.getRecom(data);
    // });
    let accessToken = this.initComp.returnAccessToken();
    this.getRecom(accessToken);

    /*this.outImage = image;
    this.outArtist = artist;
    this.outTitle = title;
    this.outPreview = previewUrl;*/
  }
}
