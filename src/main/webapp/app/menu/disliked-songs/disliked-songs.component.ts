import { Component } from '@angular/core';
import { ISong } from '../../entities/song/song.model';
import { SongService } from '../../entities/song/service/song.service';
import { Subscription } from 'rxjs';




@Component({
  selector: 'jhi-app-disliked-songs',
  templateUrl: './disliked-songs.component.html',
  styleUrls: ['./disliked-songs.component.scss'],
})
/* eslint-disable @typescript-eslint/member-ordering */
export class DislikedSongsComponent {
  currentlyPlayingIndex: number | null = null;
  private dislikedSongsSubscription: Subscription;

  currentSong: ISong | null = null;
  progress: number = 0;

  isPlaying(index: number): boolean {
    return this.currentlyPlayingIndex === index;
  }

  songs: ISong[] = [
    {id: 1, spotifySongId: null, songName: 'Song 1', spotifyArtistId: null, artistName: 'Artist 1', user: null,},
    {id: 2, spotifySongId: null, songName: 'Song 2', spotifyArtistId: null, artistName: 'Artist 2', user: null,},
    {id: 3, spotifySongId: null, songName: 'Song 3', spotifyArtistId: null, artistName: 'Artist 3', user: null,},
    {id: 4, spotifySongId: null, songName: 'Song 4', spotifyArtistId: null, artistName: 'Artist 4', user: null,},
    {id: 5, spotifySongId: null, songName: 'Song 5', spotifyArtistId: null, artistName: 'Artist 5', user: null,},
    {id: 6, spotifySongId: null, songName: 'Song 6', spotifyArtistId: null, artistName: 'Artist 6', user: null,},
    {id: 7, spotifySongId: null, songName: 'Song 7', spotifyArtistId: null, artistName: 'Artist 7', user: null,},
    {id: 8, spotifySongId: null, songName: 'Song 8', spotifyArtistId: null, artistName: 'Artist 8', user: null,},
    {id: 9, spotifySongId: null, songName: 'Song 9', spotifyArtistId: null, artistName: 'Artist 9', user: null,},
    {id: 10, spotifySongId: null, songName: 'Song 10', spotifyArtistId: null, artistName: 'Artist 10', user: null,}
  ];//Dummy data

  constructor(private songService: SongService) {
    this.dislikedSongsSubscription = this.songService.dislikedSongs$.subscribe((dislikedSongs) => {
      if (dislikedSongs.length > 0) {
        this.songs = dislikedSongs;
      }
    })
  }

  ngOnInit(): void {
    // this.songService.dislikedSongs$.subscribe((songs) => {
    //   this.songs = songs;
    // });
    this.songService.query({eagerload: true}).subscribe(data => {
      console.log(data);
    })
  }
  ngOnDestroy(): void {
    this.dislikedSongsSubscription.unsubscribe();
  }

  onPlayButtonClick(index?: number | null): void {
    if (index === undefined || index === null) {
      this.currentlyPlayingIndex = null;
      this.currentSong = null;
    } else if (this.currentlyPlayingIndex === index) {
      this.currentlyPlayingIndex = null;
      this.currentSong = null;
    } else {
      this.currentlyPlayingIndex = index;
      this.currentSong = this.songs[index];
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
}
/* eslint-enable @typescript-eslint/member-ordering */
