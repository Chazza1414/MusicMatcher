import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ISong, NewSong } from '../song.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ISong for edit and NewSongFormGroupInput for create.
 */
type SongFormGroupInput = ISong | PartialWithRequiredKeyOf<NewSong>;

type SongFormDefaults = Pick<NewSong, 'id'>;

type SongFormGroupContent = {
  id: FormControl<ISong['id'] | NewSong['id']>;
  spotifySongId: FormControl<ISong['spotifySongId']>;
  songName: FormControl<ISong['songName']>;
  spotifyArtistId: FormControl<ISong['spotifyArtistId']>;
  artistName: FormControl<ISong['artistName']>;
  user: FormControl<ISong['user']>;
};

export type SongFormGroup = FormGroup<SongFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class SongFormService {
  createSongFormGroup(song: SongFormGroupInput = { id: null }): SongFormGroup {
    const songRawValue = {
      ...this.getFormDefaults(),
      ...song,
    };
    return new FormGroup<SongFormGroupContent>({
      id: new FormControl(
        { value: songRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      spotifySongId: new FormControl(songRawValue.spotifySongId, {
        validators: [Validators.required],
      }),
      songName: new FormControl(songRawValue.songName, {
        validators: [Validators.required],
      }),
      spotifyArtistId: new FormControl(songRawValue.spotifyArtistId, {
        validators: [Validators.required],
      }),
      artistName: new FormControl(songRawValue.artistName, {
        validators: [Validators.required],
      }),
      user: new FormControl(songRawValue.user),
    });
  }

  getSong(form: SongFormGroup): ISong | NewSong {
    return form.getRawValue() as ISong | NewSong;
  }

  resetForm(form: SongFormGroup, song: SongFormGroupInput): void {
    const songRawValue = { ...this.getFormDefaults(), ...song };
    form.reset(
      {
        ...songRawValue,
        id: { value: songRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): SongFormDefaults {
    return {
      id: null,
    };
  }
}
