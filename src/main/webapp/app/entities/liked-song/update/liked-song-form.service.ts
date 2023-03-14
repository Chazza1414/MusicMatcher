import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ILikedSong, NewLikedSong } from '../liked-song.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ILikedSong for edit and NewLikedSongFormGroupInput for create.
 */
type LikedSongFormGroupInput = ILikedSong | PartialWithRequiredKeyOf<NewLikedSong>;

type LikedSongFormDefaults = Pick<NewLikedSong, 'id' | 'chosen'>;

type LikedSongFormGroupContent = {
  id: FormControl<ILikedSong['id'] | NewLikedSong['id']>;
  chosen: FormControl<ILikedSong['chosen']>;
};

export type LikedSongFormGroup = FormGroup<LikedSongFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class LikedSongFormService {
  createLikedSongFormGroup(likedSong: LikedSongFormGroupInput = { id: null }): LikedSongFormGroup {
    const likedSongRawValue = {
      ...this.getFormDefaults(),
      ...likedSong,
    };
    return new FormGroup<LikedSongFormGroupContent>({
      id: new FormControl(
        { value: likedSongRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      chosen: new FormControl(likedSongRawValue.chosen, {
        validators: [Validators.required],
      }),
    });
  }

  getLikedSong(form: LikedSongFormGroup): ILikedSong | NewLikedSong {
    return form.getRawValue() as ILikedSong | NewLikedSong;
  }

  resetForm(form: LikedSongFormGroup, likedSong: LikedSongFormGroupInput): void {
    const likedSongRawValue = { ...this.getFormDefaults(), ...likedSong };
    form.reset(
      {
        ...likedSongRawValue,
        id: { value: likedSongRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): LikedSongFormDefaults {
    return {
      id: null,
      chosen: false,
    };
  }
}
