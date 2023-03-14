import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ILikedSong } from '../liked-song.model';

@Component({
  selector: 'jhi-liked-song-detail',
  templateUrl: './liked-song-detail.component.html',
})
export class LikedSongDetailComponent implements OnInit {
  likedSong: ILikedSong | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ likedSong }) => {
      this.likedSong = likedSong;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
