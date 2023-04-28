import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
import { InitialTrainingComponent } from '../../initial-training/initial-training.component';

//For present user account
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { SpotifyWebApi } from 'spotify-web-api-ts';

interface topArtist {
  name: string;
  image_url: string;
  popularity: number;
  id: string;
}

interface topTrack {
  name: string;
  image_url: string;
  popularity: number;
  id: string;
}

@Component({
  selector: 'jhi-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  account: Account | null = null;

  private readonly destroy$ = new Subject<void>();

  constructor(private accountService: AccountService, private router: Router, private InitialComponent: InitialTrainingComponent) {}

  //Fetch user's profile from Spotify
  async fetchProfile(token: string): Promise<any> {
    const result = await fetch('https://api.spotify.com/v1/me', {
      method: 'GET',
      headers: { Authorization: 'Bearer ' + token },
    });
    return await result.json();
  }
  populateUI(profile: any) {
    if (profile.images[0]) {
      const profileImage = new Image(106, 106);
      profileImage.src = profile.images[0].url;
      document.getElementById('avatar')!.appendChild(profileImage);
    }
    document.getElementById('imgUrl')!.innerText = profile.images[0]?.url ?? '(no profile image)';
  }

  async fetchTopArtists(token: string): Promise<any> {
    const result = await fetch('https://api.spotify.com/v1/me/top/artists', {
      method: 'GET',
      headers: { Authorization: 'Bearer ' + token },
    });
    return await result.json();
  }

  populateTop1Artists(topArtists: any) {
    if (topArtists.items[0].images[0]) {
      const topImage = new Image(106, 106);
      topImage.src = topArtists.items[0].images[0].url;
      document.getElementById('topImage1')!.appendChild(topImage);
    }
    document.getElementById('topArtist1')!.innerText = topArtists.items[0].name;
  }

  populateTop2Artists(topArtists: any) {
    if (topArtists.items[1].images[0]) {
      const topImage = new Image(106, 106);
      topImage.src = topArtists.items[1].images[0].url;
      document.getElementById('topImage2')!.appendChild(topImage);
    }
    document.getElementById('topArtist2')!.innerText = topArtists.items[1].name;
  }

  populateTop3Artists(topArtists: any) {
    if (topArtists.items[2].images[0]) {
      const topImage = new Image(106, 106);
      topImage.src = topArtists.items[2].images[0].url;
      document.getElementById('topImage3')!.appendChild(topImage);
    }
    document.getElementById('topArtist3')!.innerText = topArtists.items[2].name;
  }

  async fetchTopTracks(token: string): Promise<any> {
    const result = await fetch('https://api.spotify.com/v1/me/top/tracks', {
      method: 'GET',
      headers: { Authorization: 'Bearer ' + token },
    });
    return await result.json();
  }

  populateTop1Tracks(topTracks: any) {
    if (topTracks.items[0].album.images[0]) {
      const topImage = new Image(106, 106);
      topImage.src = topTracks.items[0].album.images[0].url;
      document.getElementById('track1')!.appendChild(topImage);
    }
    document.getElementById('topTrack1')!.innerText = topTracks.items[0].name;
  }

  populateTop2Tracks(topTracks: any) {
    if (topTracks.items[1].album.images[0]) {
      const topImage = new Image(106, 106);
      topImage.src = topTracks.items[1].album.images[0].url;
      document.getElementById('track2')!.appendChild(topImage);
    }
    document.getElementById('topTrack2')!.innerText = topTracks.items[1].name;
  }

  populateTop3Tracks(topTracks: any) {
    if (topTracks.items[2].album.images[0]) {
      const topImage = new Image(106, 106);
      topImage.src = topTracks.items[2].album.images[0].url;
      document.getElementById('track3')!.appendChild(topImage);
    }
    document.getElementById('topTrack3')!.innerText = topTracks.items[2].name;
  }

  async fetchTopMoreTracks(token: string): Promise<topTrack[]> {
    const result = await fetch('https://api.spotify.com/v1/me/top/tracks', {
      method: 'GET',
      headers: { Authorization: 'Bearer ' + token },
    });
    const data = await result.json();
    return data.items.map((item: any) => {
      return {
        name: item.name,
        image_url: item.album.images[0].url,
        popularity: item.popularity,
        id: item.id,
      };
    });
  }

  async createChart() {
    const topTracks = await this.fetchTopMoreTracks(this.InitialComponent.outAccessToken);
    const trackNames = topTracks.map(track => track.name);
    const popularityScores = topTracks.map(track => track.popularity);
    const chartData = {
      labels: trackNames,
      datasets: [
        {
          label: 'Popularity Score',
          data: popularityScores,
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgba(54, 162, 235, 1)',
        },
      ],
    };
    const chartOptions = {
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
        },
      },
    };
    const ctx = document.getElementById('myChart') as HTMLCanvasElement;
    const myChart = new Chart(ctx, {
      type: 'pie',
      data: chartData,
      options: {
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    });
  }

  async fetchTopMoreArtist(token: string): Promise<topTrack[]> {
    const result = await fetch('https://api.spotify.com/v1/me/top/artists', {
      method: 'GET',
      headers: { Authorization: 'Bearer ' + token },
    });
    const data = await result.json();
    return data.items.map((item: any) => {
      return {
        name: item.name,
        image_url: item.images[0].url,
        popularity: item.popularity,
        id: item.id,
      };
    });
  }

  async createArtistChart() {
    const topArtists = await this.fetchTopMoreArtist(this.InitialComponent.outAccessToken);
    const artistNames = topArtists.map(artist => artist.name);
    const popularityScores = topArtists.map(artist => artist.popularity);
    const chartData = {
      labels: artistNames,
      datasets: [
        {
          label: 'Popularity Score',
          data: popularityScores,
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgba(54, 162, 235, 1)',
          fontColor: 'white',
        },
      ],
    };
    const chartOptions = {
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
        },
      },
    };
    const ctx = document.getElementById('myChart1') as HTMLCanvasElement;
    const myChart = new Chart(ctx, {
      type: 'pie',
      data: chartData,
      options: {
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    });
  }

  ngOnInit(): void {
    this.fetchProfile(this.InitialComponent.outAccessToken).then(data => this.populateUI(data));
    this.fetchTopArtists(this.InitialComponent.outAccessToken).then(data => this.populateTop1Artists(data));
    this.fetchTopArtists(this.InitialComponent.outAccessToken).then(data => this.populateTop2Artists(data));
    this.fetchTopTracks(this.InitialComponent.outAccessToken).then(data => this.populateTop1Tracks(data));
    this.fetchTopTracks(this.InitialComponent.outAccessToken).then(data => this.populateTop2Tracks(data));
    this.fetchTopTracks(this.InitialComponent.outAccessToken).then(data => this.populateTop3Tracks(data));
    this.createChart();
    this.createArtistChart();

    this.accountService
      .getAuthenticationState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(account => (this.account = account));
  }

  login(): void {
    this.router.navigate(['/login']);
  }
}
