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

const recSongLimit: number = 10;

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

interface songProfile {
  songId: string;
  attributes: musicProfile;
}

const emptyMusicProfile: musicProfile = {
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

const emptySong: NewSong = {
  id: null,
  spotifySongId: '',
  spotifyArtistId: '',
  songName: '',
  artistName: '',
};

let userMusicProfile: musicProfile = emptyMusicProfile;

@Injectable({
  providedIn: 'root',
})
export class RecommendService {
  constructor() {}

  async recommendSong(accessToken: string, playlists: playlist[], songs: song[], genres: genre[]): Promise<string> {
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

    let songRecs = await this.getSeedSongs(
      accessToken,
      outSongArray[this.getRandomInInterval(outSongArray.length)].spotifySongId,
      outSongArray[this.getRandomInInterval(outSongArray.length)].spotifyArtistId,
      useableGenreArray[this.getRandomInInterval(useableGenreArray.length)]
    );

    //console.log(songRecs);

    let recSongIds: string[] = [];
    for (let i = 0; i < recSongLimit; i++) {
      //console.log(songRecs.tracks[i].id);
      recSongIds.push(songRecs.tracks[i].id);
    }

    let recSongFeatures: musicProfile[] = [];

    for (let i = 0; i < recSongLimit; i++) {
      // recSongFeatures.push(await this.getSongAttributes(accessToken,
      //   [{id: null, spotifySongId: recSongIds[i], songName: "", artistName: "", spotifyArtistId: ""}],
      //   emptyMusicProfile));
      //   console.log("accousticness"+recSongFeatures[i].acousticness);

      //let tempMusicProfile: musicProfile = emptyMusicProfile;

      //console.log(tempMusicProfile);

      let data = await this.getOneSongAttribute(accessToken, recSongIds[i]);
      try {
        //console.log(JSON.stringify(data));
        //console.log("acou accum 000 "+ data.audio_features[0].acousticness);
        // tempMusicProfile.acousticness = data.audio_features[0].acousticness;
        // tempMusicProfile.danceability = data.audio_features[0].danceability;
        // tempMusicProfile.energy = data.audio_features[0].energy;
        // tempMusicProfile.instrumentalness = data.audio_features[0].instrumentalness;
        // tempMusicProfile.loudness = data.audio_features[0].loudness;
        // tempMusicProfile.speechiness = data.audio_features[0].speechiness;
        // tempMusicProfile.tempo = data.audio_features[0].tempo;
        // tempMusicProfile.valence = data.audio_features[0].valence;
        recSongFeatures.push({
          acousticness: data.audio_features[0].acousticness,
          danceability: data.audio_features[0].danceability,
          energy: data.audio_features[0].energy,
          instrumentalness: data.audio_features[0].instrumentalness,
          loudness: data.audio_features[0].loudness,
          speechiness: data.audio_features[0].speechiness,
          tempo: data.audio_features[0].tempo,
          valence: data.audio_features[0].valence,
          genres: [],
        });
        //console.log(tempMusicProfile);
      } catch (e) {
        console.log('Error building music profile: ' + e);
      }
      //recSongFeatures.push(tempMusicProfile);
    }

    // for (let i = 0; i < recSongLimit; i++) {
    //   //console.log(recSongIds[i]);
    //   console.log(recSongFeatures[i]);
    // }

    userMusicProfile = await this.getSongAttributes(accessToken, outSongArray, userMusicProfile);

    let songProfiles: songProfile[] = [];

    for (let i = 0; i < recSongLimit; i++) {
      songProfiles[i] = { songId: recSongIds[i], attributes: recSongFeatures[i] };
    }

    console.log('rec ' + this.getBestRecommendation(songProfiles).songId);

    return this.getBestRecommendation(songProfiles).songId;
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
        //issue here cannot fetch more than 100 songs
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

    for (let j = 0; j < songIds.length; j = j + maxIds) {
      songIdString = '';
      if (songIds.length == 1) {
        //console.log("one");
        songIdString = songIds[0];
      } else if (j + maxIds < songIds.length) {
        songIdString = songIds.slice(j, j + maxIds).join();
      } else {
        songIdString = songIds.slice(j, songIds.length - 1).join();
      }

      //console.log("song id:" + songIdString);

      const data = await this.getOneSongAttribute(accessToken, songIdString);
      //console.log("audio features length" + data.audio_features.length);
      try {
        //console.log("acou accum 000 "+data.audio_features[0].acousticness);
        userMusicProfile.acousticness += data.audio_features[0].acousticness;
        userMusicProfile.danceability += data.audio_features[0].danceability;
        userMusicProfile.energy += data.audio_features[0].energy;
        userMusicProfile.instrumentalness += data.audio_features[0].instrumentalness;
        userMusicProfile.loudness += data.audio_features[0].loudness;
        userMusicProfile.speechiness += data.audio_features[0].speechiness;
        userMusicProfile.tempo += data.audio_features[0].tempo;
        userMusicProfile.valence += data.audio_features[0].valence;
      } catch (e) {
        console.log('Error building music profile: ' + e);
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

    // console.log("acou:" + userMusicProfile.acousticness);
    // console.log("danc:" + userMusicProfile.danceability);
    // console.log("ener:" + userMusicProfile.energy);
    // console.log("inst:" + userMusicProfile.instrumentalness);
    // console.log("loud:" + userMusicProfile.loudness);
    // console.log("spee:" + userMusicProfile.speechiness);
    // console.log("temp:" + userMusicProfile.tempo);
    // console.log("vale:" + userMusicProfile.valence);

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
    let newUrl =
      'https://api.spotify.com/v1/recommendations?limit=' +
      recSongLimit +
      '&seed_artists=' +
      artistId +
      '&seed_genres=' +
      genre +
      '&seed_tracks=' +
      songId;
    let result = await fetch(newUrl, { method: 'GET', headers: { Authorization: 'Bearer ' + accessToken } });
    return await result.json();
  }

  getBestRecommendation(songProfiles: songProfile[]): songProfile {
    let nearestDistance: number = 1000000;
    let nearestSong: songProfile = { songId: '', attributes: emptyMusicProfile };

    for (let i = 0; i < songProfiles.length; i++) {
      let distance: number = this.euclidDistance(songProfiles[i].attributes, userMusicProfile);

      if (nearestDistance > distance) {
        nearestDistance = distance;
        nearestSong = songProfiles[i];
      }
    }

    return nearestSong;
  }

  euclidDistance(songAttributes: musicProfile, userMusicProfile: musicProfile): number {
    let sum: number = 0;

    for (let i = 0; i < 8; i++) {
      sum += (songAttributes.acousticness + userMusicProfile.acousticness) ** 2;
      sum += (songAttributes.valence + userMusicProfile.valence) ** 2;
      sum += (songAttributes.tempo + userMusicProfile.tempo) ** 2;
      sum += (songAttributes.energy + userMusicProfile.energy) ** 2;
      sum += (songAttributes.speechiness + userMusicProfile.speechiness) ** 2;
      sum += (songAttributes.loudness + userMusicProfile.loudness) ** 2;
      sum += (songAttributes.instrumentalness + userMusicProfile.instrumentalness) ** 2;
      sum += (songAttributes.danceability + userMusicProfile.danceability) ** 2;
    }

    return Math.sqrt(sum);
  }
}
