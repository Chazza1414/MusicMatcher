import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

//here get songs from spotify api

export interface song {
  name: string;
  artist: string;
}

export interface genre {
  name: string;
}

export const songArray: song[] = [
  { name: 'test name', artist: 'test artist' },
  { name: 'test name', artist: 'test artist' },
  { name: 'test name', artist: 'test artist' },
  { name: 'test name', artist: 'test artist' },
  { name: 'test name', artist: 'test artist' },
  { name: 'test name', artist: 'test artist' },
  { name: 'test name', artist: 'test artist' },
  { name: 'test name', artist: 'test artist' },
  { name: 'test name', artist: 'test artist' },
  { name: 'test name', artist: 'test artist' },
  { name: 'test name', artist: 'test artist' },
  { name: 'test name', artist: 'test artist' },
  { name: 'test name', artist: 'test artist' },
  { name: 'test name', artist: 'test artist' },
  { name: 'test name', artist: 'test artist' },
  { name: 'test name', artist: 'test artist' },
  { name: 'test name', artist: 'test artist' },
  { name: 'test name', artist: 'test artist' },
  { name: 'test name', artist: 'test artist' },
  { name: 'test name', artist: 'test artist' },
  { name: 'test name', artist: 'test artist' },
  { name: 'test name', artist: 'test artist' },
  { name: 'test name', artist: 'test artist' },
  { name: 'test name', artist: 'test artist' },
];
export const genreArray: genre[] = [
  { name: 'test genre' },
  { name: 'test genre' },
  { name: 'test genre' },
  { name: 'test genre' },
  { name: 'test genre' },
  { name: 'test genre' },
  { name: 'test genre' },
  { name: 'test genre' },
  { name: 'test genre' },
  { name: 'test genre' },
  { name: 'test genre' },
  { name: 'test genre' },
  { name: 'test genre' },
  { name: 'test genre' },
  { name: 'test genre' },
  { name: 'test genre' },
  { name: 'test genre' },
  { name: 'test genre' },
  { name: 'test genre' },
  { name: 'test genre' },
  { name: 'test genre' },
  { name: 'test genre' },
  { name: 'test genre' },
  { name: 'test genre' },
];

@Component({
  selector: 'jhi-initial-training',
  templateUrl: './initial-training.component.html',
  styleUrls: ['./initial-training.component.scss'],
})
export class InitialTrainingComponent implements OnInit {
  constructor(private http: HttpClient) {}

  doneButtonClick() {
    let ids: Array<string> = [];
    this.http.post('/api/songs/training', ids).subscribe(response => {
      console.log(response);
    });
  }

  outSongArray: song[] = songArray;
  outGenreArray: genre[] = genreArray;

  ngOnInit(): void {}
}
