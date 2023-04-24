import { Component } from '@angular/core';

@Component({
  selector: 'app-disliked-songs',
  templateUrl: './disliked-songs.component.html',
  styleUrls: ['./disliked-songs.component.scss'],
})
export class DislikedSongsComponent {
  currentlyPlayingIndex: number | null = null;

  constructor() {}

  onPlayButtonClick(index: number): void {
    if (this.currentlyPlayingIndex === index) {
      this.currentlyPlayingIndex = null; // Stop the currently playing song
    } else {
      this.currentlyPlayingIndex = index; // Set the new currently playing song
    }
  }

  onAddToLikedSongsButtonClick(): void {
    console.log('Add to liked songs button clicked');
  }
}
