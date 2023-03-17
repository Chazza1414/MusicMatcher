import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../main-page.test-samples';

import { MainPageFormService } from './main-page-form.service';

describe('MainPage Form Service', () => {
  let service: MainPageFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MainPageFormService);
  });

  describe('Service methods', () => {
    describe('createMainPageFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createMainPageFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            user: expect.any(Object),
          })
        );
      });

      it('passing IMainPage should create a new form with FormGroup', () => {
        const formGroup = service.createMainPageFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            user: expect.any(Object),
          })
        );
      });
    });

    describe('getMainPage', () => {
      it('should return NewMainPage for default MainPage initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createMainPageFormGroup(sampleWithNewData);

        const mainPage = service.getMainPage(formGroup) as any;

        expect(mainPage).toMatchObject(sampleWithNewData);
      });

      it('should return NewMainPage for empty MainPage initial value', () => {
        const formGroup = service.createMainPageFormGroup();

        const mainPage = service.getMainPage(formGroup) as any;

        expect(mainPage).toMatchObject({});
      });

      it('should return IMainPage', () => {
        const formGroup = service.createMainPageFormGroup(sampleWithRequiredData);

        const mainPage = service.getMainPage(formGroup) as any;

        expect(mainPage).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IMainPage should not enable id FormControl', () => {
        const formGroup = service.createMainPageFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewMainPage should disable id FormControl', () => {
        const formGroup = service.createMainPageFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
