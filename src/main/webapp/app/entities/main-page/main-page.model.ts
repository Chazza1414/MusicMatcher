import { IUser } from 'app/entities/user/user.model';

export interface IMainPage {
  id: number;
  user?: Pick<IUser, 'id'> | null;
}

export type NewMainPage = Omit<IMainPage, 'id'> & { id: null };
