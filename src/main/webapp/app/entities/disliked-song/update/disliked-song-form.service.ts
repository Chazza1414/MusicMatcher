import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IDislikedSong, NewDislikedSong } from '../disliked-song.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IDislikedSong for edit and NewDislikedSongFormGroupInput for create.
 */
type DislikedSongFormGroupInput = IDislikedSong | PartialWithRequiredKeyOf<NewDislikedSong>;

type DislikedSongFormDefaults = Pick<NewDislikedSong, 'id' | 'chosen'>;

type DislikedSongFormGroupContent = {
  id: FormControl<IDislikedSong['id'] | NewDislikedSong['id']>;
  chosen: FormControl<IDislikedSong['chosen']>;
};

export type DislikedSongFormGroup = FormGroup<DislikedSongFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class DislikedSongFormService {
  createDislikedSongFormGroup(dislikedSong: DislikedSongFormGroupInput = { id: null }): DislikedSongFormGroup {
    const dislikedSongRawValue = {
      ...this.getFormDefaults(),
      ...dislikedSong,
    };
    return new FormGroup<DislikedSongFormGroupContent>({
      id: new FormControl(
        { value: dislikedSongRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      chosen: new FormControl(dislikedSongRawValue.chosen, {
        validators: [Validators.required],
      }),
    });
  }

  getDislikedSong(form: DislikedSongFormGroup): IDislikedSong | NewDislikedSong {
    return form.getRawValue() as IDislikedSong | NewDislikedSong;
  }

  resetForm(form: DislikedSongFormGroup, dislikedSong: DislikedSongFormGroupInput): void {
    const dislikedSongRawValue = { ...this.getFormDefaults(), ...dislikedSong };
    form.reset(
      {
        ...dislikedSongRawValue,
        id: { value: dislikedSongRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): DislikedSongFormDefaults {
    return {
      id: null,
      chosen: false,
    };
  }
}
