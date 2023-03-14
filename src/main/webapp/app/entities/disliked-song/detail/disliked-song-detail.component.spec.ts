import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { DislikedSongDetailComponent } from './disliked-song-detail.component';

describe('DislikedSong Management Detail Component', () => {
  let comp: DislikedSongDetailComponent;
  let fixture: ComponentFixture<DislikedSongDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DislikedSongDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ dislikedSong: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(DislikedSongDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(DislikedSongDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load dislikedSong on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.dislikedSong).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
