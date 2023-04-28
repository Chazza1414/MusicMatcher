import { Component, OnInit } from '@angular/core';
import { ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'jhi-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  highContrast = false;
  selectedTextSize: string = 'medium';

  constructor() {}

  ngOnInit(): void {}

  toggleHighContrastMode(enableHighContrast: boolean): void {
    this.highContrast = enableHighContrast;
    const highContrastColor = '#00008b';
    const defaultColor = 'white';

    const appBody = document.getElementById('app-body');

    if (appBody) {
      if (enableHighContrast) {
        appBody.style.setProperty('--background-color', highContrastColor);
        appBody.style.setProperty('--text-color', defaultColor);
      } else {
        appBody.style.setProperty('--background-color', defaultColor);
        appBody.style.setProperty('--text-color', '#333');
      }
    }
  }
  @ViewChild('textSizeContainer') textSizeContainer!: ElementRef;

  setTextSize() {
    const container = this.textSizeContainer.nativeElement;
    container.className = this.selectedTextSize;
    this.setFontSize(container, this.selectedTextSize);
  }

  setFontSize(element: any, textSize: string) {
    switch (textSize) {
      case 'small':
        element.style.fontSize = '0.8rem';
        break;
      case 'medium':
        element.style.fontSize = '1rem';
        break;
      case 'large':
        element.style.fontSize = '1.2rem';
        break;
      case 'extreme-large':
        element.style.fontSize = '1.5rem';
        break;
    }

    // Apply the font size to all child elements
    const children = element.children;
    for (let i = 0; i < children.length; i++) {
      this.setFontSize(children[i], textSize);
    }
  }
}
