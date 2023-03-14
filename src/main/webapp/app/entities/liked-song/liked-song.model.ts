export interface ILikedSong {
  id: number;
  chosen?: boolean | null;
}

export type NewLikedSong = Omit<ILikedSong, 'id'> & { id: null };
