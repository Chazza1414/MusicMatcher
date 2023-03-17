import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { MainPageFormService } from './main-page-form.service';
import { MainPageService } from '../service/main-page.service';
import { IMainPage } from '../main-page.model';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

import { MainPageUpdateComponent } from './main-page-update.component';

describe('MainPage Management Update Component', () => {
  let comp: MainPageUpdateComponent;
  let fixture: ComponentFixture<MainPageUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let mainPageFormService: MainPageFormService;
  let mainPageService: MainPageService;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [MainPageUpdateComponent],
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
      .overrideTemplate(MainPageUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(MainPageUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    mainPageFormService = TestBed.inject(MainPageFormService);
    mainPageService = TestBed.inject(MainPageService);
    userService = TestBed.inject(UserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const mainPage: IMainPage = { id: 456 };
      const user: IUser = { id: 90357 };
      mainPage.user = user;

      const userCollection: IUser[] = [{ id: 88544 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ mainPage });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(
        userCollection,
        ...additionalUsers.map(expect.objectContaining)
      );
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const mainPage: IMainPage = { id: 456 };
      const user: IUser = { id: 95404 };
      mainPage.user = user;

      activatedRoute.data = of({ mainPage });
      comp.ngOnInit();

      expect(comp.usersSharedCollection).toContain(user);
      expect(comp.mainPage).toEqual(mainPage);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMainPage>>();
      const mainPage = { id: 123 };
      jest.spyOn(mainPageFormService, 'getMainPage').mockReturnValue(mainPage);
      jest.spyOn(mainPageService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ mainPage });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: mainPage }));
      saveSubject.complete();

      // THEN
      expect(mainPageFormService.getMainPage).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(mainPageService.update).toHaveBeenCalledWith(expect.objectContaining(mainPage));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMainPage>>();
      const mainPage = { id: 123 };
      jest.spyOn(mainPageFormService, 'getMainPage').mockReturnValue({ id: null });
      jest.spyOn(mainPageService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ mainPage: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: mainPage }));
      saveSubject.complete();

      // THEN
      expect(mainPageFormService.getMainPage).toHaveBeenCalled();
      expect(mainPageService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMainPage>>();
      const mainPage = { id: 123 };
      jest.spyOn(mainPageService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ mainPage });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(mainPageService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareUser', () => {
      it('Should forward to userService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(userService, 'compareUser');
        comp.compareUser(entity, entity2);
        expect(userService.compareUser).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
