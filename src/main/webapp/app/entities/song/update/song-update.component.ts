import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { SongFormService, SongFormGroup } from './song-form.service';
import { ISong } from '../song.model';
import { SongService } from '../service/song.service';
import { IMainPage } from 'app/entities/main-page/main-page.model';
import { MainPageService } from 'app/entities/main-page/service/main-page.service';

@Component({
  selector: 'jhi-song-update',
  templateUrl: './song-update.component.html',
})
export class SongUpdateComponent implements OnInit {
  isSaving = false;
  song: ISong | null = null;

  mainPagesSharedCollection: IMainPage[] = [];

  editForm: SongFormGroup = this.songFormService.createSongFormGroup();

  constructor(
    protected songService: SongService,
    protected songFormService: SongFormService,
    protected mainPageService: MainPageService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareMainPage = (o1: IMainPage | null, o2: IMainPage | null): boolean => this.mainPageService.compareMainPage(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ song }) => {
      this.song = song;
      if (song) {
        this.updateForm(song);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const song = this.songFormService.getSong(this.editForm);
    if (song.id !== null) {
      this.subscribeToSaveResponse(this.songService.update(song));
    } else {
      this.subscribeToSaveResponse(this.songService.create(song));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISong>>): void {
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

  protected updateForm(song: ISong): void {
    this.song = song;
    this.songFormService.resetForm(this.editForm, song);

    this.mainPagesSharedCollection = this.mainPageService.addMainPageToCollectionIfMissing<IMainPage>(
      this.mainPagesSharedCollection,
      song.mainPage
    );
  }

  protected loadRelationshipsOptions(): void {
    this.mainPageService
      .query()
      .pipe(map((res: HttpResponse<IMainPage[]>) => res.body ?? []))
      .pipe(
        map((mainPages: IMainPage[]) => this.mainPageService.addMainPageToCollectionIfMissing<IMainPage>(mainPages, this.song?.mainPage))
      )
      .subscribe((mainPages: IMainPage[]) => (this.mainPagesSharedCollection = mainPages));
  }
}
