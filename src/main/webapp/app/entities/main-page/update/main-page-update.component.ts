import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { MainPageFormService, MainPageFormGroup } from './main-page-form.service';
import { IMainPage } from '../main-page.model';
import { MainPageService } from '../service/main-page.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

@Component({
  selector: 'jhi-main-page-update',
  templateUrl: './main-page-update.component.html',
})
export class MainPageUpdateComponent implements OnInit {
  isSaving = false;
  mainPage: IMainPage | null = null;

  usersSharedCollection: IUser[] = [];

  editForm: MainPageFormGroup = this.mainPageFormService.createMainPageFormGroup();

  constructor(
    protected mainPageService: MainPageService,
    protected mainPageFormService: MainPageFormService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ mainPage }) => {
      this.mainPage = mainPage;
      if (mainPage) {
        this.updateForm(mainPage);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const mainPage = this.mainPageFormService.getMainPage(this.editForm);
    if (mainPage.id !== null) {
      this.subscribeToSaveResponse(this.mainPageService.update(mainPage));
    } else {
      this.subscribeToSaveResponse(this.mainPageService.create(mainPage));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IMainPage>>): void {
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

  protected updateForm(mainPage: IMainPage): void {
    this.mainPage = mainPage;
    this.mainPageFormService.resetForm(this.editForm, mainPage);

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing<IUser>(this.usersSharedCollection, mainPage.user);
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing<IUser>(users, this.mainPage?.user)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));
  }
}
