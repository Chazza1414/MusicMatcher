import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IDislikedSong } from '../disliked-song.model';

@Component({
  selector: 'jhi-disliked-song-detail',
  templateUrl: './disliked-song-detail.component.html',
})
export class DislikedSongDetailComponent implements OnInit {
  dislikedSong: IDislikedSong | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ dislikedSong }) => {
      this.dislikedSong = dislikedSong;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
