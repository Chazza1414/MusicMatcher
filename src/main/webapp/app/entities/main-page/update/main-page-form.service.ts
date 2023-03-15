import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IMainPage, NewMainPage } from '../main-page.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IMainPage for edit and NewMainPageFormGroupInput for create.
 */
type MainPageFormGroupInput = IMainPage | PartialWithRequiredKeyOf<NewMainPage>;

type MainPageFormDefaults = Pick<NewMainPage, 'id'>;

type MainPageFormGroupContent = {
  id: FormControl<IMainPage['id'] | NewMainPage['id']>;
  user: FormControl<IMainPage['user']>;
};

export type MainPageFormGroup = FormGroup<MainPageFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class MainPageFormService {
  createMainPageFormGroup(mainPage: MainPageFormGroupInput = { id: null }): MainPageFormGroup {
    const mainPageRawValue = {
      ...this.getFormDefaults(),
      ...mainPage,
    };
    return new FormGroup<MainPageFormGroupContent>({
      id: new FormControl(
        { value: mainPageRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      user: new FormControl(mainPageRawValue.user),
    });
  }

  getMainPage(form: MainPageFormGroup): IMainPage | NewMainPage {
    return form.getRawValue() as IMainPage | NewMainPage;
  }

  resetForm(form: MainPageFormGroup, mainPage: MainPageFormGroupInput): void {
    const mainPageRawValue = { ...this.getFormDefaults(), ...mainPage };
    form.reset(
      {
        ...mainPageRawValue,
        id: { value: mainPageRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): MainPageFormDefaults {
    return {
      id: null,
    };
  }
}
