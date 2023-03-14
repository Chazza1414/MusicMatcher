import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { DislikedSongFormService } from './disliked-song-form.service';
import { DislikedSongService } from '../service/disliked-song.service';
import { IDislikedSong } from '../disliked-song.model';

import { DislikedSongUpdateComponent } from './disliked-song-update.component';

describe('DislikedSong Management Update Component', () => {
  let comp: DislikedSongUpdateComponent;
  let fixture: ComponentFixture<DislikedSongUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let dislikedSongFormService: DislikedSongFormService;
  let dislikedSongService: DislikedSongService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [DislikedSongUpdateComponent],
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
      .overrideTemplate(DislikedSongUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(DislikedSongUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    dislikedSongFormService = TestBed.inject(DislikedSongFormService);
    dislikedSongService = TestBed.inject(DislikedSongService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const dislikedSong: IDislikedSong = { id: 456 };

      activatedRoute.data = of({ dislikedSong });
      comp.ngOnInit();

      expect(comp.dislikedSong).toEqual(dislikedSong);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDislikedSong>>();
      const dislikedSong = { id: 123 };
      jest.spyOn(dislikedSongFormService, 'getDislikedSong').mockReturnValue(dislikedSong);
      jest.spyOn(dislikedSongService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ dislikedSong });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: dislikedSong }));
      saveSubject.complete();

      // THEN
      expect(dislikedSongFormService.getDislikedSong).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(dislikedSongService.update).toHaveBeenCalledWith(expect.objectContaining(dislikedSong));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDislikedSong>>();
      const dislikedSong = { id: 123 };
      jest.spyOn(dislikedSongFormService, 'getDislikedSong').mockReturnValue({ id: null });
      jest.spyOn(dislikedSongService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ dislikedSong: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: dislikedSong }));
      saveSubject.complete();

      // THEN
      expect(dislikedSongFormService.getDislikedSong).toHaveBeenCalled();
      expect(dislikedSongService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDislikedSong>>();
      const dislikedSong = { id: 123 };
      jest.spyOn(dislikedSongService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ dislikedSong });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(dislikedSongService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
