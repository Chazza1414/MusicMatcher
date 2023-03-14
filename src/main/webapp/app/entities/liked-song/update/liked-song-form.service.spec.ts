import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../liked-song.test-samples';

import { LikedSongFormService } from './liked-song-form.service';

describe('LikedSong Form Service', () => {
  let service: LikedSongFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LikedSongFormService);
  });

  describe('Service methods', () => {
    describe('createLikedSongFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createLikedSongFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            chosen: expect.any(Object),
          })
        );
      });

      it('passing ILikedSong should create a new form with FormGroup', () => {
        const formGroup = service.createLikedSongFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            chosen: expect.any(Object),
          })
        );
      });
    });

    describe('getLikedSong', () => {
      it('should return NewLikedSong for default LikedSong initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createLikedSongFormGroup(sampleWithNewData);

        const likedSong = service.getLikedSong(formGroup) as any;

        expect(likedSong).toMatchObject(sampleWithNewData);
      });

      it('should return NewLikedSong for empty LikedSong initial value', () => {
        const formGroup = service.createLikedSongFormGroup();

        const likedSong = service.getLikedSong(formGroup) as any;

        expect(likedSong).toMatchObject({});
      });

      it('should return ILikedSong', () => {
        const formGroup = service.createLikedSongFormGroup(sampleWithRequiredData);

        const likedSong = service.getLikedSong(formGroup) as any;

        expect(likedSong).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ILikedSong should not enable id FormControl', () => {
        const formGroup = service.createLikedSongFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewLikedSong should disable id FormControl', () => {
        const formGroup = service.createLikedSongFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
