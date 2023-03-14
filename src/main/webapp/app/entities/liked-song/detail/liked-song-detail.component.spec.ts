import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { LikedSongDetailComponent } from './liked-song-detail.component';

describe('LikedSong Management Detail Component', () => {
  let comp: LikedSongDetailComponent;
  let fixture: ComponentFixture<LikedSongDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LikedSongDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ likedSong: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(LikedSongDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(LikedSongDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load likedSong on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.likedSong).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
