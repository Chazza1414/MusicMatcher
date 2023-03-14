import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { DislikedSongService } from '../service/disliked-song.service';

import { DislikedSongComponent } from './disliked-song.component';

describe('DislikedSong Management Component', () => {
  let comp: DislikedSongComponent;
  let fixture: ComponentFixture<DislikedSongComponent>;
  let service: DislikedSongService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'disliked-song', component: DislikedSongComponent }]), HttpClientTestingModule],
      declarations: [DislikedSongComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              })
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(DislikedSongComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(DislikedSongComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(DislikedSongService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.dislikedSongs?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to dislikedSongService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getDislikedSongIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getDislikedSongIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
