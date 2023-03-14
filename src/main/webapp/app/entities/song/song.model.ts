import { ILikedSong } from 'app/entities/liked-song/liked-song.model';
import { IDislikedSong } from 'app/entities/disliked-song/disliked-song.model';
import { IMainPage } from 'app/entities/main-page/main-page.model';

export interface ISong {
  id: number;
  artist?: string | null;
  title?: string | null;
  likedSong?: Pick<ILikedSong, 'id' | 'chosen'> | null;
  dislikedSong?: Pick<IDislikedSong, 'id' | 'chosen'> | null;
  mainPage?: Pick<IMainPage, 'id'> | null;
}

export type NewSong = Omit<ISong, 'id'> & { id: null };
