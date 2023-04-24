import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'; // Add this import

import { dislikedSongsRoute } from './disliked-songs.route';
import { DislikedSongsComponent } from './disliked-songs.component';

@NgModule({
  imports: [SharedModule, RouterModule.forChild([dislikedSongsRoute]), FontAwesomeModule], // Add FontAwesomeModule to the imports array
  declarations: [DislikedSongsComponent],
})
export class DislikedSongsModule {} // Define the DislikedSongsModule separately
