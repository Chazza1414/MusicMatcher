import { IUser } from 'app/entities/user/user.model';

export interface ISong {
  id: number;
  spotifySongId?: string | null;

  //songName = liked:boolean
  songName?: string | null;
  spotifyArtistId?: string | null;
  artistName?: string | null;
  user?: Pick<IUser, 'id' | 'login'> | null;
}

export type NewSong = Omit<ISong, 'id'> & { id: null };
