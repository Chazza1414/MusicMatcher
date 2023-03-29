import { ISong, NewSong } from './song.model';

export const sampleWithRequiredData: ISong = {
  id: 'f007993b-5e24-4af2-b6e0-453f46d843e6',
  artist: 'Operations back-end',
  title: 'Underpass',
};

export const sampleWithPartialData: ISong = {
  id: '61fe7b82-6b1a-441a-af3e-aad5ddb80b24',
  artist: 'calculating',
  title: 'Jewelery Solutions',
};

export const sampleWithFullData: ISong = {
  id: '11500b02-78ab-4586-bb50-1fe728f3a4ec',
  artist: 'synergize Berkshire',
  title: 'vortals',
};

export const sampleWithNewData: NewSong = {
  artist: 'system Florida Automotive',
  title: 'synthesizing cross-platform',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
