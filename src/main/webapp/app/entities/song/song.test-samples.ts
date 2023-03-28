import { ISong, NewSong } from './song.model';

export const sampleWithRequiredData: ISong = {
  id: 99772,
  spotifySongId: 'Health',
  songName: 'magenta Dynamic',
  spotifyArtistId: 'Liaison experiences',
  artistName: '24/7',
};

export const sampleWithPartialData: ISong = {
  id: 25912,
  spotifySongId: 'connecting cyan',
  songName: 'Operations back-end',
  spotifyArtistId: 'Underpass',
  artistName: 'Tasty Shoals',
};

export const sampleWithFullData: ISong = {
  id: 13356,
  spotifySongId: 'protocol archive',
  songName: 'Integration Ruble',
  spotifyArtistId: 'SCSI Afghanistan',
  artistName: 'didactic',
};

export const sampleWithNewData: NewSong = {
  spotifySongId: 'Hat state Kids',
  songName: 'clicks-and-mortar',
  spotifyArtistId: 'Granite array vortals',
  artistName: 'Frozen Towels',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
