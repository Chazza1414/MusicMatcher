import { Component } from '@angular/core';
import { ISong } from '../../entities/song/song.model';
import { SongService } from '../../entities/song/service/song.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'jhi-app-liked-songs',
  templateUrl: './liked-songs.component.html',
  styleUrls: ['./liked-songs.component.scss'],
})
/* eslint-disable @typescript-eslint/member-ordering */
export class LikedSongsComponent {
  currentlyPlayingIndex: number | null = null;
  private likedSongsSubscription: Subscription;

  currentSong: ISong | null = null;
  progress: number = 0;

  isPlaying(index: number): boolean {
    return this.currentlyPlayingIndex === index;
  }

  songs: ISong[] = [
    { id: 1, spotifySongId: null, songName: 'Song 1', spotifyArtistId: null, artistName: 'Artist 1', user: null },
    { id: 2, spotifySongId: null, songName: 'Song 2', spotifyArtistId: null, artistName: 'Artist 2', user: null },
    { id: 3, spotifySongId: null, songName: 'Song 3', spotifyArtistId: null, artistName: 'Artist 3', user: null },
    { id: 4, spotifySongId: null, songName: 'Song 4', spotifyArtistId: null, artistName: 'Artist 4', user: null },
    { id: 5, spotifySongId: null, songName: 'Song 5', spotifyArtistId: null, artistName: 'Artist 5', user: null },
    { id: 6, spotifySongId: null, songName: 'Song 6', spotifyArtistId: null, artistName: 'Artist 6', user: null },
    { id: 7, spotifySongId: null, songName: 'Song 7', spotifyArtistId: null, artistName: 'Artist 7', user: null },
    { id: 8, spotifySongId: null, songName: 'Song 8', spotifyArtistId: null, artistName: 'Artist 8', user: null },
    { id: 9, spotifySongId: null, songName: 'Song 9', spotifyArtistId: null, artistName: 'Artist 9', user: null },
    { id: 10, spotifySongId: null, songName: 'Song 10', spotifyArtistId: null, artistName: 'Artist 10', user: null },
    { id: 11, spotifySongId: null, songName: 'Song 11', spotifyArtistId: null, artistName: 'Artist 11', user: null },
    { id: 12, spotifySongId: null, songName: 'Song 12', spotifyArtistId: null, artistName: 'Artist 12', user: null },
    { id: 13, spotifySongId: null, songName: 'Song 13', spotifyArtistId: null, artistName: 'Artist 13', user: null },
    { id: 14, spotifySongId: null, songName: 'Song 14', spotifyArtistId: null, artistName: 'Artist 14', user: null },
    { id: 15, spotifySongId: null, songName: 'Song 15', spotifyArtistId: null, artistName: 'Artist 15', user: null },
  ]; //Dummy data

  constructor(private songService: SongService) {
    this.likedSongsSubscription = this.songService.likedSongs$.subscribe(likedSongs => {
      if (likedSongs.length > 0) {
        this.songs = likedSongs;
      }
    });
  }

  ngOnInit(): void {
    // this.songService.likedSongs$.subscribe((songs) => {
    //   this.songs = songs;
    // });
    this.songService.query({ eagerload: true }).subscribe(data => {
      console.log(data);
    });
  }
  ngOnDestroy(): void {
    this.likedSongsSubscription.unsubscribe();
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

  onAddToDislikedSongsButtonClick(song: ISong): void {
    this.songService.addDislikedSong(song);
    this.songService.removeLikedSong(song);
  }
}
/* eslint-enable @typescript-eslint/member-ordering */
