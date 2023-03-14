import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { LikedSongService } from '../service/liked-song.service';

import { LikedSongComponent } from './liked-song.component';

describe('LikedSong Management Component', () => {
  let comp: LikedSongComponent;
  let fixture: ComponentFixture<LikedSongComponent>;
  let service: LikedSongService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'liked-song', component: LikedSongComponent }]), HttpClientTestingModule],
      declarations: [LikedSongComponent],
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
      .overrideTemplate(LikedSongComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(LikedSongComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(LikedSongService);

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
    expect(comp.likedSongs?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to likedSongService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getLikedSongIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getLikedSongIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
