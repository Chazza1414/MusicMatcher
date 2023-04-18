import { Component, OnInit } from '@angular/core';
import { InitialTrainingComponent } from '../initial-training.component';

@Component({
  selector: 'jhi-close',
  templateUrl: './close.component.html',
  styleUrls: ['./close.component.scss'],
})
export class CloseComponent implements OnInit {
  constructor(private initComp: InitialTrainingComponent) {}

  closeWindow() {
    //this.initComp.windowClosed(window.location.href)
  }

  ngOnInit(): void {}
}
