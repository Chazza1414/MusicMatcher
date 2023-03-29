import { IMainPage } from 'app/entities/main-page/main-page.model';

export interface ISong {
  id: string;
  artist?: string | null;
  title?: string | null;
  mainPage?: Pick<IMainPage, 'id'> | null;
}

export type NewSong = Omit<ISong, 'id'> & { id: null };
