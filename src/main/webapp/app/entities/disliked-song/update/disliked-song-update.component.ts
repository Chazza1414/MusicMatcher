import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { DislikedSongFormService, DislikedSongFormGroup } from './disliked-song-form.service';
import { IDislikedSong } from '../disliked-song.model';
import { DislikedSongService } from '../service/disliked-song.service';

@Component({
  selector: 'jhi-disliked-song-update',
  templateUrl: './disliked-song-update.component.html',
})
export class DislikedSongUpdateComponent implements OnInit {
  isSaving = false;
  dislikedSong: IDislikedSong | null = null;

  editForm: DislikedSongFormGroup = this.dislikedSongFormService.createDislikedSongFormGroup();

  constructor(
    protected dislikedSongService: DislikedSongService,
    protected dislikedSongFormService: DislikedSongFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ dislikedSong }) => {
      this.dislikedSong = dislikedSong;
      if (dislikedSong) {
        this.updateForm(dislikedSong);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const dislikedSong = this.dislikedSongFormService.getDislikedSong(this.editForm);
    if (dislikedSong.id !== null) {
      this.subscribeToSaveResponse(this.dislikedSongService.update(dislikedSong));
    } else {
      this.subscribeToSaveResponse(this.dislikedSongService.create(dislikedSong));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IDislikedSong>>): void {
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

  protected updateForm(dislikedSong: IDislikedSong): void {
    this.dislikedSong = dislikedSong;
    this.dislikedSongFormService.resetForm(this.editForm, dislikedSong);
  }
}
