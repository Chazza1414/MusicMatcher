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
  voiceOverEnabled = false;
  voiceOver = window.speechSynthesis;
  speechSynthesisSupported: boolean;

  voiceOverUtterance = new SpeechSynthesisUtterance();

  constructor() {
    const savedTextSize = localStorage.getItem('selectedTextSize');
    this.selectedTextSize = savedTextSize ? savedTextSize : 'medium';
    this.speechSynthesisSupported = 'speechSynthesis' in window;
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
        appBody.style.setProperty('--blacktowhite-color', '#000000');
        appBody.style.setProperty('--lightgreytoblack-color', '#000000');
        appBody.style.setProperty('--completewhite', '#23395d');
        appBody.style.setProperty('--like-song-color', '#23395d');
        appBody.style.setProperty('--playbutton-color', '#ffffff');
        appBody.style.setProperty('--playbutton2-color', '#FFFF00');
        appBody.style.setProperty('--link-to-gdpr-color', '#FFFF00');
      } else {
        appBody.style.setProperty('--background-color', defaultColor);
        appBody.style.setProperty('--text-color', '#333');
        appBody.style.setProperty('--secondary-color', secondaryColor);
        appBody.style.setProperty('--third-color', thirdColor);
        appBody.style.setProperty('--border-color', '#333');
        appBody.style.setProperty('--initial-training-background-color', '#c7fdff');
        appBody.style.setProperty('--blacktowhite-color', '#c7fdff');
        appBody.style.setProperty('--lightgreytoblack-color', '#D3D3D3');
        appBody.style.setProperty('--completewhite', '#ffffff');
        appBody.style.setProperty('--like-song-color', '#d3d3d3');
        appBody.style.setProperty('--playbutton-color', '#0d122b');
        appBody.style.setProperty('--playbutton2-color', '#0000FF');
        appBody.style.setProperty('--link-to-gdpr-color', '#533f03');
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

  toggleVoiceOver(enableVoiceOver: boolean): void {
    if (!this.speechSynthesisSupported) {
      console.warn('Your browser does not support the Web Speech API.');
      return;
    }

    this.voiceOverEnabled = enableVoiceOver;
    const readableTitles = document.querySelectorAll('.readable-title');

    if (this.voiceOverEnabled) {
      readableTitles.forEach(el => el.addEventListener('mouseover', this.readText as EventListener));
    } else {
      readableTitles.forEach(el => el.removeEventListener('mouseover', this.readText as EventListener));
      window.speechSynthesis.cancel(); // Cancel any ongoing speech
    }
  }

  readText = (event: MouseEvent): void => {
    if (!this.voiceOverEnabled) return;

    const targetElement = event.target as HTMLElement;
    const textToRead = targetElement.tagName === 'SECTION' ? targetElement.getAttribute('title') : targetElement.textContent;

    if (textToRead) {
      const speech = new SpeechSynthesisUtterance(textToRead);
      window.speechSynthesis.cancel(); // Cancel any ongoing speech
      window.speechSynthesis.speak(speech);
    }
  };
}
