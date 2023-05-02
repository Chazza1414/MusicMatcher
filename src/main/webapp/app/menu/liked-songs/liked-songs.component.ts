import { Component, OnInit } from '@angular/core';
import { ISong } from '../../entities/song/song.model';
import { SongService } from '../../entities/song/service/song.service';
//import { Subscription } from 'rxjs';
import { InitialTrainingComponent } from '../../initial-training/initial-training.component';

@Component({
  selector: 'jhi-app-liked-songs',
  templateUrl: './liked-songs.component.html',
  styleUrls: ['./liked-songs.component.scss'],
})
/* eslint-disable @typescript-eslint/member-ordering */
export class LikedSongsComponent implements OnInit {
  public songInfoArray: any[] = [];
  currentlyPlayingIndex: number | null = null;
  //private likedSongsSubscription: Subscription;

  currentSong: { title: string; artist: string } | null = null;
  progress: number = 0;

  //private playingAudioElements: any[];
  private currentAudio: HTMLAudioElement | null = null;

  isPlaying(index: number): boolean {
    return this.currentlyPlayingIndex === index;
  }

  constructor(private songService: SongService, private initialComponent: InitialTrainingComponent) {}

  /*constructor(private songService: SongService) {
    this.likedSongsSubscription = this.songService.likedSongs$.subscribe(likedSongs => {
      if (likedSongs.length > 0) {
        this.songs = likedSongs;
      }
    });
  }*/

  async getSongInfo(spotifySongIds: string[], token: string): Promise<any[]> {
    const songInfoPromises = spotifySongIds.map(id => {
      const url = `https://api.spotify.com/v1/tracks/${id}`;
      return fetch(url, {
        method: 'GET',
        headers: { Authorization: 'Bearer ' + token },
      })
        .then(response => response.json())
        .then(data => {
          return {
            title: data.name,
            time: data.duration_ms,
            artist: data.artists[0].name,
            album: data.album.name,
            genre: data.genre,
            audio: data.preview_url,
          };
        });
    });

    return await Promise.all(songInfoPromises);
  }

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
    this.songService.queryLikedSongs().subscribe(data => {
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
  /*ngOnDestroy(): void {
    this.likedSongsSubscription.unsubscribe();
  }*/

  onPlayButtonClick(index?: number | null): void {
    if (index === undefined || index === null) {
      this.currentlyPlayingIndex = null;
      this.currentSong = null;
      if (this.currentAudio) {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
      }
    } else if (this.currentlyPlayingIndex === index) {
      this.currentlyPlayingIndex = null;
      this.currentSong = null;
      if (this.currentAudio) {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
      }
    } else {
      if (this.currentAudio) {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
      }
      this.currentlyPlayingIndex = index;
      if (this.currentSong) {
        // Add null check here
        this.currentSong.title = this.songInfoArray[index].title;
        this.currentSong.artist = this.songInfoArray[index].artist;
      }
      this.currentAudio = new Audio(this.songInfoArray[index].audio);
      this.currentAudio.play().catch(error => {
        console.log('Error playing audio:', error);
      });
      this.currentAudio.addEventListener('ended', () => {
        this.currentlyPlayingIndex = null;
        this.currentSong = null;
        this.progress = 0;
      });
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

  onAddToDislikedSongsButtonClick(song: ISong): void {
    this.songService.addDislikedSong(song);
    this.songService.removeLikedSong(song);
  }

  public getSongInfoArray(): any[] {
    return this.songInfoArray;
  }
}
/* eslint-enable @typescript-eslint/member-ordering */
