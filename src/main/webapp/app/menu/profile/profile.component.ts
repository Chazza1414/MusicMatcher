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

  ngOnInit(): void {
    this.fetchProfile(this.InitialComponent.outAccessToken).then(data => this.populateUI(data));

    var myChart = new Chart('myChart', {
      type: 'pie',
      data: {
        labels: ['Ariana Grande', 'Justin Bieber', 'Adele'],
        datasets: [
          {
            label: 'Songs',
            data: [12, 19, 3],
            backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)'],
            borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)'],
            borderWidth: 1,
          },
        ],
      },
      options: {
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    });

    var genreChart = new Chart('genreChart', {
      type: 'pie',
      data: {
        labels: ['Pop', 'Rock', 'Romantic'],
        datasets: [
          {
            label: '# of Songs',
            data: [21, 15, 5],
            backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)'],
            borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)'],
            borderWidth: 1,
          },
        ],
      },
      options: {
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    });

    this.accountService
      .getAuthenticationState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(account => (this.account = account));
  }

  login(): void {
    this.router.navigate(['/login']);
  }
}
