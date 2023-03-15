import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { MainPageService } from '../service/main-page.service';

import { MainPageComponent } from './main-page.component';

describe('MainPage Management Component', () => {
  let comp: MainPageComponent;
  let fixture: ComponentFixture<MainPageComponent>;
  let service: MainPageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'main-page', component: MainPageComponent }]), HttpClientTestingModule],
      declarations: [MainPageComponent],
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
      .overrideTemplate(MainPageComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(MainPageComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(MainPageService);

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
    expect(comp.mainPages?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to mainPageService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getMainPageIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getMainPageIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
