import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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

  ngOnInit(): void {}
}
