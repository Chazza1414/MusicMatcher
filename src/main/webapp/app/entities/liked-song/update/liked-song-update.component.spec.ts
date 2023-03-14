import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { LikedSongFormService } from './liked-song-form.service';
import { LikedSongService } from '../service/liked-song.service';
import { ILikedSong } from '../liked-song.model';

import { LikedSongUpdateComponent } from './liked-song-update.component';

describe('LikedSong Management Update Component', () => {
  let comp: LikedSongUpdateComponent;
  let fixture: ComponentFixture<LikedSongUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let likedSongFormService: LikedSongFormService;
  let likedSongService: LikedSongService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [LikedSongUpdateComponent],
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
      .overrideTemplate(LikedSongUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(LikedSongUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    likedSongFormService = TestBed.inject(LikedSongFormService);
    likedSongService = TestBed.inject(LikedSongService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const likedSong: ILikedSong = { id: 456 };

      activatedRoute.data = of({ likedSong });
      comp.ngOnInit();

      expect(comp.likedSong).toEqual(likedSong);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILikedSong>>();
      const likedSong = { id: 123 };
      jest.spyOn(likedSongFormService, 'getLikedSong').mockReturnValue(likedSong);
      jest.spyOn(likedSongService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ likedSong });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: likedSong }));
      saveSubject.complete();

      // THEN
      expect(likedSongFormService.getLikedSong).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(likedSongService.update).toHaveBeenCalledWith(expect.objectContaining(likedSong));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILikedSong>>();
      const likedSong = { id: 123 };
      jest.spyOn(likedSongFormService, 'getLikedSong').mockReturnValue({ id: null });
      jest.spyOn(likedSongService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ likedSong: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: likedSong }));
      saveSubject.complete();

      // THEN
      expect(likedSongFormService.getLikedSong).toHaveBeenCalled();
      expect(likedSongService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILikedSong>>();
      const likedSong = { id: 123 };
      jest.spyOn(likedSongService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ likedSong });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(likedSongService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
