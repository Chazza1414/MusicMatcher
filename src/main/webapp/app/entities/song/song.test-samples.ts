import { ISong, NewSong } from './song.model';

export const sampleWithRequiredData: ISong = {
  id: 99772,
  artist: 'Health',
  title: 'magenta Dynamic',
};

export const sampleWithPartialData: ISong = {
  id: 64493,
  artist: 'Metal Lead 24/7',
  title: 'applications',
};

export const sampleWithFullData: ISong = {
  id: 31009,
  artist: 'Regional',
  title: 'Djibouti Plastic Underpass',
};

export const sampleWithNewData: NewSong = {
  artist: 'Tasty Shoals',
  title: 'repurpose',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
