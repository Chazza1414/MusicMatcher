import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../song.test-samples';

import { SongFormService } from './song-form.service';

describe('Song Form Service', () => {
  let service: SongFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SongFormService);
  });

  describe('Service methods', () => {
    describe('createSongFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createSongFormGroup();

        // @ts-ignore
        expect(formGroup.controls).toEqual(
          // @ts-ignore
          expect.objectContaining({
            // @ts-ignore
            id: expect.any(Object),
            // @ts-ignore
            spotifySongId: expect.any(Object),
            // @ts-ignore
            songName: expect.any(Object),
            // @ts-ignore
            spotifyArtistId: expect.any(Object),
            // @ts-ignore
            artistName: expect.any(Object),
            // @ts-ignore
            user: expect.any(Object),
          })
        );
      });

      it('passing ISong should create a new form with FormGroup', () => {
        const formGroup = service.createSongFormGroup(sampleWithRequiredData);
        // @ts-ignore
        expect(formGroup.controls).toEqual(
          // @ts-ignore
          expect.objectContaining({
            // @ts-ignore
            id: expect.any(Object),
            // @ts-ignore
            spotifySongId: expect.any(Object),
            // @ts-ignore
            songName: expect.any(Object),
            // @ts-ignore
            spotifyArtistId: expect.any(Object),
            // @ts-ignore
            artistName: expect.any(Object),
            // @ts-ignore
            user: expect.any(Object),
          })
        );
      });
    });

    describe('getSong', () => {
      it('should return NewSong for default Song initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createSongFormGroup(sampleWithNewData);

        const song = service.getSong(formGroup) as any;
        // @ts-ignore
        expect(song).toMatchObject(sampleWithNewData);
      });

      it('should return NewSong for empty Song initial value', () => {
        const formGroup = service.createSongFormGroup();

        const song = service.getSong(formGroup) as any;
        // @ts-ignore
        expect(song).toMatchObject({});
      });

      it('should return ISong', () => {
        const formGroup = service.createSongFormGroup(sampleWithRequiredData);

        const song = service.getSong(formGroup) as any;
        // @ts-ignore
        expect(song).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ISong should not enable id FormControl', () => {
        const formGroup = service.createSongFormGroup(); // @ts-ignore
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);
        // @ts-ignore
        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewSong should disable id FormControl', () => {
        const formGroup = service.createSongFormGroup(sampleWithRequiredData); // @ts-ignore
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });
        // @ts-ignore
        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
