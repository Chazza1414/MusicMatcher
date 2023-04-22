import { Injectable } from '@angular/core';
import { SpotifyWebApi } from 'spotify-web-api-ts';
import { ISong, NewSong } from '../entities/song/song.model';

var client_id = '420af6bafdcf44398328b920c4c7dd97'; // Your client id
var redirect_uri = 'http://localhost:9000/initial-training'; // Your redirect uri

var spotifyApi = new SpotifyWebApi({
  clientId: client_id,
  redirectUri: redirect_uri,
});

const maxIds: number = 50;

const seedGenreArray: string[] = [
  'acoustic',
  'afrobeat',
  'alt-rock',
  'alternative',
  'ambient',
  'anime',
  'black-metal',
  'bluegrass',
  'blues',
  'bossanova',
  'brazil',
  'breakbeat',
  'british',
  'cantopop',
  'chicago-house',
  'children',
  'chill',
  'classical',
  'club',
  'comedy',
  'country',
  'dance',
  'dancehall',
  'death-metal',
  'deep-house',
  'detroit-techno',
  'disco',
  'disney',
  'drum-and-bass',
  'dub',
  'dubstep',
  'edm',
  'electro',
  'electronic',
  'emo',
  'folk',
  'forro',
  'french',
  'funk',
  'garage',
  'german',
  'gospel',
  'goth',
  'grindcore',
  'groove',
  'grunge',
  'guitar',
  'happy',
  'hard-rock',
  'hardcore',
  'hardstyle',
  'heavy-metal',
  'hip-hop',
  'holidays',
  'honky-tonk',
  'house',
  'idm',
  'indian',
  'indie',
  'indie-pop',
  'industrial',
  'iranian',
  'j-dance',
  'j-idol',
  'j-pop',
  'j-rock',
  'jazz',
  'k-pop',
  'kids',
  'latin',
  'latino',
  'malay',
  'mandopop',
  'metal',
  'metal-misc',
  'metalcore',
  'minimal-techno',
  'movies',
  'mpb',
  'new-age',
  'new-release',
  'opera',
  'pagode',
  'party',
  'philippines-opm',
  'piano',
  'pop',
  'pop-film',
  'post-dubstep',
  'power-pop',
  'progressive-house',
  'psych-rock',
  'punk',
  'punk-rock',
  'r-n-b',
  'rainy-day',
  'reggae',
  'reggaeton',
  'road-trip',
  'rock',
  'rock-n-roll',
  'rockabilly',
  'romance',
  'sad',
  'salsa',
  'samba',
  'sertanejo',
  'show-tunes',
  'singer-songwriter',
  'ska',
  'sleep',
  'songwriter',
  'soul',
  'soundtracks',
  'spanish',
  'study',
  'summer',
  'swedish',
  'synth-pop',
  'tango',
  'techno',
  'trance',
  'trip-hop',
  'turkish',
  'work-out',
  'world-music',
];

interface song {
  name: string;
  id: string;
  checked: boolean;
}

interface genre {
  name: string;
  checked: boolean;
}

interface playlist {
  name: string;
  id: string;
  checked: boolean;
}

interface musicProfile {
  acousticness: number;
  danceability: number;
  energy: number;
  instrumentalness: number;
  loudness: number;
  speechiness: number;
  tempo: number;
  valence: number;
  genres: string[];
}

let userMusicProfile: musicProfile = {
  acousticness: 0,
  danceability: 0,
  energy: 0,
  instrumentalness: 0,
  loudness: 0,
  speechiness: 0,
  tempo: 0,
  valence: 0,
  genres: [],
};

@Injectable({
  providedIn: 'root',
})
export class RecommendService {
  constructor() {}

