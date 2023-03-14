export interface IDislikedSong {
  id: number;
  chosen?: boolean | null;
}

export type NewDislikedSong = Omit<IDislikedSong, 'id'> & { id: null };
