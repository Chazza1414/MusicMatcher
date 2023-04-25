import { Component, OnInit } from '@angular/core';
import { InitialTrainingComponent } from '../../initial-training/initial-training.component';
import { HttpClient, HttpParams } from '@angular/common/http';

let accessToken: string = '';
let refreshToken: string = '';
let image: string = '';

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

  async getRecom() {
    let previewUrl: string = '';
    console.log(this.initComp.returnSongRec());
    //console.log("Refresh token: " + refreshToken);
    const data = await this.getTrack(accessToken);
    console.log(data);

    //previewUrl = data.preview_url;
    image = data.album.images[0].url;
    console.log(previewUrl);
  }

  getAccessToken(refreshToken: string): string {
    try {
      let params2 = new HttpParams();
      params2 = params2.append('refreshtoken', refreshToken);
      //create the http get request to our api endpoint
      const req2 = this.http.get('/api/spotify/accesstoken', { responseType: 'text', params: params2 });

      req2.subscribe(data => {
        console.log('access token: ' + data);
        accessToken = data;
        //console.log("Access token: " + accessToken);
      });
    } catch (e) {
      console.log('error: ' + e);
    }

    return accessToken;
  }

  async getTrack(token: string): Promise<any> {
    let newUrl = 'https://api.spotify.com/v1/tracks/' + this.getTrackId();
    let result = await fetch(newUrl, { method: 'GET', headers: { Authorization: 'Bearer ' + token } });
    return await result.json();
  }

  outImage: string = image;

  ngOnInit(): void {
    this.getRefreshToken();
    this.getAccessToken(refreshToken);
    this.getRecom();
  }
}
