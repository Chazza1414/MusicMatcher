import { IDislikedSong, NewDislikedSong } from './disliked-song.model';

export const sampleWithRequiredData: IDislikedSong = {
  id: 57405,
  chosen: false,
};

export const sampleWithPartialData: IDislikedSong = {
  id: 88228,
  chosen: true,
};

export const sampleWithFullData: IDislikedSong = {
  id: 47458,
  chosen: false,
};

export const sampleWithNewData: NewDislikedSong = {
  chosen: true,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
