import { ILikedSong, NewLikedSong } from './liked-song.model';

export const sampleWithRequiredData: ILikedSong = {
  id: 50875,
  chosen: true,
};

export const sampleWithPartialData: ILikedSong = {
  id: 81970,
  chosen: false,
};

export const sampleWithFullData: ILikedSong = {
  id: 41265,
  chosen: true,
};

export const sampleWithNewData: NewLikedSong = {
  chosen: false,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
