import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'jhi-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})

/*export class SettingComponent {
  darkMode = false;

  toggleDarkMode(checked: boolean) {
    this.darkMode = checked;
    if (checked) {
      document.documentElement.style.setProperty('--background-color', '#1a1a1a');
      document.documentElement.style.setProperty('--text-color', '#fff');
    } else {
      document.documentElement.style.setProperty('--background-color', '#fff');
      document.documentElement.style.setProperty('--text-color', '#333');
    }
  }

  toggleHighContrast() {
    // implement your logic here
  }

  setTextSize(size: string) {
    // implement your logic here
  }

  setVolume(value: number) {
    // implement your logic here
  }
}

 */
export class SettingsComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
