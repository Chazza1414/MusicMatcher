import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../disliked-song.test-samples';

import { DislikedSongFormService } from './disliked-song-form.service';

describe('DislikedSong Form Service', () => {
  let service: DislikedSongFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DislikedSongFormService);
  });

  describe('Service methods', () => {
    describe('createDislikedSongFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createDislikedSongFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            chosen: expect.any(Object),
          })
        );
      });

      it('passing IDislikedSong should create a new form with FormGroup', () => {
        const formGroup = service.createDislikedSongFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            chosen: expect.any(Object),
          })
        );
      });
    });

    describe('getDislikedSong', () => {
      it('should return NewDislikedSong for default DislikedSong initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createDislikedSongFormGroup(sampleWithNewData);

        const dislikedSong = service.getDislikedSong(formGroup) as any;

        expect(dislikedSong).toMatchObject(sampleWithNewData);
      });

      it('should return NewDislikedSong for empty DislikedSong initial value', () => {
        const formGroup = service.createDislikedSongFormGroup();

        const dislikedSong = service.getDislikedSong(formGroup) as any;

        expect(dislikedSong).toMatchObject({});
      });

      it('should return IDislikedSong', () => {
        const formGroup = service.createDislikedSongFormGroup(sampleWithRequiredData);

        const dislikedSong = service.getDislikedSong(formGroup) as any;

        expect(dislikedSong).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IDislikedSong should not enable id FormControl', () => {
        const formGroup = service.createDislikedSongFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewDislikedSong should disable id FormControl', () => {
        const formGroup = service.createDislikedSongFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
