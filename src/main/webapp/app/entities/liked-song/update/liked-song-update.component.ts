import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { LikedSongFormService, LikedSongFormGroup } from './liked-song-form.service';
import { ILikedSong } from '../liked-song.model';
import { LikedSongService } from '../service/liked-song.service';

@Component({
  selector: 'jhi-liked-song-update',
  templateUrl: './liked-song-update.component.html',
})
export class LikedSongUpdateComponent implements OnInit {
  isSaving = false;
  likedSong: ILikedSong | null = null;

  editForm: LikedSongFormGroup = this.likedSongFormService.createLikedSongFormGroup();

  constructor(
    protected likedSongService: LikedSongService,
    protected likedSongFormService: LikedSongFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ likedSong }) => {
      this.likedSong = likedSong;
      if (likedSong) {
        this.updateForm(likedSong);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const likedSong = this.likedSongFormService.getLikedSong(this.editForm);
    if (likedSong.id !== null) {
      this.subscribeToSaveResponse(this.likedSongService.update(likedSong));
    } else {
      this.subscribeToSaveResponse(this.likedSongService.create(likedSong));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ILikedSong>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(likedSong: ILikedSong): void {
    this.likedSong = likedSong;
    this.likedSongFormService.resetForm(this.editForm, likedSong);
  }
}
