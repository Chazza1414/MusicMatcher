import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IMainPage } from '../main-page.model';

@Component({
  selector: 'jhi-main-page-detail',
  templateUrl: './main-page-detail.component.html',
})
export class MainPageDetailComponent implements OnInit {
  mainPage: IMainPage | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ mainPage }) => {
      this.mainPage = mainPage;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