  async recommendSong(accessToken: string, playlists: playlist[], songs: song[], genres: genre[]): Promise<NewSong[]> {
    var outSongArray: NewSong[] = [];

    let playlistSongsArray = await this.getAllPlaylistSongs(accessToken, playlists);
    userMusicProfile.genres = this.getGenres(genres);
    spotifyApi.setAccessToken(accessToken);

    if (songs.length > 0) {
      let top50SongsArray = await this.makeSongEntities(accessToken, songs);
      outSongArray = playlistSongsArray.concat(top50SongsArray);
    } else {
      //console.log("out" + playlistSongsArray[0].spotifySongId);
      outSongArray = outSongArray.concat(playlistSongsArray);
    }

    let genreArray = await this.getAllArtistGenres(accessToken, playlistSongsArray.concat(outSongArray));

    genreArray = [...new Set(genreArray)];

    let useableGenreArray: string[] = [];

    for (let i = 0; i < genreArray.length; i++) {
      if (seedGenreArray.includes(genreArray[i])) {
        useableGenreArray.push(genreArray[i]);
      }
    }

    // if there are no seed genres use top 3
    if (userMusicProfile.genres.length == 0) {
      userMusicProfile.genres = ['pop', 'hip-hop', 'edm'];
    }

    userMusicProfile.genres = userMusicProfile.genres.concat(useableGenreArray);

    let songRec = await this.getSeedSongs(
      accessToken,
      outSongArray[this.getRandomInInterval(outSongArray.length)].spotifySongId,
      outSongArray[this.getRandomInInterval(outSongArray.length)].spotifyArtistId,
      useableGenreArray[this.getRandomInInterval(useableGenreArray.length)]
    );

    userMusicProfile = await this.getSongAttributes(accessToken, outSongArray, userMusicProfile);

    return outSongArray;
  }

  async getSongJson(accessToken: string, songString: string): Promise<any> {
    const newUrl = 'https://api.spotify.com/v1/tracks?ids=' + songString;
    const result = await fetch(newUrl, { method: 'GET', headers: { Authorization: 'Bearer ' + accessToken } });
    return await result.json();
  }

  //this function takes the ids of the songs selected from top 50 and makes them into Song entities
  async makeSongEntities(accessToken: string, songArray: song[]): Promise<NewSong[]> {
    let songString = '';
    let newSongs: NewSong[] = []; //[{id: null, songName: "", spotifySongId: "", spotifyArtistId: "", artistName: ""}];
    songString += songArray[0].id;
    for (let i = 1; i < songArray.length; i++) {
      songString += '%2C' + songArray[i].id;
    }
    try {
      const data = await this.getSongJson(accessToken, songString);
      for (let j = 0; j < data.tracks.length; j++) {
        newSongs.push({
          id: null,
          spotifySongId: data.tracks[j].id,
          songName: data.tracks[j].name,
          spotifyArtistId: data.tracks[j].artists[0].id,
          artistName: data.tracks[j].artists[0].name,
        });
      }
      console.log('length' + data.tracks.length);
      return newSongs;
    } catch (reason: any) {
      console.error(reason);
      return [{ id: null, spotifySongId: 'error', songName: '', spotifyArtistId: '', artistName: '' }];
    }
  }

  async getOnePlaylistSongs(accessToken: string, playlistId: string): Promise<any> {
    let newUrl = 'https://api.spotify.com/v1/playlists/' + playlistId;
    let result = await fetch(newUrl, { method: 'GET', headers: { Authorization: 'Bearer ' + accessToken } });
    return await result.json();
  }

  async getAllPlaylistSongs(accessToken: string, playlists: playlist[]): Promise<NewSong[]> {
    let newSongs: NewSong[] = [];
    for (let i = 0; i < playlists.length; i++) {
      const data = await this.getOnePlaylistSongs(accessToken, playlists[i].id);
      for (let j = 0; j < data.tracks.total; j++) {
        try {
          newSongs.push({
            id: null,
            spotifySongId: data.tracks.items[j].track.id,
            songName: data.tracks.items[j].track.name,
            spotifyArtistId: data.tracks.items[j].track.artists[0].id,
            artistName: data.tracks.items[j].track.artists[0].name,
          });
        } catch (e) {
          console.log('error getting playlist songs' + e);
        }
      }
      //console.log(data.tracks.total + "tracks length");
    }
    return newSongs;
  }

  async getOneSongAttribute(accessToken: string, songIds: string): Promise<any> {
    let newUrl = 'https://api.spotify.com/v1/audio-features?ids=' + songIds;
    let result = await fetch(newUrl, { method: 'GET', headers: { Authorization: 'Bearer ' + accessToken } });
    return await result.json();
  }

