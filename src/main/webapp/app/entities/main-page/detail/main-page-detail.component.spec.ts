import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { MainPageDetailComponent } from './main-page-detail.component';

describe('MainPage Management Detail Component', () => {
  let comp: MainPageDetailComponent;
  let fixture: ComponentFixture<MainPageDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MainPageDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ mainPage: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(MainPageDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(MainPageDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load mainPage on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.mainPage).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
