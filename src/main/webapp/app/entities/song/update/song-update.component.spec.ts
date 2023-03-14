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
import { ILikedSong } from 'app/entities/liked-song/liked-song.model';
import { LikedSongService } from 'app/entities/liked-song/service/liked-song.service';
import { IDislikedSong } from 'app/entities/disliked-song/disliked-song.model';
import { DislikedSongService } from 'app/entities/disliked-song/service/disliked-song.service';
import { IMainPage } from 'app/entities/main-page/main-page.model';
import { MainPageService } from 'app/entities/main-page/service/main-page.service';

import { SongUpdateComponent } from './song-update.component';

describe('Song Management Update Component', () => {
  let comp: SongUpdateComponent;
  let fixture: ComponentFixture<SongUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let songFormService: SongFormService;
  let songService: SongService;
  let likedSongService: LikedSongService;
  let dislikedSongService: DislikedSongService;
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
    likedSongService = TestBed.inject(LikedSongService);
    dislikedSongService = TestBed.inject(DislikedSongService);
    mainPageService = TestBed.inject(MainPageService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call likedSong query and add missing value', () => {
      const song: ISong = { id: 456 };
      const likedSong: ILikedSong = { id: 50120 };
      song.likedSong = likedSong;

      const likedSongCollection: ILikedSong[] = [{ id: 64291 }];
      jest.spyOn(likedSongService, 'query').mockReturnValue(of(new HttpResponse({ body: likedSongCollection })));
      const expectedCollection: ILikedSong[] = [likedSong, ...likedSongCollection];
      jest.spyOn(likedSongService, 'addLikedSongToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ song });
      comp.ngOnInit();

      expect(likedSongService.query).toHaveBeenCalled();
      expect(likedSongService.addLikedSongToCollectionIfMissing).toHaveBeenCalledWith(likedSongCollection, likedSong);
      expect(comp.likedSongsCollection).toEqual(expectedCollection);
    });

    it('Should call dislikedSong query and add missing value', () => {
      const song: ISong = { id: 456 };
      const dislikedSong: IDislikedSong = { id: 35251 };
      song.dislikedSong = dislikedSong;

      const dislikedSongCollection: IDislikedSong[] = [{ id: 87046 }];
      jest.spyOn(dislikedSongService, 'query').mockReturnValue(of(new HttpResponse({ body: dislikedSongCollection })));
      const expectedCollection: IDislikedSong[] = [dislikedSong, ...dislikedSongCollection];
      jest.spyOn(dislikedSongService, 'addDislikedSongToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ song });
      comp.ngOnInit();

      expect(dislikedSongService.query).toHaveBeenCalled();
      expect(dislikedSongService.addDislikedSongToCollectionIfMissing).toHaveBeenCalledWith(dislikedSongCollection, dislikedSong);
      expect(comp.dislikedSongsCollection).toEqual(expectedCollection);
    });

    it('Should call MainPage query and add missing value', () => {
      const song: ISong = { id: 456 };
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
      const song: ISong = { id: 456 };
      const likedSong: ILikedSong = { id: 86679 };
      song.likedSong = likedSong;
      const dislikedSong: IDislikedSong = { id: 82639 };
      song.dislikedSong = dislikedSong;
      const mainPage: IMainPage = { id: 31024 };
      song.mainPage = mainPage;

      activatedRoute.data = of({ song });
      comp.ngOnInit();

      expect(comp.likedSongsCollection).toContain(likedSong);
      expect(comp.dislikedSongsCollection).toContain(dislikedSong);
      expect(comp.mainPagesSharedCollection).toContain(mainPage);
      expect(comp.song).toEqual(song);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISong>>();
      const song = { id: 123 };
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
      const song = { id: 123 };
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
      const song = { id: 123 };
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
    describe('compareLikedSong', () => {
      it('Should forward to likedSongService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(likedSongService, 'compareLikedSong');
        comp.compareLikedSong(entity, entity2);
        expect(likedSongService.compareLikedSong).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareDislikedSong', () => {
      it('Should forward to dislikedSongService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(dislikedSongService, 'compareDislikedSong');
        comp.compareDislikedSong(entity, entity2);
        expect(dislikedSongService.compareDislikedSong).toHaveBeenCalledWith(entity, entity2);
      });
    });

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
