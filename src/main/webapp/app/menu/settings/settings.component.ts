import { Component, OnInit } from '@angular/core';
import { ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'jhi-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  highContrast = false;
  selectedTextSize: string;

  constructor() {
    const savedTextSize = localStorage.getItem('selectedTextSize');
    this.selectedTextSize = savedTextSize ? savedTextSize : 'medium';
  }

  ngOnInit(): void {
    this.applyTextSize();
  }

  toggleHighContrastMode(enableHighContrast: boolean): void {
    this.highContrast = enableHighContrast;
    const highContrastColor = '#00008b';
    const defaultColor = 'white';
    const secondaryColor = 'Brown';
    const thirdColor = 'yellow';
    const setToWhite = 'white';

    const appBody = document.getElementById('app-body');
    console.log('yh');
    console.log(appBody);

    if (appBody) {
      if (enableHighContrast) {
        appBody.style.setProperty('--background-color', highContrastColor);
        appBody.style.setProperty('--text-color', defaultColor);
        appBody.style.setProperty('--secondary-color', secondaryColor);
        appBody.style.setProperty('--third-color', thirdColor);
        appBody.style.setProperty('--border-color', setToWhite);
        appBody.style.setProperty('--initial-training-background-color', thirdColor);
      } else {
        appBody.style.setProperty('--background-color', defaultColor);
        appBody.style.setProperty('--text-color', '#333');
        appBody.style.setProperty('--secondary-color', secondaryColor);
        appBody.style.setProperty('--third-color', thirdColor);
        appBody.style.setProperty('--border-color', '#333');
        appBody.style.setProperty('--initial-training-background-color', '#c7fdff');
      }
    }
  }

  applyTextSize(): void {
    const container = document.querySelector('.text-size-container');
    if (container) {
      container.className = `settings-container ${this.selectedTextSize}`;
    }
  }

  setTextSize(size: string): void {
    this.selectedTextSize = size;
    // Save the text size to local storage
    localStorage.setItem('selectedTextSize', size);
    this.applyTextSize();
  }
}
