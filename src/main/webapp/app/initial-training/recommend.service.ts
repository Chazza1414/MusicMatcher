import { Injectable } from '@angular/core';
import { SpotifyWebApi } from 'spotify-web-api-ts';

var client_id = '420af6bafdcf44398328b920c4c7dd97'; // Your client id
var redirect_uri = 'http://localhost:9000/initial-training'; // Your redirect uri

var spotifyApi = new SpotifyWebApi({
  clientId: client_id,
  redirectUri: redirect_uri,
});

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

@Injectable({
  providedIn: 'root',
})
export class RecommendService {
  constructor() {}

  recommendSong(accessToken: string, playlists: playlist[], songs: song[], genres: genre[]) {
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

    userMusicProfile = this.getSongAttributes(songs, userMusicProfile);

    spotifyApi.setAccessToken(accessToken);

    songs.concat(this.getPlaylistSongs(playlists));

    userMusicProfile.genres = this.getGenres(genres);

    //spotifyApi.browse.getRecommendations()
  }

  getPlaylistSongs(playlists: playlist[]): song[] {
    let newSongs: song[] = [];
    for (let i = 0; i < playlists.length; i++) {
      spotifyApi.playlists.getPlaylist(playlists[i].id).then(data => {
        for (let i = 0; i < data.tracks.total; i++) {
          //this.outTextVar = this.outTextVar + data.tracks.items[i].track.name;
          newSongs.push({ name: data.tracks.items[i].track.name, id: data.tracks.items[i].track.id, checked: false });
        }
      });
    }
    return newSongs;
  }

  getSongAttributes(songs: song[], inUserMusicProfile: musicProfile): musicProfile {
    if (songs.length == 0) {
      return inUserMusicProfile;
    }

    let userMusicProfile: musicProfile = inUserMusicProfile;
    let songIds: string[] = [];

    for (let i = 0; i < songs.length; i++) {
      songIds.push(songs[i].id);
    }

    let end: number = 0;

    for (let i = 0; i < songs.length; i = i + 100) {
      //if we are at a block of 100 songs or if we are in the end block
      if (songs.length - i < 100) {
        end = songs.length - 1;
      } else if (i % 100 == 0) {
        end = i + 100;
      }
      spotifyApi.tracks.getAudioFeaturesForTracks(songIds.slice(i, end)).then(data => {
        for (let i = 0; i < data.length; i++) {
          userMusicProfile.acousticness = <number>data[i]?.acousticness;
          userMusicProfile.danceability = <number>data[i]?.danceability;
          userMusicProfile.energy = <number>data[i]?.energy;
          userMusicProfile.instrumentalness = <number>data[i]?.instrumentalness;
          userMusicProfile.loudness = <number>data[i]?.loudness;
          userMusicProfile.speechiness = <number>data[i]?.speechiness;
          userMusicProfile.tempo = <number>data[i]?.tempo;
          userMusicProfile.valence = <number>data[i]?.valence;
        }
      });
    }
    return userMusicProfile;
  }

  getGenres(genres: genre[]): string[] {
    let genreNames: string[] = [];
    for (let i = 0; i < genres.length; i++) {
      genreNames.push(genres[i].name);
    }
    return genreNames;
  }
}
