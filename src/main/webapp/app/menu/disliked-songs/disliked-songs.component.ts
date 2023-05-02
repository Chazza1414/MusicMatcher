import { Component, OnInit } from '@angular/core';
import { SongService } from '../../entities/song/service/song.service';
//import {BehaviorSubject, Subscription} from 'rxjs';
import {InitialTrainingComponent} from "../../initial-training/initial-training.component";
import {ISong} from "../../entities/song/song.model";
@Component({
  selector: 'jhi-app-disliked-songs',
  templateUrl: './disliked-songs.component.html',
  styleUrls: ['./disliked-songs.component.scss'],
})
/* eslint-disable @typescript-eslint/member-ordering */
export class DislikedSongsComponent implements OnInit{
  currentlyPlayingIndex: number | null = null;
  //private likedSongsSubscription: Subscription;

  currentSong: any;
  progress: number = 0;
  public songInfoArray: any[] = [];
  isPlaying(index: number): boolean {
    return this.currentlyPlayingIndex === index;
  }
  constructor(private songService: SongService, private initialComponent: InitialTrainingComponent) {}
//   constructor(private songService: SongService, private http: HttpClient) {
//     this.songsI = this.songsI.slice(0, 10);
//     this.dislikedSongsSubscription = this.songService.dislikedSongs$.subscribe(dislikedSongs => {
//       if (dislikedSongs.length > 0) {
//         while (dislikedSongs.length > 10) {
//           dislikedSongs.shift(); //replace .shift with .pop to remove the last element of this list
//         }
//         this.songsI = dislikedSongs;
//       }
//     });
// }
  async getSongInfo(spotifySongIds: string[], token: string): Promise<any[]> {
    const songInfoPromises = spotifySongIds.map(id => {
      const url = `https://api.spotify.com/v1/tracks/${id}`;
      return fetch(url, {
        method: 'GET',
        headers: {Authorization: 'Bearer ' + token},
      })
        .then(response => response.json())
        .then(data => {
          return {
            title: data.name,
            time: data.duration_ms,
            artist: data.artists[0].name,
            album: data.album.name,
            genre: data.genre,
          };
        });
    });
    return await Promise.all(songInfoPromises);
  }

//   async getSongInfo(songId: number, accessToken: string): Promise<IDislikedSong | null> {
//     const apiUrl = `https://api.spotify.com/v1/tracks/${songId}`;
//     const headers = {Authorization: `Bearer ${accessToken}`};
//
//     try {
//       const response: any = await this.http.get(apiUrl, {headers}).toPromise();
//
//       // Extract the required information
//       const songName = response.name;
//       const durationMs = response.duration_ms;
//       const albumName = response.album.name;
//       const artistName = response.artists.map((artist: any) => artist.name).join(', ');
//
//       // Fetch genre information from the first artist
//       const artistId = response.artists[0].id;
//       const artistApiUrl = `https://api.spotify.com/v1/artists/${artistId}`;
//       const artistResponse: any = await this.http.get(artistApiUrl, {headers}).toPromise();
//       const genre = artistResponse.genres;
//
//       const songInfo: IDislikedSong = {
//         id: songId,
//         name: songName,
//         duration: durationMs,
//         album: albumName,
//         artist: artistName,
//         genre: genre,
//       };
//
//       return songInfo;
//     } catch (error) {
//       console.error('Error fetching song info:', error);
//       return null;
//     }
//   }

  formatTime(songInfoArray: any[]) {
    for (let i = 0; i < songInfoArray.length; i++) {
      const durationInMs = songInfoArray[i].time;
      const minutes = Math.floor(durationInMs / 60000);
      const seconds = ((durationInMs % 60000) / 1000).toFixed(0);
      songInfoArray[i].time = `${minutes}:${+seconds < 10 ? '0' : ''}${seconds}`;

      if (!songInfoArray[i].genre) {
        songInfoArray[i].genre = 'Unknown';
      }
    }
    return songInfoArray;
  }
  ngOnInit(): void {
    let token = this.initialComponent.outAccessToken;
    this.songService.queryDislikedSongs().subscribe(data => {
      if (data && data.body) {
        const spotifySongIds = data.body.map((song: ISong) => song.spotifySongId);
        const spotifySongIdsFiltered = spotifySongIds.filter(id => id !== null && id !== undefined) as string[];
        this.getSongInfo(spotifySongIdsFiltered, token).then(songInfoArray => {
          this.songInfoArray = this.formatTime(songInfoArray);
          console.log(this.songInfoArray);
        });
      }
    });
  }

  // ngOnDestroy(): void {
  //   this.dislikedSongsSubscription.unsubscribe();
  // }

  // addLikedSong(song: IDislikedSong): void {
  //   const currentSongs = this._likedSongs.getValue();
  //   this._likedSongs.next([...currentSongs, song]);
  // }
  // removeDislikedSong(song: IDislikedSong): void {
  //   const currentSongs = this._dislikedSongs.getValue();
  //   this._dislikedSongs.next(currentSongs.filter((s) => s.id !== song.id));
  // }


  onPlayButtonClick(index?: number | null): void {
    if (index === undefined || index === null) {
      this.currentlyPlayingIndex = null;
      this.currentSong = null;
    } else if (this.currentlyPlayingIndex === index) {
      this.currentlyPlayingIndex = null;
      this.currentSong = null;
    } else {
      this.currentlyPlayingIndex = index;
      this.currentSong = this.songInfoArray[index];
    }
    this.progress = 0; // Initialize progress to 0
    // Update progress with a fake value for demonstration purposes
    if (this.currentSong) {
      setInterval(() => {
        this.progress += 1;
        if (this.progress > 100) {
          this.progress = 0;
        }
      }, 500);
    }
  }

  onAddToLikedSongsButtonClick(song: ISong): void {
    this.songService.addLikedSong(song);
    this.songService.removeDislikedSong(song);
  }

  public getSongInfoArray(): any[] {
    return this.songInfoArray;
  }
}
/* eslint-enable @typescript-eslint/member-ordering */
