import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { SongFormService } from './song-form.service';
import { SongService } from '../service/song.service';
import { ISong } from '../song.model';
import { IMainPage } from 'app/entities/main-page/main-page.model';
import { MainPageService } from 'app/entities/main-page/service/main-page.service';

import { SongUpdateComponent } from './song-update.component';

describe('Song Management Update Component', () => {
  let comp: SongUpdateComponent;
  let fixture: ComponentFixture<SongUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let songFormService: SongFormService;
  let songService: SongService;
  let mainPageService: MainPageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [SongUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(SongUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SongUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    songFormService = TestBed.inject(SongFormService);
    songService = TestBed.inject(SongService);
    mainPageService = TestBed.inject(MainPageService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call MainPage query and add missing value', () => {
      const song: ISong = { id: 'CBA' };
      const mainPage: IMainPage = { id: 65173 };
      song.mainPage = mainPage;

      const mainPageCollection: IMainPage[] = [{ id: 23496 }];
      jest.spyOn(mainPageService, 'query').mockReturnValue(of(new HttpResponse({ body: mainPageCollection })));
      const additionalMainPages = [mainPage];
      const expectedCollection: IMainPage[] = [...additionalMainPages, ...mainPageCollection];
      jest.spyOn(mainPageService, 'addMainPageToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ song });
      comp.ngOnInit();

      expect(mainPageService.query).toHaveBeenCalled();
      expect(mainPageService.addMainPageToCollectionIfMissing).toHaveBeenCalledWith(
        mainPageCollection,
        ...additionalMainPages.map(expect.objectContaining)
      );
      expect(comp.mainPagesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const song: ISong = { id: 'CBA' };
      const mainPage: IMainPage = { id: 31024 };
      song.mainPage = mainPage;

      activatedRoute.data = of({ song });
      comp.ngOnInit();

      expect(comp.mainPagesSharedCollection).toContain(mainPage);
      expect(comp.song).toEqual(song);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISong>>();
      const song = { id: 'ABC' };
      jest.spyOn(songFormService, 'getSong').mockReturnValue(song);
      jest.spyOn(songService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ song });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: song }));
      saveSubject.complete();

      // THEN
      expect(songFormService.getSong).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(songService.update).toHaveBeenCalledWith(expect.objectContaining(song));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISong>>();
      const song = { id: 'ABC' };
      jest.spyOn(songFormService, 'getSong').mockReturnValue({ id: null });
      jest.spyOn(songService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ song: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: song }));
      saveSubject.complete();

      // THEN
      expect(songFormService.getSong).toHaveBeenCalled();
      expect(songService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISong>>();
      const song = { id: 'ABC' };
      jest.spyOn(songService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ song });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(songService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareMainPage', () => {
      it('Should forward to mainPageService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(mainPageService, 'compareMainPage');
        comp.compareMainPage(entity, entity2);
        expect(mainPageService.compareMainPage).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
