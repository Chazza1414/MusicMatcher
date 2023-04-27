/*

import { Component, OnInit, Renderer2, ElementRef } from '@angular/core';

@Component({
  selector: 'jhi-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  constructor(private renderer: Renderer2, private el: ElementRef) {
  }

  ngOnInit(): void {
    const highContrastToggle = this.el.nativeElement.querySelector('#highContrastToggle');
    highContrastToggle.addEventListener('change', (event: Event) => this.toggleHighContrastMode((event.target as HTMLInputElement).checked));
  }

  toggleHighContrastMode(checked: boolean): void {
    // Define the deep blue color for high contrast mode
    const highContrastColor = '#00008b';

// Get the :root element to change the --background-color variable
    const rootElement = this.el.nativeElement.closest(':root');

    if (checked) {
      // Set background color to deep blue when high contrast mode is on
      this.renderer.setStyle(rootElement, 'var(--background-color)', highContrastColor);
    } else {
      // Reset the background color to its initial value when high contrast mode is off
      this.renderer.removeStyle(rootElement, 'var(--background-color)');
    }
  }
}

 */
/*
import { Component, OnInit, Renderer2, ElementRef } from '@angular/core';

@Component({
  selector: 'jhi-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  highContrast = false;

  constructor(private renderer: Renderer2, private el: ElementRef) {}

  ngOnInit(): void {}

  toggleHighContrastMode(enableHighContrast: boolean): void {
    this.highContrast = enableHighContrast;
    const highContrastColor = '#00008b';
    const defaultColor = 'white';
    const rootElement = this.el.nativeElement.closest(':root');

    if (enableHighContrast) {
      this.renderer.setStyle(rootElement, '--background-color', highContrastColor);
    } else {
      this.renderer.setStyle(rootElement, '--background-color', defaultColor);
    }
  }
}

 */
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'jhi-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  highContrast = false;

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
}
