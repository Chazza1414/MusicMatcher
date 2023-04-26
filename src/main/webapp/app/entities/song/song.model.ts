import { IUser } from 'app/entities/user/user.model';

export interface ISong {
  id: number;
  spotifySongId?: string | null;
  songName?: string | null;
  spotifyArtistId?: string | null;
  artistName?: string | null;
  user?: Pick<IUser, 'id' | 'login'> | null;
  isLiked?: boolean;
  isDisliked?: boolean;
}

export type NewSong = Omit<ISong, 'id'> & { id: null };