  async getSongAttributes(accessToken: string, songs: NewSong[], inUserMusicProfile: musicProfile): Promise<musicProfile> {
    if (songs.length == 0) {
      return inUserMusicProfile;
    }

    let userMusicProfile: musicProfile = inUserMusicProfile;
    let songIds: string[] = [];

    for (let i = 0; i < songs.length; i++) {
      songIds.push(<string>songs[i].spotifySongId);
    }

    let songIdString: string = '';

    for (let i = 0; i < songIds.length; i = i + maxIds) {
      songIdString = '';
      if (i + maxIds < songIds.length) {
        songIdString = songIds.slice(i, i + maxIds).join();
      } else {
        songIdString = songIds.slice(i, songIds.length - 1).join();
      }

      const data = await this.getOneSongAttribute(accessToken, songIdString);
      for (let i = 0; i < data.audio_features.length; i++) {
        console.log(data.audio_features.length);
        userMusicProfile.acousticness += data.audio_features[i].acousticness;
        userMusicProfile.danceability += data.audio_features[i].danceability;
        userMusicProfile.energy += data.audio_features[i].energy;
        userMusicProfile.instrumentalness += data.audio_features[i].instrumentalness;
        userMusicProfile.loudness += data.audio_features[i].loudness;
        userMusicProfile.speechiness += data.audio_features[i].speechiness;
        userMusicProfile.tempo += data.audio_features[i].tempo;
        userMusicProfile.valence += data.audio_features[i].valence;
      }
    }

    userMusicProfile.acousticness = userMusicProfile.acousticness / songIds.length;
    userMusicProfile.danceability = userMusicProfile.danceability / songIds.length;
    userMusicProfile.energy = userMusicProfile.energy / songIds.length;
    userMusicProfile.instrumentalness = userMusicProfile.instrumentalness / songIds.length;
    userMusicProfile.loudness = userMusicProfile.loudness / songIds.length;
    userMusicProfile.speechiness = userMusicProfile.speechiness / songIds.length;
    userMusicProfile.tempo = userMusicProfile.tempo / songIds.length;
    userMusicProfile.valence = userMusicProfile.valence / songIds.length;

    return userMusicProfile;
  }

  async getOneArtistGenres(accessToken: string, artistIds: string): Promise<any> {
    let newUrl = 'https://api.spotify.com/v1/artists?ids=' + artistIds;
    let result = await fetch(newUrl, { method: 'GET', headers: { Authorization: 'Bearer ' + accessToken } });
    return await result.json();
  }

  async getAllArtistGenres(accessToken: string, songArray: NewSong[]): Promise<string[]> {
    let artistIds: string[] = [];
    let genres: string[] = [];

    if (songArray.length == 0) {
      return [];
    }

    for (let i = 0; i < songArray.length; i++) {
      artistIds.push(<string>songArray[i].spotifyArtistId);
    }

    let artistIdString: string = '';

    for (let i = 0; i < artistIds.length; i = i + maxIds) {
      artistIdString = '';
      if (i + maxIds < artistIds.length) {
        artistIdString = artistIds.slice(i, i + maxIds).join();
      } else {
        artistIdString = artistIds.slice(i, artistIds.length - 1).join();
      }
      const data = await this.getOneArtistGenres(accessToken, artistIdString);
      for (let j = 0; j < data.artists.length; j++) {
        for (let k = 0; k < data.artists[j].genres.length; k++) {
          genres.push(data.artists[j].genres[k]);
        }
      }
    }
    return genres;
  }

  getGenres(genres: genre[]): string[] {
    let genreNames: string[] = [];
    for (let i = 0; i < genres.length; i++) {
      genreNames.push(genres[i].name);
    }
    return genreNames;
  }

  getRandomInInterval(length: number): number {
    return Math.floor(Math.random() * length);
  }

  async getSeedSongs(
    accessToken: string,
    songId: string | null | undefined,
    artistId: string | null | undefined,
    genre: string
  ): Promise<any> {
    let newUrl = 'https://api.spotify.com/v1/recommendations?seed_artists=' + artistId + '&seed_genres=' + genre + '&seed_tracks=' + songId;
    let result = await fetch(newUrl, { method: 'GET', headers: { Authorization: 'Bearer ' + accessToken } });
    return await result.json();
  }
}
